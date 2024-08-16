---
title:  W3CLOGFILE Mapping
description: Learn how to use W3CLOGFILE mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 03/08/2023
---

# W3CLOGFILE mapping

Use W3CLOGFILE mapping to map incoming data to columns inside tables when your ingestion source file is in W3CLOGFILE format.

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each W3CLOGFILE mapping element must contain either of the following optional properties:

| Property   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Field      | `string` | Name of the field in the W3CLOGFILE log record.                                                                                                                                                                                                                                                                                                                                                                                              |
| ConstValue | `string` | The constant value to be used for a column instead of some value inside the W3CLOGFILE file.                                                                                                                                                                                                                                                                                                                                                 |
| Transform  | `string` | Transformation that should be applied on the content with [mapping transformations](mappings.md#mapping-transformations).                                                                                                                                                                                                                                                                                                                    |

> [!NOTE]
>
> The only supported transformations for W3CLOGFILE format are SourceLineNumber and SourceLocation.

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Examples

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

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` management command.

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

### Pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` management command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="w3clogfile",
        ingestionMappingReference = "Mapping_Name"
    )
```

### Identity mapping

Use W3CLOGFILE mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="w3clogfile"
    )
```
