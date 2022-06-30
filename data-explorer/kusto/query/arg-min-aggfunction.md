---
title: arg_min() (aggregation function) - Azure Data Explorer
description: This article describes arg_min() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/30/2022
---
# arg_min() (aggregation function)

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`arg_min` `(`*ExprToMinimize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

## Arguments

| Name | Description |
|--|--|
| *ExprToMinimize*| Expression that will be used for aggregation calculation.
| *ExprToReturn* | Expression that will be used for returning the value when *ExprToMinimize* is minimum. Expression to return may be a wildcard (*) to return all columns of the input table. |
  
## Null handling

When *ExprToMinimize* is null for all rows in a group, one row in the group is picked. Otherwise, rows where *ExprToMinimize* is null are ignored.

## Returns

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

## Examples

Use the `stormcenter` sample database for all the examples below.
**Example 1**
Show the storms based on start time, event type, and location.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAAysuyS/KTU7NK0kt4qpRKC7NzU0syqxKVUgsSo/PzczTcC0DyoVUFqTqKASXJJakaiokVYJYRSUhmbmpADnghVs+AAAA)**\]**

```kusto
stormcenter
| summarize arg_min(EventType, State) by StartTime
```

**Example 2**
Show all of the details of the storms.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAAysuyS/KTU7NK0kt4qpRKC7NzU0syqxKVUgsSo/PzczTcC0DyoVUFqTqKGhpKiRVKgSXJBaVhGTmpgIABwKNJToAAAA=)**\]**

```kusto
stormcenter
| summarize arg_min(EventType, *) by StartTime
```

**Example 3**

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAAysuyS/KTU7NK0kt4qpRKC7NzU0syqxKVdBwSk3PzPNJLNFRcM1LAdKatolF6fG5mXlIMsEliSWpmgpJlSBWUUlIZm4qAEdbPlJQAAAA)**\]**

```kusto
stormcenter
| summarize (BeginLat, EndLat)=arg_min(BeginLat, State) by StartTime)
```

**Example 4**
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
