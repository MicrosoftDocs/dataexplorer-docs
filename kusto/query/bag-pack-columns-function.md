---
title:  bag_pack_columns()
description: Learn how to use the bag_pack_columns() function to create a dynamic JSON object from a list of columns.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/15/2023
---
# bag_pack_columns()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a dynamic property bag object from a list of columns.

## Syntax

`bag_pack_columns(`*column1*`,` *column2*`,... )`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*column*| scalar |  :heavy_check_mark: | A column to pack. The name of the column is the property name in the property bag.|

## Returns

Returns a `dynamic` property bag object from the listed *columns*.

## Examples

The following example creates a property bag that includes the `Id` and `Value` columns:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUDc8UK4XikqLMvHQdhbDEnNJUBNe/JCO1yEohJz8vXZOXK5qXSwEIlByVdBSUyhJz4hOBDEMdqKgTTDQJyDCCiTrDRJOBDGNerlherhqF1IqS1LwUhYDE5OzUFAVbhaTE9PgCICc+OT+nNDevGOgkqFM0AV8bSzWnAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Id: string, Value: string, Other: long)
[
    "A", "val_a", 1,
    "B", "val_b", 2,
    "C", "val_c", 3
]
| extend Packed = bag_pack_columns(Id, Value)
```

|Id|Value|Other|Packed|
|---|---|---|---|
|A|val_a|1|{<br>  "Id": "A",<br>  "Value": "val_a"<br>}|
|B|val_b|2|{<br>  "Id": "B",<br>  "Value": "val_b"<br>}|
|C|val_c|3|{<br>  "Id": "C",<br>  "Value": "val_c"<br>}|