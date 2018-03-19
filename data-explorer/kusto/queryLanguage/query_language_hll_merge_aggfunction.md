# hll_merge() (aggregation function)

Merges HLL results across the group into single HLL value.

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md).

Read more about the underlying algorithm (*H*yper*L*og*L*og) and the estimated error [here](query_language_dcount_aggfunction.md#estimation-error-of-dcount).

**Syntax**

`summarize` `hll_merge(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged hll values of *Expr* across the group.
 
**Tips**

1) You may use the function [dcount_hll] (query_language_dcount_hllfunction.md) which will calculate the dcount from hll / hll_merge aggregation functions.

