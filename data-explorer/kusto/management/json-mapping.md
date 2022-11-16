# JSON mapping

JSON mapping is one type of [data mapping](mappings.md) used to map incoming data to columns inside tables.

When the source file is in JSON format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the JSON mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Path`|If the value starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used. JSON paths that include special characters should be escaped as [\'Property Name\']. For more information, see [JSONPath syntax](../query/jsonpath.md).|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the JSON file.|
|`Transform`|(Optional) Transformation that should be applied on the content with [mapping transformations](#mapping-transformations).|

### Example

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