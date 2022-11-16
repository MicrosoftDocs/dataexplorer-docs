---
title: Parquet Mapping - Azure Data Explorer
description: Learn how to use Parquet mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---


# Parquet mapping

Parquet mapping is one type of [data mapping](mappings.md) used to map incoming data to columns inside tables.

When the source file is in Parquet format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the Parquet record.|
|`Path`|Alternative to using `Field` that allows taking the inner part of a Parquet record-field, if necessary. The value denotes a JSON-path from the root of the Parquet record (JSON path that denotes the entire AVRO record is `$`). If the value doesn't start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside Parquet file.|
|`Transform`|(Optional) [mapping transformations](mappings.md#mapping-transformations) that should be applied on the content.|

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

## Example

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

The mapping above is serialized as a JSON string when it is provided as part of the `.ingest` control command.

````kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format = "parquet",
      ingestionMapping =
      ```
      [
        {"Column": "column_a", "Properties": {"Path": "$.Field1.Subfield"}},
        {"Column": "column_b", "Properties": {"Path": "$.[\'Field name with space\']"}},
      ]
      ```
  )
````

## Example using a pre-created mapping

When the mapping above is [pre-created](create-ingestion-mapping-command.md), reference it by name in the `.ingest` control command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="parquet",
        ingestionMappingReference = "Mapping_Name"
    )
```

## Example using identity mapping

Use Parquet mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="parquet"
    )
```
