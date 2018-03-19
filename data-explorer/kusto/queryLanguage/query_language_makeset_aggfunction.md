# makeset() (aggregation function)

Returns a `dynamic` (JSON) array of the set of distinct values that *Expr* takes in the group. 

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md)

**Syntax**

`summarize` `makeset(`*Expr*` [`,` *MaxListSize*]`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation.
* *MaxListSize* is an optional integer limit on the maximum number of elements returned (default is *128*).

**Returns**

Returns a `dynamic` (JSON) array of the set of distinct values that *Expr* takes in the group.
The array's sort order is undefined.

**Tip**

To just count the distinct values, use [dcount()](query_language_dcount_aggfunction.md)

**Example**

<!--csl -->
```
PageViewLog 
| summarize countries=makeset(country) by continent
```

<p><img src="~/queryLanguage/images/aggregations/makeset.png"></p>

See also the [`mvexpand` operator](./query_language_mvexpandoperator.md) for the opposite function.
