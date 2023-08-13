---
title:  ORC Mapping
description: Learn how to use ORC mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 03/08/2023
---

# ORC mapping

Use ORC mapping to map incoming data to columns inside tables when your ingestion source file is in ORC format.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each ORC mapping element must contain either of the following optional properties:

| Property   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Field      | string | Name of the field in the ORC record.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Path       | string | If the value starts with `$` it's interpreted as the path to the field in the ORC document that will become the content of the column in the table. The path that denotes the entire ORC record is `$`. If the value doesn't start with `$` it's interpreted as a constant value. Paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md). |
| ConstValue | string | The constant value to be used for a column instead of some value inside the ORC file.                                                                                                                                                                                                                                                                                                                                                |
| Transform  | string | Transformation that should be applied on the content with [mapping transformations](mappings.md#mapping-transformations).                                                                                                                                                                                                                                                                                                            |

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

````kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format = "orc",
      ingestionMapping =
      ```
      [
        {"Column": "column_a", "Properties": {"Path": "$.Field1"}},
        {"Column": "column_b", "Properties": {"Path": "$.[\'Field name with space\']"}}
      ]
      ```
  )
````

### Pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` management command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="orc",
        ingestionMappingReference = "ORC_Mapping"
    )
```

### Identity mapping

Use ORC mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="orc"
    )
```
