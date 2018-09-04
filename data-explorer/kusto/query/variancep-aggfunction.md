---
title: variancep() (aggregation function) - Azure Kusto | Microsoft Docs
description: This article describes variancep() (aggregation function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# variancep() (aggregation function)

Calculates the variance of *Expr* across the group, considering the group as a [population](https://en.wikipedia.org/wiki/Statistical_population). 

* Used formula:
![](./images/aggregations/variance-population.png)

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

summarize `variancep(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The variance value of *Expr* across the group.
 
**Examples**

```kusto
range x from 1 to 5 step 1
| summarize makelist(x), variancep(x) 
```

|list_x|variance_x|
|---|---|
|[ 1, 2, 3, 4, 5]|2|