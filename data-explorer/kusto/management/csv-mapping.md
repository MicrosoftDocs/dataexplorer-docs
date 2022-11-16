---
title: CSV Mapping - Azure Data Explorer
description: Learn how to use CSV mapping to map data to columns inside tables upon ingestion.
ms.topic: reference
ms.date: 11/16/2022
---

# CSV mapping

CSV mapping is one type of [data mapping](mappings.md) used to map incoming data to columns inside tables.

When the source file is a CSV, or any delimiter-separated format, and its schema doesn't match the current table schema, a CSV mapping maps from the file schema to the table schema. If the table doesn't exist in Azure Data Explorer, it will be created according to this mapping. If some fields in the mapping are missing in the table, they'll be added.

CSV mapping can be applied on all the delimiter-separated tabular formats: CSV, TSV, PSV, SCSV, SOHsv and TXT. For more information, see supported [data formats](../../ingestion-supported-formats.md).

Each element in the list describes a mapping for a specific column, and must contain either of the following properties:

|Property|Description|
|----|--|
|`Ordinal`|The column order number in CSV.|
|`ConstantValue`|(Optional) The constant value to be used for a column instead of some value inside the CSV file.|

> [!NOTE]
>
> * `Ordinal` and `ConstantValue` are mutually exclusive.
> * For TXT format, only `Ordinal` `0` can be mapped, as text is treated as a single column of lines.

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
