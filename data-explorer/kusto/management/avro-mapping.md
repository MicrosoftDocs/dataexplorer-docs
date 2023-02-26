---
title: AVRO Mapping - Azure Data Explorer
description: Learn how to use AVRO mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# AVRO mapping

Use AVRO mapping to map incoming data to columns inside tables when your ingestion source file is in AVRO format.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each AVRO mapping element may contain the following optional `properties`:

|Property|Description|
|--|--|
|`Field`| The name of the field in the AVRO record.|
|`Path`|Alternative to using `Field` that allows taking the inner part of an AVRO record-field. The value denotes a JSON path from the root of the AVRO record. The JSON path that denotes the entire AVRO record is `$`. If the value doesn't start with `$`: the value is interpreted as a constant which is set in the column, as long as the column's data type supports such value. If it doesn't, then that column is set to null. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstValue`|The constant value to be used for a column instead of some value inside AVRO file.|
|`Transform`|Transformation that should be applied on the content with [supported transformations](./mappings.md#mapping-transformations).|

>[!NOTE]
> `Field` and `Path` are mutually exclusive.
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

## Examples

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

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` control command.

````kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format = "AVRO",
      ingestionMapping =
      ```
      [
        {"Column": "column_a", "Properties": {"Field": "Field1"}},
        {"Column": "column_b", "Properties": {"Field": "$.[\'Field name with space\']"}}
      ]
      ```
  )
````

### Pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` control command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO",
        ingestionMappingReference = "Mapping_Name"
    )
```

### Identity mapping

Use AVRO mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO"
    )
```

## Next steps

* Learn more about [data mappings](mappings.md)
