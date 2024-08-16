---
title:  max() (aggregation function)
description: Learn how to use the max() function to find the maximum value of the expression in the group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# max() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds the maximum value the expression in the group.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`max(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the aggregation calculation. |

## Returns

Returns the maximum value of *expr* across the group.

> [!TIP]
> This gives you the max on its own. If you want to see other columns in addition to the max, use [arg_max](arg-max-aggregation-function.md).

## Example

This example returns the last record in a table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlXwSSxJLS4By9jmJlZoBJckFpWEZOamagIADGp6XTMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize LatestEvent=max(StartTime)
```

**Output**

| LatestEvent |
|--|
| 2007-12-31T23:53:00Z |
