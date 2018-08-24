# stdev() (aggregation function)

Calculates the standard deviation of *Expr* across the group, considering the group as a [sample](https://en.wikipedia.org/wiki/Sample-%28statistics%29). 

* Used formula:
![](./images/aggregations/stdev-sample.png)

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

summarize `stdev(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The standard deviation value of *Expr* across the group.
 
**Examples**

```kusto
range x from 1 to 5 step 1
| summarize makelist(x), stdev(x)

```

|list-x|stdev-x|
|---|---|
|[ 1, 2, 3, 4, 5]|1.58113883008419|


