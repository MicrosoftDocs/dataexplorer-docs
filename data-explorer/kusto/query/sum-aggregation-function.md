---
title:  sum() (aggregation function)
description: Learn how to use the sum() (aggregation function) function to calculate the sum of an expression across the group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/25/2024
---
# sum() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sum of *expr* across the group.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`sum(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*  string |  :heavy_check_mark: | The expression used for the aggregation calculation. |

## Returns

Returns the sum value of *expr* across the group.

## Example

This example returns the total number of blizzards by state.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXVwjJL0nMUcgrzU1KLVLIT1NIysmsqkosSilWSKpUKC5JLEnlCi7JL8p1LUvNKynmqlEoz0gtSlUAc0MqC1IVbG0VlJygmpSA8sWlubmJRZlVqQowUef80rwSW6C4hqEmyNRgsKlAlflFJSA%2BijoAippnIpMAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where EventType == "Blizzard"
| summarize BlizzardCount=sum(1) by State
| sort by BlizzardCount
```

**Output**

The results table shown includes only the first 10 rows.

| State | BlizzardCount |
| ---- | --- |
| ALASKA | 64 |
| IOWA | 62 |
| SOUTH DAKOTA | 51 |
| KANSAS | 45 |
| NEBRASKA | 45 |
| ILLINOIS | 44 |
| WISCONSIN | 33 |
| INDIANA | 27 |
| COLORADO | 26 |
| NORTH DAKOTA | 26 |
| ... | ... |
