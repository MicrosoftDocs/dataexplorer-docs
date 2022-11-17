---
title: CSV Mapping - Azure Data Explorer
description: Learn how to use CSV mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# CSV mapping

CSV mapping is one way to map incoming data to columns inside tables. When the ingestion source file is in CSV format, or any other delimiter-separated format, map the file content to the table using a CSV mapping.

CSV mapping can be applied on all the delimiter-separated tabular formats: CSV, TSV, PSV, SCSV, SOHsv and TXT. For more information, see supported [data formats](../../ingestion-supported-formats.md).

[!INCLUDE [data-mapping-overview](../../includes/data-mapping-overview.md)]

Each element in the list must contain either of the following `properties`:

|Property|Description|
|----|--|
|`Ordinal`|The column order number in CSV.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the CSV file.|

> [!NOTE]
>
> * `Ordinal` and `ConstantValue` are mutually exclusive.
> * For TXT format, only `Ordinal` `0` can be mapped, as text is treated as a single column of lines.

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Example

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

## Example using a pre-created mapping

When the mapping is [pre-created](create-ingestion-mapping-command.md), reference the mapping by name in the `.ingest` control command.

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="csv",
        ingestionMappingReference = "MappingName"
    )
```

## Example using identity mapping

Use CSV mapping during ingestion without defining a mapping schema (see [identity mapping](mappings.md#identity-mapping)).

```kusto
.ingest into Table123 (@"source1", @"source2")
    with
    (
        format="csv"
    )
```
