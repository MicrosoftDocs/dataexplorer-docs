---
title: AVRO Mapping - Azure Data Explorer
description: Learn how to use AVRO mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# AVRO mapping

AVRO mapping is one way to map incoming data to columns inside tables. When the ingestion source file is in AVRO format, map the file content to the table using an AVRO mapping.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each item may contain the following `properties`:

|Property|Description|
|----|--|
|`Field`|The name of the field in the AVRO record.|
|`Path`|Alternative to using `Field` that allows taking the inner part of an AVRO record-field. The value denotes a JSON path from the root of the AVRO record. The JSON path that denotes the entire AVRO record is `$`. If the value doesn't start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside AVRO file.|
|`Transform`|(Optional) Transformation that should be applied on the content with [supported transformations](./mappings.md#mapping-transformations).|

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

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Example

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

## Example using a pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` control command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO",
        ingestionMappingReference = "Mapping_Name"
    )
```

## Example using identity mapping

Use AVRO mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO"
    )
```
