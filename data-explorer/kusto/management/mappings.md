---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 05/19/2020
---

# Data mappings

Data mappings are used during ingestion to map incoming data to columns inside Kusto tables.

Kusto supports different types of mappings, both `row-oriented` (CSV, JSON, AVRO and W3CLOGFILE), and `column-oriented` (Parquet and ORC).

Each element in the mapping list is constructed from three properties:

|Property|Description|
|----|--|
|`Column`|Target column name in the Kusto table|
|`Datatype`| (Optional) Datatype with which to create the mapped column if it doesn't already exist in the Kusto table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.|

All mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

## CSV mapping

When the source file is a CSV (or any delimeter-separated format) and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

CSV mapping can be applied on all the delimiter-separated formats: CSV, TSV, PSV, SCSV, and SOHsv.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Ordinal`|The column order number in CSV.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the CSV file.|

> [!NOTE]
> `Ordinal` and `ConstantValue` are mutually exclusive.

### Example of the CSV mapping

``` json
[
  {"Column": "event_time", "Properties": {"Ordinal": "0"}},
  {"Column": "event_name", "Properties": {"Ordinal": "1"}},
  {"Column": "event_type", "Properties": {"Ordinal": "2"}},
  {"Column": "ingestion_time", "Properties": {"ConstValue": "2021-01-01T10:32:00"}}
]
```

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMapping = 
        '['
            '{"Column": "column_a", "Properties": {"Ordinal": 0}},'
            '{"Column": "column_b", "Properties": {"Ordinal": 1}}'
        ']'
    )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="csv", 
        ingestionMappingReference = "MappingName"
    )
```

## JSON mapping

When the source file is in JSON format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the JSON mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties: 

|Property|Description|
|----|--|
|`Path`|If the value starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\'].|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside JSON file.|
|`Transform`|(Optional) Transformation that should be applied on the content with [mapping transformations](#mapping-transformations).|

### Example of JSON mapping

```json
[
  {"Column": "event_timestamp", "Properties": {"Path": "$.Timestamp"}}, 
  {"Column": "event_name",      "Properties": {"Path": "$.Event.Name"}}, 
  {"Column": "event_type",      "Properties": {"Path": "$.Event.Type"}}, 
  {"Column": "source_uri",      "Properties": {"Transform": "SourceLocation"}}, 
  {"Column": "source_line",     "Properties": {"Transform": "SourceLineNumber"}}, 
  {"Column": "event_time",      "Properties": {"Path": "$.Timestamp", "Transform": "DateTimeFromUnixMilliseconds"}}, 
  {"Column": "ingestion_time", "Properties": {"ConstValue": "2021-01-01T10:32:00"}}, 
  {"Column": "full_record",     "Properties": {"Path": "$"}}
]
```

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "json", 
      ingestionMapping = 
      '['
        '{"Column": "column_a", "Properties": {"Path": "$.Obj.Property"}},'
        '{"Column": "column_b", "Properties": {"Path": "$.Property"}},'
        '{"Column": "custom_column", "Properties": {"Path": "$.[\'Property name with space\']"}}'
      ']'
  )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="json", 
        ingestionMappingReference = "Mapping_Name"
    )
```
    
## AVRO mapping

When the source file is in AVRO format, the AVRO file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the AVRO mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties: 

|Property|Description|
|----|--|
|`Field`|The name of the field in the AVRO record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an AVRO record-field, if necessary. The value denotes a JSON-path from the root of the AVRO record (JSON path that denotes the entire AVRO record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. See the Notes below for more information.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside AVRO file.|
|`Transform`|(Optional) Transformation that should be applied on the content with [supported transformations](#mapping-transformations).|

**Notes**
>[!NOTE]
> * `Field` and `Path` cannot be used together; only one is allowed. 

The two alternatives below are equal:

``` json
[
  {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
]
```

``` json
[
  {"Column": "event_name", "Properties": {"Field": "EventName"}}
]
```

### Example of the AVRO mapping

``` json
[
  {"Column": "event_timestamp", "Properties": {"Field": "Timestamp"}},
  {"Column": "event_name",      "Properties": {"Field": "Name"}},
  {"Column": "event_type",      "Properties": {"Field": "Type"}},
  {"Column": "event_time",      "Properties": {"Field": "Timestamp", "Transform": "DateTimeFromUnixMilliseconds"}}, 
  {"Column": "ingestion_time",  "Properties": {"ConstValue": "2021-01-01T10:32:00"}}, 
  {"Column": "full_record",     "Properties": {"Path": "$"}} 
]
``` 

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "AVRO", 
      ingestionMapping = 
      '['
        '{"Column": "column_a", "Properties": {"Field": "Field1"}},'
        '{"Column": "column_b", "Properties": {"Field": "$.[\'Field name with space\']"}}'
      ']'
  )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="AVRO", 
        ingestionMappingReference = "Mapping_Name"
    )
```

## Parquet mapping

When the source file is in Parquet format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the Parquet record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an Parquet record-field, if necessary. The value denotes a JSON-path from the root of the Parquet record (JSON path that denotes the entire AVRO record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. See the Notes below for more information.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside Parquet file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

> * `Field` and `Path` cannot be used together, only one is allowed. 

The two alternatives below are equal:

``` json
[
  {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
]
```

``` json
[
  {"Column": "event_name", "Properties": {"Field": "EventName"}}
]
```

### Example of the Parquet mapping

```json
[
  {"Column": "event_timestamp", "Properties": {"Path": "$.Timestamp"}}, 
  {"Column": "event_name",      "Properties": {"Path": "$.Event.Name"}}, 
  {"Column": "event_type",      "Properties": {"Path": "$.Event.Type"}}, 
  {"Column": "event_time",      "Properties": {"Path": "$.Timestamp", "Transform": "DateTimeFromUnixMilliseconds"}}, 
  {"Column": "ingestion_time",  "Properties": {"ConstValue": "2021-01-01T10:32:00"}}, 
  {"Column": "full_record",     "Properties": {"Path": "$"}} 
]
```

> [!NOTE]
> When the mapping above is provided as part of the `.ingest` control command it is serialized as a JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "parquet", 
      ingestionMapping = 
      '['
        '{"Column": "column_a", "Properties": {"Path": "$.Field1.Subfield"}},'
        '{"Column": "column_b", "Properties": {"Path": "$.[\'Field name with space\']"}},'
      ']'
  )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md), it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="parquet", 
        ingestionMappingReference = "Mapping_Name"
    )
```

## ORC mapping

When the source file is in ORC format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the ORC mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the ORC record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an ORC record-field, if necessary. The value denotes a JSON-path from the root of the ORC record (JSON path that denotes the entire ORC record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. See the Notes below for more information.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the ORC file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

> * `Field` and `Path` cannot be used together, only one is allowed. 

The two alternatives below are equal:

``` json
[
  {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
]
```

``` json
[
  {"Column": "event_name", "Properties": {"Field": "EventName"}}
]
```

### Example of ORC mapping

```json
[
  {"Column": "event_timestamp", "Properties": {"Path": "$.Timestamp"}}, 
  {"Column": "event_name",      "Properties": {"Path": "$.Event.Name"}}, 
  {"Column": "event_type",      "Properties": {"Path": "$.Event.Type"}}, 
  {"Column": "event_time",      "Properties": {"Path": "$.Timestamp", "Transform": "DateTimeFromUnixMilliseconds"}}, 
  {"Column": "ingestion_time",  "Properties": {"ConstValue": "2021-01-01T10:32:00"}}, 
  {"Column": "full_record",     "Properties": {"Path": "$"}} 
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
      '['
        '{"Column": "column_a", "Properties": {"Path": "$.Field1"}},'
        '{"Column": "column_b", "Properties": {"Path": "$.[\'Field name with space\']"}}'
      ']'
  )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="orc", 
        ingestionMappingReference = "ORC_Mapping"
    )
```

## W3CLOGFILE mapping

When the source file is in W3CLOGFILE format, the file content is mapped to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the W3CLOGFILE mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|W3CLOGFILE entry name|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside W3CLOGFILE file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

### Example of W3CLOGFILE mapping

```json
[
   {"Column": "Date",          "Properties": {"Field": "date"}},
   {"Column": "Time",          "Properties": {"Field": "time"}},
   {"Column": "IP",            "Properties": {"Field": "s-ip"}},
   {"Column": "ClientMethod",  "Properties": {"Field": "cs-method"}},
   {"Column": "ClientQuery",   "Properties": {"Field": "cs-uri-query"}},
   {"Column": "ServerPort",    "Properties": {"Field": "s-port"}},
   {"Column": "ClientIP",      "Properties": {"Field": "c-ip"}},
   {"Column": "UserAgent",     "Properties": {"Field": "cs(User-Agent)"}},
   {"Column": "Referer",       "Properties": {"Field": "cs(Referer)"}},
   {"Column": "Status",        "Properties": {"Field": "sc-status"}},
   {"Column": "ResponseBytes", "Properties": {"Field": "sc-bytes"}},
   {"Column": "RequestBytes",  "Properties": {"Field": "cs-bytes"}},
   {"Column": "TimeTaken",     "Properties": {"Field": "time-taken"}}
]
```

> [!NOTE]
> The only supported transformations for W3CLOGFILE format are: `SourceLineNumber` and `SourceLocation`.
> When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string.

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with 
  (
      format = "w3clogfile", 
      ingestionMapping = 
      '['
         '{"Column": "column_a", "Properties": {"Field": "field1"}},' 
         '{"Column": "column_b", "Properties": {"Field": "field2"}}'
      ']'
  )
```

> [!NOTE]
> When the mapping above is [pre-created](create-ingestion-mapping-command.md) it can be referenced in the `.ingest` control command:

```kusto
.ingest into Table123 (@"source1", @"source2")
    with 
    (
        format="w3clogfile", 
        ingestionMappingReference = "Mapping_Name"
    )
```

## Mapping transformations

Some of the data format mappings (Parquet, JSON and AVRO) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use [Update policy](update-policy.md), which allows defining lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms JSON array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (for example, {"n1":"v1","n2":"v2"}).|Can be applied only when `Path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|
