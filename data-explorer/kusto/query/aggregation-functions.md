---
title:  Aggregation Functions 
description: Learn how to use aggregation functions to perform calculations on a set of values and return a single value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/20/2022
---

# Aggregation function types at a glance

An aggregation function performs a calculation on a set of values, and returns a single value. These functions are used in conjunction with the [summarize operator](summarize-operator.md). This article lists all available aggregation functions grouped by type. For scalar functions, see [Scalar function types](scalar-functions.md).

## Binary functions

| Function Name | Description |
|--|--|
| [binary_all_and()](binary-all-and-aggregation-function.md) | Returns aggregated value using the binary AND of the group. |
| [binary_all_or()](binary-all-or-aggregation-function.md) | Returns aggregated value using the binary OR of the group. |
| [binary_all_xor()](binary-all-xor-aggregation-function.md) | Returns aggregated value using the binary XOR of the group. |

## Dynamic functions

| Function Name | Description |
|--|--|
| [buildschema()](buildschema-aggregation-function.md) | Returns the minimal schema that admits all values of the dynamic input. |
| [make_bag()](make-bag-aggregation-function.md), [make_bag_if()](make-bag-if-aggregation-function.md) | Returns a property bag of dynamic values within the group without/with a predicate. |
| [make_list()](make-list-aggregation-function.md), [make_list_if()](make-list-if-aggregation-function.md) | Returns a list of all the values within the group without/with a predicate. |
| [make_list_with_nulls()](make-list-with-nulls-aggregation-function.md) | Returns a list of all the values within the group, including null values. |
| [make_set()](make-set-aggregation-function.md), [make_set_if()](make-set-if-aggregation-function.md) | Returns a set of distinct values within the group without/with a predicate. |

## Row selector functions

| Function Name | Description |
|--|--|
| [arg_max()](arg-max-aggregation-function.md) | Returns one or more expressions when the argument is maximized. |
| [arg_min()](arg-min-aggregation-function.md) | Returns one or more expressions when the argument is minimized. |
| [take_any()](take-any-aggregation-function.md), [take_anyif()](take-anyif-aggregation-function.md) | Returns a random non-empty value for the group without/with a predicate. |

## Statistical functions

| Function Name | Description |
|--|--|
| [avg()](avg-aggfunction.md) | Returns an average value across the group. |
| [avgif()](avgif-aggfunction.md) | Returns an average value across the group (with predicate). |
| [count()](count-aggregation-function.md), [countif()](countif-aggregation-function.md) | Returns a count of the group without/with a predicate. |
| [count_distinct()](count-distinct-aggregation-function.md), [count_distinctif()](count-distinctif-aggregation-function.md) | Returns a count of unique elements in the group without/with a predicate. |
| [dcount()](dcount-aggfunction.md), [dcountif()](dcountif-aggregation-function.md) | Returns an approximate distinct count of the group elements without/with a predicate. |
| [hll()](hll-aggregation-function.md) | Returns the HyperLogLog (HLL) results of the group elements, an intermediate value of the `dcount` approximation. |
| [hll_if()](hll-if-aggregation-function.md) | Returns the HyperLogLog (HLL) results of the group elements, an intermediate value of the `dcount` approximation (with predicate). |
| [hll_merge()](hll-merge-aggregation-function.md) | Returns a value for merged HLL results. |
| [max()](max-aggregation-function.md), [maxif()](maxif-aggregation-function.md) | Returns the maximum value across the group without/with a predicate. |
| [min()](min-aggregation-function.md), [minif()](minif-aggregation-function.md) | Returns the minimum value across the group without/with a predicate. |
| [percentile()](percentiles-aggregation-function.md) | Returns a percentile estimation of the group. |
| [percentiles()](percentiles-aggregation-function.md) | Returns percentile estimations of the group. |
| [percentiles_array()](percentiles-aggregation-function.md) | Returns the percentile approximates of the array. |
| [percentilesw()](percentiles-aggregation-function.md) | Returns the weighted percentile approximate of the group. |
| [percentilesw_array()](percentiles-aggregation-function.md) | Returns the weighted percentile approximate of the array. |
| [stdev()](stdev-aggregation-function.md), [stdevif()](stdevif-aggregation-function.md) | Returns the standard deviation across the group for a population that is considered a sample without/with a predicate. |
| [stdevp()](stdevp-aggregation-function.md) | Returns the standard deviation across the group for a population that is considered representative. |
| [sum()](sum-aggregation-function.md), [sumif()](sumif-aggregation-function.md) | Returns the sum of the elements within the group without/with a predicate. |
| [tdigest()](tdigest-aggregation-function.md) | Returns an intermediate result for the percentiles approximation, the weighted percentile approximate of the group. |
| [tdigest_merge()](tdigest-merge-aggregation-function.md) | Returns the merged `tdigest` value across the group. |
| [variance()](variance-aggregation-function.md), [varianceif()](varianceif-aggregation-function.md) | Returns the variance across the group without/with a predicate. |
| [variancep()](variancep-aggregation-function.md) | Returns the variance across the group for a population that is considered representative. |
