---
title:  hll_merge()
description: Learn how to use the hll_merge() function toe merge HLL results.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# hll_merge()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Merges HLL results. This is the scalar version of the aggregate version [`hll_merge()`](hll-merge-aggregation-function.md).

Read about the [underlying algorithm (*H*yper*L*og*L*og) and estimation accuracy](#estimation-accuracy).

> [!IMPORTANT]
> The results of hll(), hll_if(), and hll_merge() can be stored and later retrieved. For example, you may want to create a daily unique users summary, which can then be used to calculate weekly counts.
> However, the precise binary representation of these results may change over time. There's no guarantee that these functions will produce identical results for identical inputs, and therefore we don't advise relying on them.

## Syntax

`hll_merge(` *hll*`,` *hll2*`,` [ *hll3*`,` ... ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*hll*, *hll2*, ... | `string` | :heavy_check_mark:|The column names containing HLL values to merge. The function expects between 2-64 arguments.|

## Returns

Returns one HLL value. The value is the result of merging the columns *hll*, *hll2*, ... *hllN*.

## Examples

This example shows the value of the merged columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMQQ6DMAwE75X4wx6J6KE8gLdEiLi0iCTIGCmp+vg6gUtP1uzsmscwExKeHD16SET/wC60KTS3LygJBYeMQUudyhLuh/cjvz+E17rapE5vm8y9cr44m9LdOC40CTzxTO5UtkJbx9fmr+umeASx5ck5Mz9Hg5B+pwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 10 step 1 
| extend y = x + 10
| summarize hll_x = hll(x), hll_y = hll(y)
| project merged = hll_merge(hll_x, hll_y)
| project dcount_hll(merged)
```

**Output**

|`dcount_hll_merged`|
|---|
|20|

## Estimation accuracy

[!INCLUDE [data-explorer-estimation-accuracy](../includes/estimation-accuracy.md)]
