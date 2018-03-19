# tdigest_merge() (aggregation function)

Merges tdigest results across the group. 

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md).

Read more about the underlying algorithm (T-Digest) and the estimated error [here](query_language_percentiles_aggfunction.md#estimation-error-in-percentiles).

**Syntax**

summarize `tdigest_merge(`*Expr*`)`.

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged tdigest values of *Expr* across the group.
 

**Tips**

1) You may use the function [`percentile_tdigest()`] (query_language_percentile_tdigestfunction.md).

2) All tdigests that are included in the same group must be of the same type.