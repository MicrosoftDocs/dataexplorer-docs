---
title: hll() (aggregation function) - Azure Data Explorer
description: This article describes hll() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/14/2022
---
# hll() (aggregation function)

Calculates the Intermediate results of [`dcount`](dcount-aggfunction.md) across the group. only in context of aggregation inside [summarize](summarizeoperator.md).

Read about the [underlying algorithm (*H*yper*L*og*L*og) and the estimation accuracy](#estimation-accuracy).

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`hll` `(`*Expr* [`,` *Accuracy*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* |  string | &check; | Expression used for the aggregation calculation. |
| *Accuracy* |   |   | Controls the balance between speed and accuracy. |

## Returns

Returns the intermediate results of distinct count of *`Expr`* across the group.

> [!TIP]
>
>- You may use the aggregation function [`hll_merge`](hll-merge-aggfunction.md) to merge more than one `hll` intermediate results (it works on `hll` output only).
>- You may use the function [`dcount_hll`](dcount-hllfunction.md), which will calculate the `dcount` from `hll` / `hll_merge` aggregation functions.

## Examples

This example returns the hll results of property damage based on the start time.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlXIyMnRcEnMTUxPDSjKL0gtKqnUVEiqVEjKzNMILkksKgnJzE3VMTTI1QQAaW7+fEIAAAA=)**\]**

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

This function uses a variant of the [HyperLogLog (HLL) algorithm](https://en.wikipedia.org/wiki/HyperLogLog),
which does a stochastic estimation of set cardinality. The algorithm provides a "knob" that can be used to balance accuracy and execution time per memory size:

|Accuracy|Error (%)|Entry count   |
|--------|---------|--------------|
|       0|      1.6|2<sup>12</sup>|
|       1|      0.8|2<sup>14</sup>|
|       2|      0.4|2<sup>16</sup>|
|       3|     0.28|2<sup>17</sup>|
|       4|      0.2|2<sup>18</sup>|

> [!NOTE]
> The "entry count" column is the number of 1-byte counters in the HLL implementation.

The algorithm includes conditions for doing a perfect count (zero error), if the set cardinality is small enough:

* When the accuracy level is `1`, 1000 values are returned
* When the accuracy level is `2`, 8000 values are returned

The error bound is probabilistic, not a theoretical bound. The value is the standard deviation of error distribution (the sigma), and 99.7% of the estimations will have a relative error of under 3 x sigma.

The following image shows the probability distribution function of the relative
estimation error, in percentages, for all supported accuracy settings:

:::image type="content" border="false" source="images/dcount-aggfunction/hll-error-distribution.png" alt-text="hll error distribution.":::
