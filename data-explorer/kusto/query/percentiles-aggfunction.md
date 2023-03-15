---
title: percentile(), percentiles() - Azure Data Explorer
description: Learn how to use the percentile(), percentiles() functions to calculate estimates for nearest rank percentiles in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/15/2023
---
# percentile(), percentiles() (aggregation function)

Calculates an estimate for the specified [nearest-rank percentile](#nearest-rank-percentile) of the population defined by *expr*.
The accuracy depends on the density of population in the region of the percentile.

`percentiles()` works similarly to `percentile()`. However, `percentiles()` can calculate multiple percentile values at once, which is more efficient than calculating each percentile value separately.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`percentile(`*expr*`,` *percentile*`)`

`percentiles(`*expr*`,` *percentiles*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | string | &check; | The expression to use for aggregation calculation.|
|*WeightExpr*| string | &check; | The expression to use as the weight of values for aggregation calculation.|
|*percentile*| double | &check;| A constant that specifies the percentile.|
|*Dynamic array* | dynamic | &check; | A list of percentiles in a dynamic array of integers or floating point numbers.|

## Returns

Returns a table with the estimates for *expr* of the specified percentiles in the group, each in a separate column.

> [!NOTE]
> To return multiple percentiles in an array, see [percentiles_array()](percentiles-array-aggfunction.md).

## Examples

### Calculate single percentile

The following example shows the value of `DamageProperty` being larger than 95% of the sample set and smaller than 5% of the sample set.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKC7NzU0syqxKVShILUoGCmbmpGq4JOYmpqcGFOUDxUoqdRQsTTUVkioVgksSS1IBgwSa1j8AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents | summarize percentile(DamageProperty, 95) by State
```

**Output**

The results table shown includes only the first 10 rows.

| State | percentile_DamageProperty_95 |
|--|--|
| ATLANTIC SOUTH | 0 |
| FLORIDA | 40000 |
| GEORGIA | 143333 |
| MISSISSIPPI | 80000 |
| AMERICAN SAMOA | 250000 |
| KENTUCKY | 35000 |
| OHIO | 150000 |
| KANSAS | 51392 |
| MICHIGAN | 49167 |
| ALABAMA | 50000 |

### Calculate multiple percentiles

The following example shows the value of `DamageProperty` simultaneously calculated using 5, 50 (median) and 95.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKC7NzU0syqxKVShILUoGCmbmpBZruCTmJqanBhTlAwVLKnUUTIHIQEfB0lRTIalSIbgksSQVAL6yeg1HAAAA" target="_blank">Run the query</a>

```kusto
StormEvents | summarize percentiles(DamageProperty, 5, 50, 95) by State
```

**Output**

The results table shown includes only the first 10 rows.

| State | percentile_DamageProperty_5 | percentile_DamageProperty_50 | percentile_DamageProperty_95 |
|--|--|--|--|
| ATLANTIC SOUTH | 0 | 0 | 0 |
| FLORIDA | 0 | 0 | 40000 |
| GEORGIA | 0 | 0 | 143333 |
| MISSISSIPPI | 0 | 0 | 80000 |
| AMERICAN SAMOA | 0 | 0 | 250000 |
| KENTUCKY | 0 | 0 | 35000 |
| OHIO | 0 | 2000 | 150000 |
| KANSAS | 0 | 0 | 51392 |
| MICHIGAN | 0 | 0 | 49167 |
| ALABAMA | 0 | 0 | 50000 |
|...|...|

## Nearest-rank percentile

*P*-th percentile (0 < *P* <= 100) of a list of ordered values, sorted in ascending order, is the smallest value in the list. The *P* percent of the data is less or equal to *P*-th percentile value ([from Wikipedia article on percentiles](https://en.wikipedia.org/wiki/Percentile#The_Nearest_Rank_method)).

Define *0*-th percentiles to be the smallest member of the population.

>[!NOTE]
> Given the approximating nature of the calculation, the actual returned value may not be a member of the population.
> Nearest-rank definition means that *P*=50 does not conform to the [interpolative definition of the median](https://en.wikipedia.org/wiki/Median). When evaluating the significance of this discrepancy for the specific application, the size of the population and an [estimation error](#estimation-error-in-percentiles) should be taken into account.

## Estimation error in percentiles

The percentiles aggregate provides an approximate value using [T-Digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf).

>[!NOTE]
>
> * The bounds on the estimation error vary with the value of the requested percentile. The best accuracy is at both ends of the [0..100] scale. Percentiles 0 and 100 are the exact minimum and maximum values of the distribution. The accuracy gradually decreases towards the middle of the scale. It's worst at the median and is capped at 1%.
> * Error bounds are observed on the rank, not on the value. Suppose percentile(X, 50) returned a value of Xm. The estimate guarantees that at least 49% and at most 51% of the values of X are less or equal to Xm. There is no theoretical limit on the difference between Xm and the actual median value of X.
> * The estimation may sometimes result in a precise value but there are no reliable conditions to define when it will be the case.
