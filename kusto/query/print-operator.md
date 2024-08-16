---
title:  print operator
description: Learn how to use the print operator to output a single row with one or more scalar expression results as columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# print operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Outputs a single row with one or more scalar expression results as columns.

## Syntax

`print` [*ColumnName* `=`] *ScalarExpression* [',' ...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ColumnName* | `string` | | The name to assign to the output column.|
| *ScalarExpression* | `string` |  :heavy_check_mark: | The expression to evaluate.|

## Returns

A table with one or more columns and a single row. Each column returns the corresponding value of the evaluated *ScalarExpression*.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUTBQ0FYwBGIjIDYGYhMgNtVRqFCwVVAKzy9XVAIAppjMyScAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print 0 + 1 + 2 + 3 + 4 + 5, x = "Wow!"
```

**Output**

|print_0|x|
|--|--|
|15| Wow!|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhKzMtLLbItLilKTizRUPJIzcnJV9JRgKLw/KKcFEUlTQBf/iftLAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print banner=strcat("Hello", ", ", "World!")
```

**Output**

|banner|
|--|
|Hello, World!|
