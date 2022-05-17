---
title: Data mappings - Azure Data Explorer
description: This article describes Data mappings in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/13/2021
---

# Data mappings

Data mappings are used during ingestion to map incoming data to columns inside tables.

Data Explorer supports different types of mappings, both `row-oriented` (CSV, JSON, AVRO and W3CLOGFILE), and `column-oriented` (Parquet and ORC).

Each element in the mapping list is constructed from three properties:

|Property|Description|
|----|--|
|`Column`|Target column name in the table|
|`Datatype`| (Optional) Datatype with which to create the mapped column if it doesn't already exist in the table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.|

The mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

## CSV mapping

When the source file is a CSV (or any delimiter-separated format) and its schema doesn't match the current table schema, a CSV mapping maps from the file schema to the table schema. If the table doesn't exist in Azure Data Explorer, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added.

CSV mapping can be applied on all the delimiter-separated formats: CSV, TSV, PSV, SCSV, and SOHsv.

Each element in the list describes a mapping for a specific column, and must contain either of the following properties:

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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="csv"
    )
```

## JSON mapping

When the source file is in JSON format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the JSON mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Path`|If the value starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the JSON file.|
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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="json"
    )
```

### Example copying JSON mapping

You can copy JSON mapping of an existing table and create a new table with the same mapping using the following process:

1. Run the following command on the table whose mapping you want to copy:

    ```kusto
    .show table TABLENAME ingestion json mappings
    | extend formatted_mapping = strcat("'",replace_string(Mapping, "'", "\\'"),"'")
    | project formatted_mapping
    ```

1. Use the output of the above command to create a new table with the same mapping:

    ```kusto
    .create table TABLENAME ingestion json mapping "TABLENAME_Mapping" RESULT_OF_ABOVE_CMD
    ```

## AVRO mapping

When the source file is in AVRO format, the AVRO file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped.
The columns mapped in the AVRO mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the AVRO record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an AVRO record-field, if necessary. The value denotes a JSON path from the root of the AVRO record (JSON path that denotes the entire AVRO record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside AVRO file.|
|`Transform`|(Optional) Transformation that should be applied on the content with [supported transformations](#mapping-transformations).|

>[!NOTE]
> `Field` and `Path` cannot be used together; only one is allowed.
>
> The following alternatives are equal:
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
> ]
> ```
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Field": "EventName"}}
> ]
> ```

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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO"
    )
```

## Parquet mapping

When the source file is in Parquet format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the Parquet record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an Parquet record-field, if necessary. The value denotes a JSON-path from the root of the Parquet record (JSON path that denotes the entire AVRO record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside Parquet file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

> [!NOTE]
> `Field` and `Path` cannot be used together; only one is allowed.
>
> The following alternatives are equal:
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
> ]
> ```
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Field": "EventName"}}
> ]
> ```

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
> When the mapping above is provided as part of the `.ingest` control command, the mapping is serialized as a JSON string.

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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="parquet"
    )
```

## ORC mapping

When the source file is in ORC format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the ORC mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the ORC record.|
|`Path`|Alternative to using `Field` which allows taking the inner part of an ORC record-field, if necessary. The value denotes a JSON-path from the root of the ORC record (JSON path that denotes the entire ORC record is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the ORC file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

> [!NOTE]
> `Field` and `Path` cannot be used together; only one is allowed.
>
> The following alternatives are equal:
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Path": "$.EventName"}}
> ]
> ```
>
> ``` json
> [
>   {"Column": "event_name", "Properties": {"Field": "EventName"}}
> ]
> ```

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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="orc"
    )
```

## W3CLOGFILE mapping

When the source file is in W3CLOGFILE format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the W3CLOGFILE mapping must exist in the table unless a datatype is specified for all the non-existing columns.

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

> [!NOTE]
> Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="w3clogfile"
    )
```

## Mapping transformations

Some of the data format mappings (Parquet, JSON and AVRO) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use [Update policy](./show-table-update-policy-command.md), which allows defining lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms JSON array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (for example, {"n1":"v1","n2":"v2"}).|Can be applied only when `Path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|

## Identity mapping

Ingestion is possible without specifying `ingestionMapping` or `ingestionMappingReference` properties. The data will be mapped using an identity data mapping derived from the table's schema. The table schema will remain the same. `format` property should be specified. (see [ingestion formats](../../ingestion-supported-formats.md)).

|Format type|Format|Mapping logic|
|---------|---------| ---------|
|Tabular data formats with defined order of columns, such as delimiter-separated or single-line formats| `CSV`, `TSV`, `TSVe`, `PSV`, `SCSV`, `Txt`, `SOHsv`, `Raw`| All table columns are mapped in their respective order to data columns in order they appear in the data source. Column data type is taken from the table schema. |
|Formats with named columns or records with named fields|`JSON`, `Parquet`, `Avro`, `ApacheAvro`, `Orc`, `W3CLOGFILE`| All table columns are mapped to data columns or record fields having the same name (case-sensitive). Column data type is taken from the table schema. |

> [!WARNING]
> Any mismatch between the table schema and the structure of data, such as column or field data types, column or field names or their number might result in empty or incorrect data ingested.
