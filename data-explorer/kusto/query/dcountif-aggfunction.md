---
title: dcountif() (aggregation function) - Azure Data Explorer
description: This article describes dcountif() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/10/2022
---
# dcountif() (aggregation function)

Calculates an estimate of the number of distinct values of *Expr* of rows.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`dcountif` `(`*Expr*, *Predicate*, [`,` *Accuracy*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression that will be used for aggregation calculation. |
| *Predicate* | string | &check; | Expression that will be used to filter rows. |
| *Accuracy* | int |  | Controls the balance between speed and accuracy. If unspecified, the default value is `1`. See [Estimation accuracy](#estimation-accuracy) for supported values. |

## Returns

Returns an estimate of the number of distinct values of *Expr* of rows for which *Predicate* evaluates to `true` in the group.

> [!TIP]
> `dcountif()` may return an error in cases where all, or none of the rows pass the `Predicate` expression.

## Example

This example shows how many types of fatal storm events happened in each state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22MMQ6DMBAE+7ziShAUfAAqEyk1+cCBz8ISttH5AIHy+BhoKXc0O50Edu1KXuLrB3FxDtkeBMoaQ5zwGwWnW6j1EBYv1mTX/u4zlZkilDEqyzQIFHDPj9cXyJsqh36HTlAo9bcxNR/b0ECVhMCa+Hw8OX+LHx0UrAAAAA==)**\]**

```kusto
StormEvents
| summarize DifferentFatalEvents=dcountif(EventType,(DeathsDirect + DeathsIndirect)>0) by State
| where DifferentFatalEvents > 0
| order by DifferentFatalEvents 
```

**Results**

The results table shown includes only the first 10 rows.

| State          | DifferentFatalEvents |
| -------------- | -------------------- |
| CALIFORNIA     | 12                   |
| TEXAS          | 12                   |
| OKLAHOMA       | 10                   |
| ILLINOIS       | 9                    |
| KANSAS         | 9                    |
| NEW YORK       | 9                    |
| NEW JERSEY     | 7                    |
| WASHINGTON     | 7                    |
| MICHIGAN       | 7                    |
| MISSOURI       | 7                    |
| ... | ... |

## Estimation accuracy

The `dcount()` aggregate function uses a variant of the [HyperLogLog (HLL) algorithm](https://en.wikipedia.org/wiki/HyperLogLog),
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

The algorithm includes some provisions for doing a perfect count (zero error), if the set cardinality is small enough:

* When the accuracy level is `1`, 1000 values are returned
* When the accuracy level is `2`, 8000 values are returned

The error bound is probabilistic, not a theoretical bound. The value is the standard deviation of error distribution (the sigma), and 99.7% of the estimations will have a relative error of under 3 x sigma.

The following image shows the probability distribution function of the relative
estimation error, in percentages, for all supported accuracy settings:

:::image type="content" border="false" source="images/dcount-aggfunction/hll-error-distribution.png" alt-text="hll error distribution.":::
