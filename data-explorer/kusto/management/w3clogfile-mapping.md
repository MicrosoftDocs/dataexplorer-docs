# W3CLOGFILE mapping

W3CLOGFILE mapping is one type of [data mapping](mappings.md) used to map incoming data to columns inside tables.

When the source file is in W3CLOGFILE format, the file content is mapped to the table. The table must exist in the database unless a valid datatype is specified for all the columns mapped. The columns mapped in the W3CLOGFILE mapping must exist in the table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a mapping for a specific column, and may contain the following properties:

|Property|Description|
|----|--|
|`Field`|W3CLOGFILE entry name|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside W3CLOGFILE file.|
|`Transform`|(Optional) [mapping transformations](#mapping-transformations) that should be applied on the content.|

### Example

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

````kusto
.ingest into Table123 (@"source1", @"source2")
  with
  (
      format = "w3clogfile",
      ingestionMapping =
      ```
      [
         {"Column": "column_a", "Properties": {"Field": "field1"}},
         {"Column": "column_b", "Properties": {"Field": "field2"}}
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
