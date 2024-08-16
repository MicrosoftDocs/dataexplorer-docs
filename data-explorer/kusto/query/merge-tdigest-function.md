---
title:  merge_tdigest()
description: Learn how to use the merge_tdigest() function to merge columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
---
# merge_tdigest()

Merges `tdigest` results (scalar version of the aggregate version [`tdigest_merge()`](tdigest-merge-aggregation-function.md)).

Read more about the underlying algorithm (T-Digest) and the estimated error [here](percentiles-aggregation-function.md#estimation-error-in-percentiles).

> The `merge_tdigest()` and `tdigest_merge()` functions are equivalent

> [!IMPORTANT]
>The results of tdigest() and tdigest_merge() can be stored and later retrieved. For example, you may want to create daily percentiles summary, which can then be used to calculate weekly percentiles.
> However, the precise binary representation of these results may change over time. There's no guarantee that these functions will produce identical results for identical inputs, and therefore we don't advise relying on them.

## Syntax

`merge_tdigest(`*exprs*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *exprs* | `dynamic` |  :heavy_check_mark: | One or more comma-separated column references that have the `tdigest` values to be merged. |

## Returns

The result for merging the columns `*Expr1*`, `*Expr2*`, ... `*ExprN*` to one `tdigest`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02OSwrDMBBD9z3FLG2aRXKA3qNdhZAoxiX+YE/BDj18h7Ym2Wmk0UNp8gZUaE3B0UAcaOgpM6IclzehMPxClW7yc5VMvPxybkp2B/FiDTLfJf1LVXTX9ONkVy3FmMITM5NDMliOdPwaqtEOwLkUkWZ4thvGBv1xOlnVS6dGhFVtwRutP5Qlo27WAAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 10 step 1 
| extend y = x + 10
| summarize tdigestX = tdigest(x), tdigestY = tdigest(y)
| project merged = merge_tdigest(tdigestX, tdigestY)
| project percentile_tdigest(merged, 100, typeof(long))
```

**Output**

|percentile_tdigest_merged|
|---|
|20|
