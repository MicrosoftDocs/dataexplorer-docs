---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/05/2019
---
# Data mappings

This article describes data mappings that are used at ingestion time to map incoming data to columns inside Kusto tables.
Kusto supports different types of mappings, both `row-oriented` as CSV, JSON and AVRO, and `column-oriented` as Parquet.

Each element in the mapping list is constructed from 3 properties:

|Property|Description|
|----|--|
|`column`|Target column name in the Kusto table|
|`datatype`| (Optional) Datatype with which to create the mapped column if not already exists in the Kusto table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.


All mappings can be [pre-created](tables.md#create-ingestion-mapping) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

## CSV Mapping

When the source file is in CSV format (or any delimeter-separated format) and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

CSV mapping can be applied on all the delimiter-separated formats, namely: CSV, TSV, PSV, SCSV, SOHsv.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`ordinal`|The column order number in csv.|
|`constantValue`|(Optional) The constant value to be used for a column instead of some value inside the csv|

* Note: `Ordinal` and `ConstantValue` are mutually exclusive.

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

**Notes**

* When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMapping = 
        "["
            "{\"column\":\"rownumber\",\"Properties\":{\"Ordinal\":\"0"}},"
            "{\"column\":\"rowguid\",  \"Properties\":{\"Ordinal\":\"1"}}"
        "]" 
    )
```

> Deprecated mapping format: The former mapping format allowed different definition for each mapping, where properties could be specified without 'Properties' dictionary. The deprecated format is shown below.

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

## JSON Mapping

When the source file is in JSON format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Json mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties: 

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content. See [mapping transformations](#mapping-transformations).|


### Example of the JSON Mapping

``` json
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

 **Note**
 
 *  When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "json", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},"
        "{\"column\":\"rowguid\",  \"Properties\":{\"Path\":\"$.rowguid\"}}"
      "]"
  )
```

> Deprecated mapping format: previous version's mapping format allowed different definition for each mapping, where properties could be specified without 'Properties' dictionary. The deprecated format is shown below.

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
    
## Avro Mapping

When the source file is in Avro format, this maps the Avro file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the Avro Mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain and may contain the following properties: 

|Property|Description|
|----|--|
|`Field`|The name of the field in the Avro record.|
|`Path`|Alternative of using `field` which allows taking inner part of an Avro record-field if necessarry. The value denotes JSON-path from the root of the record. See Notes section below for more information. |
|`transform`|(Optional) Transformation that should be applied on the content. See [supported transformations](#mapping-transformations).|

**Notes**

- `field` and `path` cannot be used together - only one is allowed. 
- `path` cannot point to root `$` only, it must have at least one level of path.
- The two alternatives below are equal:

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

**Notes**
* When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: 

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "avro", 
      ingestionMapping = 
      "["
        "{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},"
        "{\"column\":\"rowguid\",  \"Properties\":{\"Path\":\"$.rowguid\"}}"
      "]"
  )
```

> Deprecated mapping format: previous version's mapping format allowed different definition for each mapping, where properties could be specified without 'Properties' dictionary. The deprecated format is shown below.

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

## Parquet Mapping

When the source file is in Parquet format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain  the following properties:

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the Parquet document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content. See [mapping transformations](#mapping-transformations).|


### Example of the Parquet Mapping

``` json
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

**Note**

When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

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

## Mapping transformations

Some of the data format mappings (Parquet, Json and Avro) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time - one can use [Update policy](update-policy.md), which allows defining a lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms Json array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (e.g. {"n1":"v1","n2":"v2"}).|Can be applied only when `path` is used|
|`GetPathElement(index)`|Extracts an element from the given path according to the given index (e.g. Path: $.a.b.c, GetPathElement(0) == "c", GetPathElement(-1) == "b", type string|Can be applied only when `path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (e.g. the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|