---
title:  hll_merge() (aggregation function)
description: Learn how to use the hll_merge() function to merge HLL results into a single HLL value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# hll_merge() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Merges HLL results across the group into a single HLL value.

> [!NOTE]
> You can't merge hll values that were created using different accuracy values. For more information, see [hll()](hll-aggregation-function.md).

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

For more information, see the [underlying algorithm (*H*yper*L*og*L*og) and estimation accuracy](#estimation-accuracy).

## Syntax

`hll_merge` `(`*hll*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*hll*| `string` | :heavy_check_mark:|The column name containing HLL values to merge.|

## Returns

The function returns the merged HLL values of *hll* across the group.

> [!NOTE]
> - The results of hll(), hll_if(), and hll_merge() can be stored and later retrieved. For example, you might want to create a daily unique user summary, which can then be used to calculate weekly counts.
> However, the precise binary representation of these results might change over time. There's no guarantee that these functions produce identical results for identical inputs, and therefore we don't advise relying on them.
> - Use the [dcount_hll](dcount-hll-function.md) function to calculate the `dcount` from [hll()](hll-aggregation-function.md) and [hll_merge()](hll-merge-aggregation-function.md) aggregation functions.

## Example

The following example shows HLL results across a group merged into a single HLL value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVcjIyQlKLVawBTE0XBJzE9NTA4ryC1KLSio1FZIqFZIy8zSCSxKLSkIyc1N1DA1yNdG1+6YWpaemQEyIzwVxNCCGagIAlijQ1HQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize hllRes = hll(DamageProperty) by bin(StartTime,10m)
| summarize hllMerged = hll_merge(hllRes)
```

**Output**

The results show only the first five results in the array.

|hllMerged|
|--|
| [[1024,14],["-6903255281122589438","-7413697181929588220","-2396604341988936699","5824198135224880646","-6257421034880415225", ...],[]]|

## Estimation accuracy

[!INCLUDE [data-explorer-estimation-accuracy](../includes/estimation-accuracy.md)]

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [Using hll() and tdigest()](using-hll-tdigest.md)
* [hll() (aggregation function)](hll-aggregation-function.md)
* [hll_if() (aggregation function)](hll-if-aggregation-function.md)