---
title: dcount() (aggregation function) - Azure Data Explorer
description: This article describes dcount() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/10/2022
---
# dcount() (aggregation function)

Calculates an estimate of the number of distinct values that are taken by a scalar expression in the summary group.

> [!NOTE]
> The `dcount()` aggregation function is primarily useful for estimating the cardinality of huge sets. It trades performance for accuracy, and may return a result that varies between executions. The order of inputs may have an effect on its output.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`dcount` `(`*Expr*[`,` *Accuracy*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr*| scalar | &check; | A scalar expression whose distinct values are to be counted. |
| *Accuracy* | int |   | defines the requested estimation accuracy. If unspecified, the default value is `1`. See [Estimation accuracy](#estimation-accuracy) for supported values. |

## Returns

Returns an estimate of the number of distinct values of *`Expr`* in the group.

## Example

This example shows how many types of storm events happened in each state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXDJTEtLLQIKQ+RsU5LzS/NKNMC8kMqCVE2FpEqF4JLEklSgtvyilNQikACaLgBDbD8AXQAAAA==)**\]**

```kusto
StormEvents
| summarize DifferentEvents=dcount(EventType) by State
| order by DifferentEvents
```

**Results**

The results table shown includes only the first 10 rows.

| State                | DifferentEvents |
| -------------------- | --------------- |
| TEXAS                | 27              |
| CALIFORNIA           | 26              |
| PENNSYLVANIA         | 25              |
| GEORGIA              | 24              |
| ILLINOIS             | 23              |
| MARYLAND             | 23              |
| NORTH CAROLINA       | 23              |
| MICHIGAN             | 22              |
| FLORIDA              | 22              |
| OREGON               | 21              |
| KANSAS               | 21              |
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
