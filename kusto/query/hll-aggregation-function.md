---
title:  hll() (aggregation function)
description: Learn how to use the hll() function to calculate the results of the dcount() function.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# hll() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `hll()` function is a way to estimate the number of unique values in a set of values. It does this by calculating intermediate results for aggregation within the [summarize](summarize-operator.md) operator for a group of data using the [`dcount`](dcount-aggfunction.md) function.

Read about the [underlying algorithm (*H*yper*L*og*L*og) and the estimation accuracy](#estimation-accuracy).

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

> [!TIP]
>
>- Use the [hll_merge](hll-merge-function.md) function to merge the results of multiple `hll()` functions.
>- Use the [dcount_hll](dcount-hll-function.md) function to calculate the number of distinct values from the output of the `hll()` or `hll_merge` functions.

> [!IMPORTANT]
>The results of hll(), hll_if(), and hll_merge() can be stored and later retrieved. For example, you may want to create a daily unique users summary, which can then be used to calculate weekly counts.
> However, the precise binary representation of these results may change over time. There's no guarantee that these functions will produce identical results for identical inputs, and therefore we don't advise relying on them.

## Syntax

`hll` `(`*expr* [`,` *accuracy*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *accuracy* | `int` |   | The value that controls the balance between speed and accuracy. If unspecified, the default value is `1`. For supported values, see [Estimation accuracy](#estimation-accuracy). |

## Returns

Returns the intermediate results of distinct count of *expr* across the group.

## Example

In the following example, the `hll()` function is used to estimate the number of unique values of the `DamageProperty` column within each 10-minute time bin of the `StartTime` column.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVcjIydFwScxNTE8NKMovSC0qqdRUSKpUSMrM0wguSSwqCcnMTdUxNMjVBACCSG7CQQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize hll(DamageProperty) by bin(StartTime,10m)
```

The results table shown includes only the first 10 rows.

| StartTime | hll_DamageProperty |
|--|--|
| 2007-01-01T00:20:00Z | [[1024,14],["3803688792395291579"],[]] |
| 2007-01-01T01:00:00Z | [[1024,14],["7755241107725382121","-5665157283053373866","3803688792395291579","-1003235211361077779"],[]] |
| 2007-01-01T02:00:00Z | [[1024,14],["-1003235211361077779","-5665157283053373866","7755241107725382121"],[]] |
| 2007-01-01T02:20:00Z  | [[1024,14],["7755241107725382121"],[]] |
| 2007-01-01T03:30:00Z  | [[1024,14],["3803688792395291579"],[]] |
| 2007-01-01T03:40:00Z | [[1024,14],["-5665157283053373866"],[]] |
| 2007-01-01T04:30:00Z | [[1024,14],["3803688792395291579"],[]] |
| 2007-01-01T05:30:00Z | [[1024,14],["3803688792395291579"],[]] |
| 2007-01-01T06:30:00Z | [[1024,14],["1589522558235929902"],[]] |

## Estimation accuracy

[!INCLUDE [data-explorer-estimation-accuracy](../includes/estimation-accuracy.md)]
