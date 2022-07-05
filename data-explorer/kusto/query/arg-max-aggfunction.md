---
title: arg_max() (aggregation function) - Azure Data Explorer
description: This article describes arg_max() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# arg_max() (aggregation function)

Finds a row in the group that maximizes *ExprToMaximize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`arg_max` `(`*ExprToMaximize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *ExprToMaximize* | string | &check; | Expression that will be used for aggregation calculation |
| *ExprToReturn* | string | &check; | Expression that will be used for returning the value when *ExprToMaximize* is maximum. Expression to return may be a wildcard (*) to return all columns of the input table. |

## Returns

Finds a row in the group that maximizes *ExprToMaximize*, and
returns the value of *ExprToReturn* (or `*` to return the entire row).

## Examples

The following examples demonstrate how to use this function.

**Example 1**

Find the northern location of a storm event in each state.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVILEqPz02s0HBKTc/M80ks0VGAsPKTE0sy8/M0FZIqFYJLEktSATqyPZtCAAAA)**\]**

```kusto
StormEvents 
| summarize arg_max(BeginLat, BeginLocation) by State
```

**Example 2**

Find the first time an event with death direct>0 happened in each state

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnJlZoBJckFpWEZOam6ihoaSokVSoABUpSAQPollZPAAAA)**\]**

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_max(StartTime, *) by State
```

**Example 3**
The following example demonstrates null handling.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAA31PwQrCMAy97ytCT530osfdnKBX8SCIiHQsjEKWjrRjKH68nWwoguYdkry8l5DaxoSKUG+ld7GAEMVxY2Djycu7PaIE57kAxzGHcwYp1LrrCJUBdcA6paX5oneCyKlIHs09UT4JSssJo+KERH74K/m1ZI9WxnkpfuCP6zM/+1Ymu2QPCH3bWnF3BCvNtXWsp5cMLHKobvD6/wlU5dHuDwEAAA==)**\]**

```kusto
datatable(Fruit: string, Color: string, Version: int) [
    "Apple", "Red", 1,
    "Apple", "Green", int(null),
    "Banana", "Yellow", int(null),
    "Banana", "Green", int(null),
    "Pear", "Brown", 1,
    "Pear", "Green", 2,
]
| summarize arg_max(Version, *) by Fruit
```

| Fruit | Version | Color |
|--|--|--|
| Apple | 1 | Red |
| Banana |  | Yellow |
| Pear | 2 | Green |
