---
title:  datatable operator
description: Learn how to use the datatable operator to define a table with given schema and data.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---
# datatable operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a table whose schema and values are defined in the query itself.

> [!NOTE]
> This operator doesn't have a pipeline input.

## Syntax

`datatable(` *ColumnName* `:` *ColumnType* [`,` ...]`)` `[` *ScalarValue* [`,` ...] `]`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ColumnName*| `string` |  :heavy_check_mark: | The name for a column. |
| *ColumnType* | `string` |  :heavy_check_mark: | The type of data in the column.|
| *ScalarValue* | scalar |  :heavy_check_mark: | The value to insert into the table. The total number of values must be a multiple of the number of columns in the table. Each value is assigned to a column based on its position. Specifically, the *n*'th value is assigned to the column at position *n* % *NumColumns*, where *NumColumns* is the total number of columns. |

> [!NOTE]
> The column name and column value pairs define the schema for the table.

## Returns

Returns a data table of the given schema and data.

## Examples

The following example creates a table with *Date*, *Event*, and *MoreData* columns, filters rows with Event descriptions longer than 4 characters, and adds a new column *key2* to each row from the MoreData dynamic object.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XRS4vCMBAA4Lu/YsiphbiY1upa0IPYo8velz2kZtRgTCCNL1z/uxNZd6HYJAQyj++QUTLQrg0mCxmwVHQFvUcO1RFtKJvgtd1wWDqPVCBLdbFyr1cpfPWA1rM+ERMx6A9GfSFSDmzuvGUcfouTK9vhRbCSHaU5oKBMDGTPQMZuKW9zOXGCTuQqG9A3UK2cQfiQ1ISdet7Wh6/0Iv/XPw+10c0WFay1bwLUzu06+aLNj17xk3H8i6yI/EKj6uTGbe79wX33fuC0RY9AAzBok8c0UpjBkDJ4DmgVxDaY/o3mLb7vp72pd88BAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Date:datetime, Event:string, MoreData:dynamic) [
    datetime(1910-06-11), "Born", dynamic({"key1":"value1", "key2":"value2"}),
    datetime(1930-01-01), "Enters Ecole Navale", dynamic({"key1":"value3", "key2":"value4"}),
    datetime(1953-01-01), "Published first book", dynamic({"key1":"value5", "key2":"value6"}),
    datetime(1997-06-25), "Died", dynamic({"key1":"value7", "key2":"value8"}),
]
| where strlen(Event) > 4
| extend key2 = MoreData.key2
```

**Output**

| Date | Event | MoreData | key2 |
|--|--|--|--|
| 1930-01-01 00:00:00.0000000 | Enters Ecole Navale | {<br>  "key1": "value3",<br>  "key2": "value4"<br>} | value4 |
| 1953-01-01 00:00:00.0000000 | Published first book | {<br>  "key1": "value5",<br>  "key2": "value6"<br>} | value6 |
