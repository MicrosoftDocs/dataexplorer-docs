---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: ohbitton
ms.service: data-explorer
ms.topic: reference
ms.date: 05/19/2020
---
# Data mappings

Data mappings are used during ingestion to map incoming data to columns inside Kusto tables.

Kusto supports different types of mappings, both `row-oriented` (CSV, JSON and AVRO), and `column-oriented` (Parquet).

Each element in the mapping list is constructed from three properties:

|Property|Description|
|----|--|
|`column`|Target column name in the Kusto table|
|`datatype`| (Optional) Datatype with which to create the mapped column if it doesn't already exist in the Kusto table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.


All mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

## CSV mapping

When the source file is a CSV (or any delimeter-separated format) and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

CSV mapping can be applied on all the delimiter-separated formats: CSV, TSV, PSV, SCSV, and SOHsv.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`ordinal`|The column order number in CSV|
|`constantValue`|(Optional) The constant value to be used for a column instead of some value inside the CSV|

> [!NOTE]
> `Ordinal` and `ConstantValue` are mutually exclusive.

### Example of the CSV mapping

``` json
[
  { "column" : "rownumber", "Properties":{"Ordinal":"0"}},
  { "column" : "rowguid",   "Properties":{"Ordinal":"1"}},
  { "column" : "xdouble",   "Properties":{"Ordinal":"2"}},
  { "column" : "xbool",     "Properties":{"Ordinal":"3"}},
  { "column" : "xint32",    "Properties":{"Ordinal":"4"}},
  { "column" : "xint64",    "Properties":{"Ordinal":"5"}},
  { "column" : "xdate",     "Properties":{"Ordinal":"6"}},
  { "column" : "xtext",     "Properties":{"Ordinal":"7"}},
  { "column" : "const_val", "Properties":{"ConstValue":"Sample: constant value"}}
]
```

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string.

* When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMappingReference = "Mapping1"
    )
```

* When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMapping = 
        "["
            "{\"column\":\"rownumber\",\"Properties\":{\"Ordinal\":0}},"
            "{\"column\":\"rowguid\",  \"Properties\":{\"Ordinal\":1}}"
        "]" 
    )
```

**Note:** 
The following mapping format, without the `Properties` property-bag, is deprecated.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMapping = 
        "["
            "{\"column\":\"rownumber\",\"Ordinal\": 0},"
            "{\"column\":\"rowguid\",  \"Ordinal\": 1}"
        "]" 
    )
```

## JSON mapping

When the source file is in JSON format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the JSON mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties: 

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content with [mapping transformations](#mapping-transformations).|

### Example of JSON mapping

```json
[
  { "column" : "rownumber",   "Properties":{"Path":"$.rownumber"}}, 
  { "column" : "rowguid",     "Properties":{"Path":"$.rowguid"}}, 
  { "column" : "xdouble",     "Properties":{"Path":"$.xdouble"}}, 
  { "column" : "xbool",       "Properties":{"Path":"$.xbool"}}, 
  { "column" : "xint32",      "Properties":{"Path":"$.xint32"}}, 
  { "column" : "xint64",      "Properties":{"Path":"$.xint64"}}, 
  { "column" : "xdate",       "Properties":{"Path":"$.xdate"}}, 
  { "column" : "xtext",       "Properties":{"Path":"$.xtext"}}, 
  { "column" : "location",    "Properties":{"transform":"SourceLocation"}}, 
  { "column" : "lineNumber",  "Properties":{"transform":"SourceLineNumber"}}, 
  { "column" : "full_record", "Properties":{"Path":"$"}}
]
```

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="json", 
        ingestionMappingReference = "Mapping1"
    )
```

**Note:** 
The following mapping format, without the `Properties` property-bag, is deprecated.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "json", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"path\":\"$.rownumber\"},"
        "{\"column\":\"rowguid\",  \"path\":\"$.rowguid\"}"
      "]"
  )
```
    
## Avro mapping

When the source file is in Avro format, the Avro file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the Avro mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties: 

|Property|Description|
|----|--|
|`Field`|The name of the field in the Avro record.|
|`Path`|Alternative to using `field` which allows taking the inner part of an Avro record-field, if necessary. The value denotes a JSON-path from the root of the record. See the Notes below for more information. |
|`transform`|(Optional) Transformation that should be applied on the content with [supported transformations](#mapping-transformations).|

**Notes**
>[!NOTE]
> * `field` and `path` cannot be used together,only one is allowed. 
> * `path` cannot point to root `$` only, it must have at least one level of path.

The two alternatives below are equal:

``` json
[
  {"column": "rownumber", "Properties":{"Path":"$.RowNumber"}}
]
```

``` json
[
  {"column": "rownumber", "Properties":{"Field":"RowNumber"}}
]
```

### Example of the AVRO mapping

``` json
[
  {"column": "rownumber", "Properties":{"Field":"rownumber"}},
  {"column": "rowguid",   "Properties":{"Field":"rowguid"}},
  {"column": "xdouble",   "Properties":{"Field":"xdouble"}},
  {"column": "xboolean",  "Properties":{"Field":"xboolean"}},
  {"column": "xint32",    "Properties":{"Field":"xint32"}},
  {"column": "xint64",    "Properties":{"Field":"xint64"}},
  {"column": "xdate",     "Properties":{"Field":"xdate"}},
  {"column": "xtext",     "Properties":{"Field":"xtext"}}
]
``` 

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="avro", 
        ingestionMappingReference = "Mapping1"
    )
```

**Note:** 
The following mapping format, without the `Properties` property-bag, is deprecated.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "avro", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"field\":\"rownumber\"},"
        "{\"column\":\"rowguid\",  \"field\":\"rowguid\"}"
      "]"
  )
```

## Parquet mapping

When the source file is in Parquet format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the Parquet document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.


### Example of the Parquet mapping

```json
[
  { "column" : "rownumber",   "Properties":{"Path":"$.rownumber"}}, 
  { "column" : "xdouble",     "Properties":{"Path":"$.xdouble"}}, 
  { "column" : "xbool",       "Properties":{"Path":"$.xbool"}}, 
  { "column" : "xint64",      "Properties":{"Path":"$.xint64"}}, 
  { "column" : "xdate",       "Properties":{"Path":"$.xdate"}}, 
  { "column" : "xtext",       "Properties":{"Path":"$.xtext"}}, 
  { "column" : "location",    "Properties":{"transform":"SourceLocation"}}, 
  { "column" : "lineNumber",  "Properties":{"transform":"SourceLineNumber"}}, 
  { "column" : "full_record", "Properties":{"Path":"$"}}
]
```      

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string.

* When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="parquet", 
        ingestionMappingReference = "Mapping1"
    )
```

* When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "parquet", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},"
        "{\"column\":\"rowguid\",  \"Properties\":{\"Path\":\"$.rowguid\"}}"
      "]"
  )
```

## Orc mapping

When the source file is in Orc format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Orc mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the Orc document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.

### Example of Orc mapping

```json
[
  { "column" : "rownumber",   "Properties":{"Path":"$.rownumber"}}, 
  { "column" : "xdouble",     "Properties":{"Path":"$.xdouble"}}, 
  { "column" : "xbool",       "Properties":{"Path":"$.xbool"}}, 
  { "column" : "xint64",      "Properties":{"Path":"$.xint64"}}, 
  { "column" : "xdate",       "Properties":{"Path":"$.xdate"}}, 
  { "column" : "xtext",       "Properties":{"Path":"$.xtext"}}, 
  { "column" : "location",    "Properties":{"transform":"SourceLocation"}}, 
  { "column" : "lineNumber",  "Properties":{"transform":"SourceLineNumber"}}, 
  { "column" : "full_record", "Properties":{"Path":"$"}}
]
```      

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "orc", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},"
        "{\"column\":\"rowguid\",  \"Properties\":{\"Path\":\"$.rowguid\"}}"
      "]"
  )
```

## Mapping transformations

Some of the data format mappings (Parquet, JSON and Avro) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use [Update policy](update-policy.md), which allows defining lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms JSON array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (for example, {"n1":"v1","n2":"v2"}).|Can be applied only when `path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|
