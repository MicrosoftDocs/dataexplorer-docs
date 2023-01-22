# hll_if() (aggregation function)

Calculates the Intermediate results of [`dcount`](dcount-aggfunction.md) across the group, only in context of aggregation inside [summarize](summarizeoperator.md) in records for which *Predicate* evaluates to `true`.

Read about the [underlying algorithm (*H*yper*L*og*L*og) and the estimation accuracy](dcount-aggfunction.md#estimation-accuracy).

## Syntax

`hll_if` `(`*Expr*, *Predicate* [`,` *Accuracy*]`)`

## Arguments

* *Expr*: Expression that will be used for aggregation calculation. 
* *Predicate*: predicate that, if true, the *Expr*'s calculated value will be added to the intermediate result of `dcount`. 
* *Accuracy*, if specified, controls the balance between speed and accuracy.

  |Accuracy Value |Accuracy  |Speed  |Error  |
  |---------|---------|---------|---------|
  |`0` | lowest | fastest | 1.6% |
  |`1` | default  | balanced | 0.8% |
  |`2` | high | slow | 0.4%  |
  |`3` | high | slow | 0.28% |
  |`4` | extra high | slowest | 0.2% |
	
## Returns

The Intermediate results of distinct count of *`Expr`* across the group for which *Predicate* evaluates to `true`.
 
**Tips**

1. You may use the aggregation function [`hll_merge`](hll-merge-aggfunction.md) to merge more than one `hll` intermediate results (it works on `hll` output only).

1. You may use the function [`dcount_hll`](dcount-hllfunction.md), which will calculate the `dcount` from `hll` / `hll_merge` / `hll_if` aggregation functions.

## Examples

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where State in ("IOWA", "KANSAS")
| summarize hll_flood = hll_if(Source, EventType == "Flood") by State
| project State, SourcesOfFloodEvents = dcount_hll(hll_flood)
```

|State|SourcesOfFloodEvents|
|---|---|
|KANSAS|11|
|IOWA|7|

