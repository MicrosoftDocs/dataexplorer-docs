---
title: ARVO Mapping - Azure Data Explorer
description: This article describes ARVO data mapping in Azure Data Explorer.
ms.topic: reference
ms.date: 11/16/2022
---

# AVRO mapping

ARVO mapping is one type of [data mapping](mappings.md) used to map incoming data to columns inside tables.

When the source file is in AVRO format, the AVRO file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped.

The columns mapped in the AVRO mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|The name of the field in the AVRO record.|
|`Path`|Alternative to using `Field` that allows taking the inner part of an AVRO record-field, if necessary. The value denotes a JSON path from the root of the AVRO record (JSON path that denotes the entire AVRO record is `$`). If the value doesn't start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
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

### Example

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
> Ingestion is possible without specifying a mapping (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="AVRO"
    )
```
