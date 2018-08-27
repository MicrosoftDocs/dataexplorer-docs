---
title: hll-merge() (aggregation function) (Azure Kusto)
description: This article describes hll-merge() (aggregation function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# hll-merge() (aggregation function)

Merges HLL results across the group into single HLL value.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md).

Read more about the underlying algorithm (*H*yper*L*og*L*og) and the estimated error [here](dcount-aggfunction.md#estimation-error-of-dcount).

**Syntax**

`summarize` `hll-merge(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged hll values of *Expr* across the group.
 
**Tips**

1) You may use the function [dcount-hll] (dcount-hllfunction.md) which will calculate the dcount from hll / hll-merge aggregation functions.
