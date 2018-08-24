# hll-merge()

Merges hll results (scalar version of the aggregate version [`hll-merge()`](hll-merge-aggfunction.md)).

Read more about the underlying algorithm (*H*yper*L*og*L*og) and the estimated error [here](dcount-aggfunction.md#estimation-error-of-dcount).

**Syntax**

`hll-merge(` *Expr1*`,` *Expr2*`, ...)`

**Arguments**

* Columns which has the hll values to be merged.

**Returns**

The result for merging the columns `*Exrp1*`, `*Expr2*`, ... `*ExprN*` to one hll value.

**Examples**

```kusto
range x from 1 to 10 step 1 
| extend y = x + 10
| summarize hll-x = hll(x), hll-y = hll(y)
| project merged = hll-merge(hll-x, hll-y)
| project dcount-hll(merged)
```

|dcount-hll-merged|
|---|
|20|


