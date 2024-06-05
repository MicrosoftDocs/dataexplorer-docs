---
title:  AVRO Mapping
description: Learn how to use AVRO mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 03/08/2023
---

# AVRO mapping

Use AVRO mapping to map incoming data to columns inside tables when your ingestion source file is in AVRO format.

[!INCLUDE [data-mapping-overview](../includes/data-mapping-overview.md)]

Each AVRO mapping element must contain either of the following optional properties:

| Property   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
|------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Field      | `string` | Name of the field in the AVRO record.                                                                                                                                                                                                                                                                                                                                                                                                  |
| Path       | `string` | If the value starts with `$` it's interpreted as the path to the field in the AVRO document that will become the content of the column in the table. The path that denotes the entire AVRO record is `$`. If the value doesn't start with `$` it's interpreted as a constant value. Paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md). |
| ConstValue | `string` | The constant value to be used for a column instead of some value inside the AVRO file.                                                                                                                                                                                                                                                                                                                                                 |
| Transform  | `string` | Transformation that should be applied on the content with [mapping transformations](mappings.md#mapping-transformations).                                                                                                                                                                                                                                                                                                              |

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

[!INCLUDE [data-mapping-type-note](../includes/data-mapping-type-note.md)]

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

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` management command.

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

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` management command.

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
