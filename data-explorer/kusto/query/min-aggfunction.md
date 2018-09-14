---
title: min() (aggregation function) - Azure Kusto | Microsoft Docs
description: This article describes min() (aggregation function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# min() (aggregation function)

Returns the minimum value agross the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `min(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The minimum value of *Expr* across the group.
 
> [!TIP]
> This gives you the min or max on its own - for example, the highest or lowest price. 
> But if you want other columns in the row - for example, the name of the supplier with the lowest 
> price - use [argmax](argmax-aggfunction.md) or [argmin](argmin-aggfunction.md).