---
title:  distinct operator
description: Learn how to use the distinct operator to create a table with the distinct combination of the columns of the input table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/01/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---
# distinct operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


Produces a table with the distinct combination of the provided columns of the input table.

## Syntax

*T* `| distinct` *ColumnName*`[,`*ColumnName2*`, ...]`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ColumnName*| `string` |  :heavy_check_mark:| The column name to search for distinct values. |

> [!NOTE]
> The `distinct` operator supports providing an asterisk `*` as the group key to denote all columns, which is helpful for wide tables.

## Example

Shows distinct combination of states and type of events that led to over 45 direct injuries.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVfDMyyotykwtdsksSk0uUbBTMDEFSaZkFpdk5gEFgksSS1J1FMDaQioLUgH0ldkdRQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where InjuriesDirect > 45
| distinct State, EventType
```

**Output**

|State|EventType|
|--|--|
|TEXAS|Winter Weather|
|KANSAS|Tornado|
|MISSOURI|Excessive Heat|
|OKLAHOMA|Thunderstorm Wind|
|OKLAHOMA|Excessive Heat|
|ALABAMA|Tornado|
|ALABAMA|Heat|
|TENNESSEE|Heat|
|CALIFORNIA|Wildfire|

::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"

## Related content

If the group by keys are of high cardinalities, try `summarize by ...` with the [shuffle strategy](shuffle-query.md).
::: moniker-end