# argmax() (aggregation function)

Finds a row in the group that maximises *ExprToMaximize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](query_language_summarizeoperator.md)

**Syntax**

`summarize` [`(`*NameExprToMaximize* `,` *NameExprToReturn* [`,` ...] `)=`] `argmax` `(`*ExprToMaximize*, `*` | *ExprToReturn*  [`,` ...]`)`

**Arguments**

* *ExprToMaximize*: Expression that will be used for aggregation calculation. 
* *ExprToReturn*: Expression that will be used for returning the value when *ExprToMaximize* is
  maximum. Expression to return may be a wildcard (*) to return all columns of the input table.
* *NameExprToMaximize*: An optional name for the result column representing *ExprToMaximize*.
* *NameExprToReturn*: Additional optional names for the result columns representing *ExprToReturn*.

**Returns**

Finds a row in the group that maximises *ExprToMaximize*, and 
returns the value of *ExprToReturn* (or `*` to return the entire row).

**Examples**

See examples for [argmin()](query_language_argmin_aggfunction.md) aggregation function

**Notes**

When using a wildcard (`*`) as *ExprToReturn*, it is **strongly recommended** that
the input to the `summarize` operator will be restricted to include only the columns
that are used following that operator, as the optimization rule to automatically 
project-away such columns is currently not implemented. In other words, make sure
to introduce a projection similar to the marked line below:

<!--- csl --->
```
datatable(a:string, b:string, c:string, d:string) [...]
| project a, b, c // <-- Add this projection to remove d
| summarize argmax(a, *)
| project B=max_a_b, C=max_a_c
```
