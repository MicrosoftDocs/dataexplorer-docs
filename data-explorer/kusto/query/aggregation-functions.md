---
title: Aggregation Functions - Azure Data Explorer 
description: This article describes aggregation functions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/08/2021
---
# Aggregation function types

An aggregation function performs a calculation on a set of values, and returns a single value. This article lists all available aggregation functions grouped by type. For scalar functions, see [Scalar function types](scalarfunctions.md).

## Binary functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[binary_all_and()](binary-all-and-aggfunction.md)|Returns aggregated value using the binary AND of the group.|
|[binary_all_or()](binary-all-or-aggfunction.md)|Returns aggregated value using the binary OR of the group.|
|[binary_all_xor()](binary-all-xor-aggfunction.md)|Returns aggregated value using the binary XOR of the group.|

## Dynamic functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[buildschema()](buildschema-aggfunction.md)|Returns the minimal schema that admits all values of the dynamic input.|
|[make_bag()](make-bag-aggfunction.md)|Returns a property bag of dynamic values within the group.|
|[make_bag_if()](make-bag-if-aggfunction.md)|Returns a property bag of dynamic values within the group (with predicate).|
|[make_list()](makelist-aggfunction.md) |Returns a list of all the values within the group.|
|[make_list_if()](makelistif-aggfunction.md)|Returns a list of all the values within the group with predicate.|
|[make_list_with_nulls()](make-list-with-nulls-aggfunction.md)|Returns a list of all the values within the group, including null values.|
|[make_set()](makeset-aggfunction.md)|Returns a set of distinct values within the group.|
|[make_set_if()](makesetif-aggfunction.md)|Returns a set of distinct values within the group (with predicate).|

## Row selector functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[arg_max()](arg-max-aggfunction.md)|Returns one or more expressions when the argument is maximized.|
|[arg_min()](arg-min-aggfunction.md)|Returns one or more expressions when the argument is minimized.|
|[take_any()](take-any-aggfunction.md)|Returns a random non-empty value for the group.|
|[take_anyif()](take-anyif-aggfunction.md)|Returns a random non-empty value for the group (with predicate).|

## Statistical functions

|Function Name            |Description                                             |
|-------------------------|--------------------------------------------------------|
|[avg()](avg-aggfunction.md)|Returns an average value across the group.|
|[avgif()](avgif-aggfunction.md)|Returns an average value across the group (with predicate).|
|[count()](count-aggfunction.md)|Returns a count of the group.|
|[countif()](countif-aggfunction.md)|Returns a count with the predicate of the group.|
|[dcount()](dcount-aggfunction.md)|Returns an approximate distinct count of the group elements.|
|[dcountif()](dcountif-aggfunction.md)|Returns an approximate distinct count of the group elements with the predicate of the group.|
|[hll()](hll-aggfunction.md)|Returns the hyper log log (hll) results of the group elements, an intermediate value of the `dcount` approximation.|
|[hll_merge()](hll-merge-aggfunction.md)|Returns a value for merged hll results.|
|[max()](max-aggfunction.md)|Returns the maximum value across the group.|
|[maxif()](maxif-aggfunction.md)|Returns the maximum value across the group with the predicate.|
|[merge_tdigest()](tdigest-merge-aggfunction.md)|Returns the merged `tdigest` value across the group, is an alias of `tdigest_merge`.|
|[min()](min-aggfunction.md)|Returns the minimum value across the group.|
|[minif()](minif-aggfunction.md)|Returns the minimum value across the group with predicate.|
|[percentile()](percentiles-aggfunction.md)|Returns a percentile estimation of the group.|
|[percentiles()](percentiles-aggfunction.md)|Returns percentile estimations of the group.|
|[percentiles_array()](percentiles-aggfunction.md)|Returns the percentile approximates of the array.|
|[percentilesw()](percentiles-aggfunction.md)|Returns the weighted percentile approximate of the group.|
|[percentilesw_array()](percentiles-aggfunction.md)|Returns the weighted percentile approximate of the array.|
|[stdev()](stdev-aggfunction.md)|Returns the standard deviation across the group for a population that is considered a sample.|
|[stdevif()](stdevif-aggfunction.md)|Returns the standard deviation across the group with the predicate.|
|[stdevp()](stdevp-aggfunction.md)|Returns the standard deviation across the group for a population that is considered representative.|
|[sum()](sum-aggfunction.md)|Returns the sum of the elements within the group.|
|[sumif()](sumif-aggfunction.md)|Returns the sum of the elements within the group with the predicate.|
|[tdigest()](tdigest-aggfunction.md)|Returns an intermediate result for the percentiles approximation, the weighted percentile approximate of the group.|
|[tdigest_merge()](tdigest-merge-aggfunction.md)|Returns the merged `tdigest` value across the group.|
|[variance()](variance-aggfunction.md)|Returns the variance across the group.|
|[varianceif()](varianceif-aggfunction.md)|Returns the variance across the group with predicate.|
|[variancep()](variancep-aggfunction.md)|Returns the variance across the group for a population that is considered representative.|
