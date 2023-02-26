---
title: JSON Mapping - Azure Data Explorer
description: Learn how to use JSON mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# JSON mapping

Use JSON mapping to map incoming data to columns inside tables when your ingestion source file is in JSON format.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each JSON mapping element may contain the following optional `properties`:

|Property|Description|
|--|--|
|`Path`|If the value starts with `$`: JSON path to the field that will become the content of the column in the JSON document. The JSON path that denotes the entire document is `$`. If the value doesn't start with `$`: the value is interpreted as a constant which is set in the column, as long as the column's data type supports such value. If it doesn't, then that column is set to null. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`Transform`|Transformation that should be applied on the content with [mapping transformations](mappings.md#mapping-transformations).|

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Examples

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

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` control command.

````kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format = "json",
      ingestionMapping =
      ```
      [
        {"Column": "column_a", "Properties": {"Path": "$.Obj.Property"}},
        {"Column": "column_b", "Properties": {"Path": "$.Property"}},
        {"Column": "custom_column", "Properties": {"Path": "$.[\'Property name with space\']"}}
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
        format="json",
        ingestionMappingReference = "Mapping_Name"
    )
```

### Identity mapping

Use JSON mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="json"
    )
```

### Copying JSON mapping

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

## Next steps

* Learn more about [data mappings](mappings.md)
