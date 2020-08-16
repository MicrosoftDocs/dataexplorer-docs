---
title: tdigest_merge() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes tdigest_merge() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/09/2019
---
# tdigest_merge() (aggregation function)

Merges tdigest results across the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md).

Read more about the underlying algorithm (T-Digest) and the estimated error [here](percentiles-aggfunction.md#estimation-error-in-percentiles).

## Syntax

summarize `tdigest_merge(`*Expr*`)`.

summarize `tdigest_merge(`*Expr*`)` - An alias.

## Arguments

* *Expr*: Expression that will be used for aggregation calculation. 

## Returns

The merged tdigest values of *Expr* across the group.
 

**Tips**

1) You may use the function [`percentile_tdigest()`] (percentile-tdigestfunction.md).

2) All tdigests that are included in the same group must be of the same type.