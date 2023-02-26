---
title: CSV Mapping - Azure Data Explorer
description: Learn how to use CSV mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# CSV mapping

Use CSV mapping to map incoming data to columns inside tables when your ingestion source file is any of the following delimiter-separated tabular formats: `CSV`, `TSV`, `PSV`, `SCSV`, `SOHsv`, `TXT` and `RAW`. For more information, see supported [data formats](../../ingestion-supported-formats.md).

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each CSV mapping element must contain either of the following optional `properties`:

|Property|Description|
|--|--|
|`Ordinal`|The column order number in CSV.|
|`ConstValue`|The constant value to be used for a column instead of some value inside the CSV file.|

> [!NOTE]
>
> * `Ordinal` and `ConstValue` are mutually exclusive.
> * For `TXT` and `RAW` formats, only `Ordinal` `0` can be mapped, as text is treated as a single column of lines.

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Examples

``` json
[
  {"Column": "event_time", "Properties": {"Ordinal": "0"}},
  {"Column": "event_name", "Properties": {"Ordinal": "1"}},
  {"Column": "event_type", "Properties": {"Ordinal": "2"}},
  {"Column": "ingestion_time", "Properties": {"ConstValue": "2021-01-01T10:32:00"}}
]
```

The mapping above is serialized as a JSON string when it's provided as part of the `.ingest` control command.

````kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="csv",
        ingestionMapping =
        ```
        [
            {"Column": "event_time", "Properties": {"Ordinal": "0"}},
            {"Column": "event_name", "Properties": {"Ordinal": "1"}},
            {"Column": "event_type", "Properties": {"Ordinal": "2"}},
            {"Column": "ingestion_time", "Properties": {"ConstValue": "2021-01-01T10:32:00"}}
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
        format="csv",
        ingestionMappingReference = "MappingName"
    )
```

### Identity mapping

Use CSV mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="csv"
    )
```

## Next steps

* Learn more about [data mappings](mappings.md)
