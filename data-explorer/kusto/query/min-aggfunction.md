---
title: min() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes min() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/24/2019
---
# min() (aggregation function)

Returns the minimum value across the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`summarize` `min(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be used for aggregation calculation. 

## Returns

The minimum value of *Expr* across the group.
 
> [!TIP]
> This gives you the min or max on its own - for example, the highest or lowest price. 
> But if you want other columns in the row - for example, the name of the supplier with the lowest 
> price - use [arg_max](arg-max-aggfunction.md) or [arg_min](arg-min-aggfunction.md).