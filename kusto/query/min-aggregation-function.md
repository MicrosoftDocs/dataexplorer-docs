---
title:  min() (aggregation function)
description: Learn how to use the min() function to find the minimum value in a group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# min() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds the minimum value across the group.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`min` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the minimum value aggregation calculation. |

## Returns

Returns the minimum value of *expr* across the group.

> [!TIP]
> This gives you the min on its own. If you want to see other columns in addition to the min, use [arg_min](arg-min-aggregation-function.md).

## Example

This example returns the first record in a table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXDLLCouAYvb5mbmaQSXJBaVhGTmpmoCAMaAOl8xAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize FirstEvent=min(StartTime)
```

**Output**

| FirstEvent |
|--|
| 2007-01-01T00:00:00Z |
