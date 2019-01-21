---
title: dcount() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes dcount() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# dcount() (aggregation function)

Returns an estimate of the number of distinct values of *Expr* in the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

summarize `dcount(`*Expr* [`,` *Accuracy*]`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation.
* *Accuracy*, if specified, controls the balance between speed and accuracy (see Note).
    * `0` = the least accurate and fastest calculation. 1.6% error
    * `1` = the default, which balances accuracy and calculation time; about 0.8% error.
    * `2` = accurate and slow calculation; about 0.4% error.
    * `3` = extra accurate and slow calculation; about 0.28% error.
    * `4` = super accurate and slowest calculation; about 0.2% error.

**Returns**

Returns an estimate of the number of distinct values of *Expr* in the group. 

**Example**

```kusto
PageViewLog | summarize countries=dcount(country) by continent
```

![alt text](./images/aggregations/dcount.png "dcount")

**Tip: Listing distinct values**

To list the distinct values, you can use:
- `summarize by *Expr*`
- [`makeset`](makeset-aggfunction.md) : `summarize makeset(`*Expr*`)` 

**Tip: Accurate distinct count**

While `dcount()` provides a fast and reliable way to count distinct values,
it relies on a statistical algorithm to do so. Therefore, invoking this
aggregation multiple times might result in different values being returned.

* If the accuracy level is `1` and the number of distinct values is smaller than 1000 or so, `dcount()` returns a perfectly-accurate count.
* If the accuracy level is `2` and the number of distinct values is smaller than 8000 or so, `dcount()` returns a perfectly-accurate count.
* If the number of distinct values is larger than that, but not very
  large, one may try to use double-`count()` to calculate a single `dcount()`.
  This is shown in the following example; the two expressions are equivalent
  (except that the second one might run out of memory): 

```kusto
T | summarize dcount(Key)

T | summarize count() by Key | summarize count()
```  

## Estimation error of dcount

dcount uses a variant of [HyperLogLog (HLL) algorithm](https://en.wikipedia.org/wiki/HyperLogLog) which does stochastic estimation of set cardinality. In practice it means that the estimation error is described in terms of probability distribution, not theoretical bounds.
So the stated error actually specifies the standard deviation of error distribution (sigma), 99.7% of estimation will have a relative error of under 3*sigma
The following depicts probability distribution function of relative estimation error (in percents) for all dcount's accuracy settings:

![alt text](./images/aggregations/hll-error-distribution.png "hll-error-distribution")


 