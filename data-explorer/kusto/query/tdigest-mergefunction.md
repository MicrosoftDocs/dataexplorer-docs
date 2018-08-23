# tdigest-merge()

Merges tdigest results (scalar version of the aggregate version [`tdigest-merge()`](tdigest-merge-aggfunction.md)).

Read more about the underlying algorithm (T-Digest) and the estimated error [here](percentiles-aggfunction.md#estimation-error-in-percentiles).

**Syntax**

`tdigest-merge(` *Expr1*`,` *Expr2*`, ...)` 

**Arguments**

* Columns which has the tdigests to be merged.

**Returns**

The result for merging the columns `*Exrp1*`, `*Expr2*`, ... `*ExprN*` to one tdigest.

**Examples**

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```
range x from 1 to 10 step 1 
| extend y = x + 10
| summarize tdigestX = tdigest(x), tdigestY = tdigest(y)
| project merged = tdigest-merge(tdigestX, tdigestY)
| project percentile-tdigest(merged, 100, typeof(long))
```

|percentile-tdigest-merged|
|---|
|20|
