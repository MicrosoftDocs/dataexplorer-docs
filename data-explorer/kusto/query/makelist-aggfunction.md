---
title: makelist() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes makelist() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# makelist() (aggregation function)

Returns a `dynamic` (JSON) array of all the values of *Expr* in the group.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `makelist(`*Expr* [`,` *MaxListSize*]`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation.
* *MaxListSize* is an optional integer limit on the maximum number of elements returned (default is *128*).

**Returns**

Returns a `dynamic` (JSON) array of all the values of *Expr* in the group.
If the input to the `summarize` operator is not sorted, the order of elements in the resulting array is undefined.
If the input to the `summarize` operator is sorted, the order of elements in the resulting array tracks that of the input.