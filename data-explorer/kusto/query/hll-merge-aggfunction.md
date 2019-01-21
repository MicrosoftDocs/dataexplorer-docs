---
title: hll_merge() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes hll_merge() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# hll_merge() (aggregation function)

Merges HLL results across the group into single HLL value.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md).

Read more about the underlying algorithm (*H*yper*L*og*L*og) and the estimated error [here](dcount-aggfunction.md#estimation-error-of-dcount).

**Syntax**

`summarize` `hll_merge(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged hll values of *Expr* across the group.
 
**Tips**

1) You may use the function [dcount_hll] (dcount-hllfunction.md) which will calculate the dcount from hll / hll-merge aggregation functions.