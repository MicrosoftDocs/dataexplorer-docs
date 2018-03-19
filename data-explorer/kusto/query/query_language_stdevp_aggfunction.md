# stdevp() (aggregation function)

Calculates the standard deviation of *Expr* across the group, considering the group as a [population](https://en.wikipedia.org/wiki/Statistical_population). 

* Used formula:
<p><img src="~/query/images/aggregations/stdev_population.png"></p>

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md)

**Syntax**

summarize `stdevp(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The standard deviation value of *Expr* across the group.
 
**Examples**

<!-- csl -->
```
range x from 1 to 5 step 1
| summarize makelist(x), stdevp(x)

```

|list_x|stdevp_x|
|---|---|
|[ 1, 2, 3, 4, 5]|1.4142135623731|

