# hll() (aggregation function)

Calculates the Intermediate results of [dcount](query_language_dcount_aggfunction.md) across the group. 

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md).

Read more about the underlying algorithm (*H*yper*L*og*L*og) and the estimated error [here](query_language_dcount_aggfunction.md#estimation-error-of-dcount).

**Syntax**

`summarize` `hll(`*Expr* [`,` *Accuracy*]`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 
* *Accuracy*, if specified, controls the balance between speed and accuracy.
    * `0` = the least accurate and fastest calculation.
    * `1` = the default, which balances accuracy and calculation time; about 0.8% error.
    * `2` = most accurate and slowest calculation; about 0.4% error.
	
**Returns**

The Intermediate results of distinct count of *Expr* across the group.
 
**Tips**

1) You may use the aggregation function [hll_merge](query_language_hll_merge_aggfunction.md) to merge more than one hll intermediate results (it works on hll output only).

2) You may use the function [dcount_hll] (query_language_dcount_hllfunction.md) which will calculate the dcount from hll / hll_merge aggregation functions.

**Examples**


```
StormEvents
| summarize hll(DamageProperty) by bin(StartTime,10m)

```

|StartTime|hll_DamageProperty|
|---|---|
|2007-09-18 20:00:00.0000000|[[1024,14],[-5473486921211236216,-6230876016761372746,3953448761157777955,4246796580750024372],[]]|
|2007-09-20 21:50:00.0000000|[[1024,14],[4835649640695509390],[]]|
|2007-09-29 08:10:00.0000000|[[1024,14],[4246796580750024372],[]]|
|2007-12-30 16:00:00.0000000|[[1024,14],[4246796580750024372,-8936707700542868125],[]]|

