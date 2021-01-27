---
title: series_stats() - Azure Data Explorer
description: This article describes series_stats() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/10/2020
---
# series_stats()

`series_stats()` returns statistics for a numerical series using multiple columns.  

The `series_stats()` function takes an expression returning a dynamical numerical array as input and calculates the following statistics:

* `min`: minimum value in the input array
* `min_idx`: first position of the minimum value in the input array
* `max`: maximum value in the input array
* `max_idx`: first position of the maximum value in the input array
* `avg`: average value of the input array
* `variance`: sample variance of input array
* `stdev`: sample standard deviation of the input array

> [!NOTE] 
> This function returns multiple values, so it can't be used as the input for another function.
> Consider using [series_stats_dynamic](./series-stats-dynamicfunction.md) if you need just a single
> value, such as "average".

## Syntax

`...` `|` `extend` `series_stats` `(` *Expr* [`,` *IgnoreNonFinite*] `)`

`...` `|` `extend` `(` *Name1* [`,` *Name2*...] `)` `=` `series_stats` `(` *Expr* [`,` *IgnoreNonFinite*] `)`

## Arguments

* *Expr*: An expression that returns a value of type `dynamic`, holding
  an array of numeric values (that is, values of type for which arithmetic
  operators are defined.)
  
* *IgnoreNonFinite*: A Boolean expression that specifies whether to calculate the
  statistics while ignore non-finite values of *Expr* (`null`, `NaN`, `inf`, etc.)
  If `false` (the default), a single item in *Expr* with this value will result in
  a value of `null` generated for all statistics values.

## Returns

The first form results in the following new columns being added:
`series_stats_x_min` (if *Expr* is the column reference `x`),
`series_stats_x_idx`, etc.

The second form results in columnd named `Name1`, `Name2`, etc. holding
these values, in-order.

## Example

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
print x=dynamic([23,46,23,87,4,8,3,75,2,56,13,75,32,16,29]) 
| project series_stats(x)

```

|series_stats_x_min|series_stats_x_min_idx|series_stats_x_max|series_stats_x_max_idx|series_stats_x_avg|series_stats_x_stdev|series_stats_x_variance|
|---|---|---|---|---|---|---|
|2|8|87|3|32.8|28.5036338535483|812.457142857143|
