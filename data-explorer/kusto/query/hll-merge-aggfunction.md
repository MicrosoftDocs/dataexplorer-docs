---
title: hll_merge() (aggregation function) - Azure Data Explorer
description: This article describes hll_merge() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/15/2019
---
# hll_merge() (aggregation function)

Merges `HLL` results across the group into a single `HLL` value.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

For more information, see the [underlying algorithm (*H*yper*L*og*L*og) and estimation accuracy](#estimation-accuracy).

## Syntax

`hll_merge` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|*Expr*|string|&check;|Expression used for the aggregation calculation.|

## Returns

Returns the merged `hll` values of `*Expr*` across the group.

> [!TIP]
>  Use the function [dcount_hll](dcount-hllfunction.md) to calculate the `dcount` from `hll` / `hll-merge` aggregation functions.

## Example



## Estimation accuracy

[!INCLUDE [data-explorer-estimation-accuracy](../../includes/data-explorer-estimation-accuracy.md)]
