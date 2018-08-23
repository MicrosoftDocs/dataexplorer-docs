# merge-tdigests() (aggregation function)

Merges tdigest results across the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

summarize `merge-tdigests(`*Expr*`)`

summarize `tdigest-merge(`*Expr*`)` - An alias.

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The merged tdigest values of *Expr* across the group.
 

**Tips**

1) You may use the function [`percentile-tdigest()`] (percentile-tdigestfunction.md).

2) All tdigests that are included in the same group must be of the same type.
