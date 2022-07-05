---
title: arg_min() (aggregation function) - Azure Data Explorer
description: This article describes arg_min() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# arg_min() (aggregation function)

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`arg_min` `(`*ExprToMinimize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *ExprToMinimize*| string | &check; | Expression that will be used for aggregation calculation.
| *ExprToReturn* | string | &check; | Expression that will be used for returning the value when *ExprToMinimize* is minimum. Expression to return may be a wildcard (*) to return all columns of the input table. |
  
## Null handling

When *ExprToMinimize* is null for all rows in a group, one row in the group is picked. Otherwise, rows where *ExprToMinimize* is null are ignored.

## Returns

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

## Examples

Use the `stormcenter` sample database for all the examples below.

**Example 1**

Find the northern most location of a storm event in each state.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVILEqPz83M03BKTc/M80ks0VGAsPKTE0sy8/M0FZIqFYJLEktSASw9sGhCAAAA)**\]**

```kusto
StormEvents 
| summarize arg_min(BeginLat, BeginLocation) by State
```

**Example 2**

Find the first time an event with a direct death happened in each state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnZuZpBJckFpWEZOam6ihoaSokVSoABUpSAdlWy7VPAAAA)**\]**

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_min(StartTime, *) by State
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
| summarize arg_min(Version, *) by Fruit
```
| Fruit | Version | Color |
|--|--|--|
| Apple | 1 | Red |
| Banana |  | Yellow |
| Pear | 1 | Brown |
