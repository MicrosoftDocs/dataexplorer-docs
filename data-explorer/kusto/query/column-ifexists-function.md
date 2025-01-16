---
title:  column_ifexists()
description: Learn how to use the column_ifexists() function to return a reference to the column if it exists.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2025
---
# column_ifexists()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Displays the column, if the column exists. Otherwise, it returns the default column.

> **Deprecated aliases:** columnifexists()

## Syntax

`column_ifexists(`*columnName*`,`*defaultValue*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *columnName* | `string` |  :heavy_check_mark: | The name of the column to return.|
| *defaultValue* | scalar |  :heavy_check_mark: | The default column to return if *columnName* doesn't exist in the table. This value can be any scalar expression. For example, a reference to another column.|

## Returns

If *columnName* exists, then returns the column. Otherwise, it returns the *defaultValue* column.

## Example

This example returns the default **State** column, because a column named Capital doesn't exist in the *StormEvents* table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSspVqhRKCjKz0pNLlFIzs8pzc2Lz0xLrcgsLinWUHJOLMgsScxR0lEILkksSdUEAKw3fkE3AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | project column_ifexists("Capital", State)
```

**Output**

This output shows the first 10 rows of the default **State** column.

| State |
|-------|
| ATLANTIC SOUTH |
| FLORIDA |
| FLORIDA |
| GEORGIA |
| MISSISSIPPI |
| MISSISSIPPI |
| MISSISSIPPI |
| MISSISSIPPI |
| AMERICAN SAMOA |
| KENTUCKY |
| ... |
