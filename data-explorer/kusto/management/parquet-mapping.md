---
title: Parquet Mapping
description: Learn how to use Parquet mapping to map data to columns inside tables upon ingestion and optimize data processing in Kusto.
ms.topic: reference
ms.date: 03/27/2024
---
# Parquet mapping

Use Parquet mapping to map incoming data to columns inside tables when your ingestion source file is in Parquet format.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each Parquet mapping element must contain either of the following optional properties:

| Property | Type | Description |
|--|--|--|
| Field | `string` | Name of the field in the Parquet record. |
| Path | `string` | If the value starts with `$` it's interpreted as the path to the field in the Parquet document that will become the content of the column in the table. The path that denotes the entire Parquet record is `$`. If the value doesn't start with `$` it's interpreted as a constant value. Paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md). |
| ConstValue | `string` | The constant value to be used for a column instead of some value inside the Parquet file. |
| Transform | `string` | Transformation that should be applied on the content with [mapping transformations](mappings.md#mapping-transformations). |

>[!NOTE]
>
> Field and Path are mutually exclusive.
>
> The following alternatives are equivalent:
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

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Parquet type conversions

Comprehensive support is provided for converting data types when you're ingesting data into, or querying data from, a Parquet source into a table.

The following table provides a mapping of Parquet field types, and the table column types they can be converted to. The first column lists the Parquet type, and the others show the table column types they can be converted to.

> [!NOTE]
> For Parquest DECIMAL types, the physical type is specified in parentheses, as follows:
>
> - **I32**: INT32 (32-bit integer)
> - **I64**: INT64 (64-bit integer)
> - **FLBA**: Fixed Length Byte Array
> - **BA**: Byte Array

| Parquet type | bool | int | long | real | decimal | datetime | timespan | string | guid | dynamic |
|--|--|--|--|--|--|--|--|--|--|--|
| INT8 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| INT16 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| INT32 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| INT64 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| UINT8 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| UINT16 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| UINT32 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| UINT64 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| FLOAT32 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| FLOAT64 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| BOOLEAN | :heavy_check_mark: | :x: | :x: | :x: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| DECIMAL (I32) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| DECIMAL (I64) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| DECIMAL (FLBA) | :x: | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :x: |
| DECIMAL (BA) | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :heavy_check_mark: |
| TIMESTAMP | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: | :x: | :heavy_check_mark: | :x: | :x: |
| DATE | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: | :x: | :heavy_check_mark: | :x: | :x: |
| STRING | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :x: | :x: | :heavy_check_mark: | :x: | :heavy_check_mark: |
| UUID | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: | :heavy_check_mark: | :x: |
| JSON | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: | :x: | :heavy_check_mark: |
| LIST | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: |
| MAP | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: |
| STRUCT | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :x: | :heavy_check_mark: |

## Examples

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

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` management command.

~~~kusto
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
~~~

### Pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` management command.

```kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format="parquet",
      ingestionMappingReference = "Mapping_Name"
  )
```

### Identity mapping

Use Parquet mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
    format="parquet"
  )
```
