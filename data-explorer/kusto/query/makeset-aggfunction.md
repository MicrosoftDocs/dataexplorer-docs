---
title: makeset() (aggregation function) - Azure Kusto | Microsoft Docs
description: This article describes makeset() (aggregation function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# makeset() (aggregation function)

Returns a `dynamic` (JSON) array of the set of distinct values that *Expr* takes in the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `makeset(`*Expr* [`,` *MaxListSize*]`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation.
* *MaxListSize* is an optional integer limit on the maximum number of elements returned (default is *128*).

**Returns**

Returns a `dynamic` (JSON) array of the set of distinct values that *Expr* takes in the group.
The array's sort order is undefined.

**Tip**

To just count the distinct values, use [dcount()](dcount-aggfunction.md)

**Example**

```kusto
PageViewLog 
| summarize countries=makeset(country) by continent
```

![alt text](./images/aggregations/makeset.png "makeset")

See also the [`mvexpand` operator](./mvexpandoperator.md) for the opposite function.