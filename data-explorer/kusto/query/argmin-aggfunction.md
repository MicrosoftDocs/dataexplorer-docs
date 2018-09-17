---
title: argmin() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes argmin() (aggregation function) in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# argmin() (aggregation function)

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` [`(`*NameExprToMinimize* `,` *NameExprToReturn* [`,` ...] `)=`] `argmin` `(`*ExprToMinimize*, `*` | *ExprToReturn*  [`,` ...]`)`

**Arguments**

* *ExprToMinimize*: Expression that will be used for aggregation calculation. 
* *ExprToReturn*: Expression that will be used for returning the value when *ExprToMinimize* is
  minimum. Expression to return may be a wildcard (*) to return all columns of the input table.
* *NameExprToMinimize*: An optional name for the result column representing *ExprToMinimize*.
* *NameExprToReturn*: Additional optional names for the result columns representing *ExprToReturn*.

**Returns**

Finds a row in the group that minimizes *ExprToMinimize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

**Examples**

Show cheapest supplier of each product:

```kusto
Supplies | summarize argmin(Price, Supplier) by Product
```

Show all the details, not just the supplier name:

```kusto
Supplies | summarize argmin(Price, *) by Product
```

Find the southernmost city in each continent, with its country:

```kusto
PageViewLog 
| summarize (latitude, City, country)=argmin(latitude, City, country) 
    by continent
```

![alt text](./images/aggregations/argmin.png "argmin")