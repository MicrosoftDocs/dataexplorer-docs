# merge_tdigests() (aggregation function)

Merges tdigest results across the group. 

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md)

**Syntax**

summarize `merge_tdigests(`*Expr*`)`

summarize `tdigest_merge(`*Expr*`)` - An alias.

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged tdigest values of *Expr* across the group.
 

**Tips**

1) You may use the function [`percentile_tdigest()`] (query_language_percentile_tdigestfunction.md).

2) All tdigests that are included in the same group must be of the same type.