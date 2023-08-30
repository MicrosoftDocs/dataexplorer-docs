---
title: graph-match operator (Preview)
description: Learn how to use the graph-match operator to search for all occurrences of a graph pattern in a graph.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/29/2023
---
# graph-match operator (Preview)

The `graph-match` operator searches for all occurrences of a graph pattern in an input graph source.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-match` *Pattern* `where` *Constraints* `project` [*ColumnName* `=`] *Expression* [`,` ...]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *G* | string | &check; | The input graph source. |
| *Pattern* | string | &check; | A sequence of graph node elements connected by graph edge elements using graph notations. See [Graph pattern notation](#graph-pattern-notation). |
| *Constraints* | string | &check; | A Boolean expression composed of properties of named variables in the *Pattern*. Each graph element (node/edge) has a set of properties that were attached to it during the graph construction. The constraints define which elements (nodes and edges) are matched by the pattern. A property is referenced by the variable name followed by a dot (`.`) and the property name. |
| *Expression* | string |  | The `project` clause converts each pattern to a row in a tabular result, the project expression(s) have to be scalar and reference properties of named variables defined in the *Pattern*. A property is referenced by the variable name followed by a dot (`.`) and the attribute name. |

### Graph pattern notation

The following table shows the supported graph notation:
  
|Element|Named variable|Anonymous|
|---|---|---|
|Node|`(`*n*`)`|`()`|
|Directed edge: left to right|`-[`*e*`]->`|`-->`|
|Directed edge: right to left|`<-[`*e*`]-`|`<--`|
|Any direction edge|`-[`*e*`]-`|`--`|
|Variable length edge|`-[`*e*`*3..5]-`|`-[*3..5]-`|

### Variable length edge

A variable length edge allows a specific pattern to be repeated multiple times within defined limits. This type of edge is denoted by an asterisk (`*`), followed by the minimum and maximum occurrence values in the format *min*`..`*max*. Both the minimum and maximum values must be [integer](scalar-data-types/int.md) scalars. Any sequence of edges falling within this occurrence range can match the variable edge of the pattern, provided that all the edges in the sequence satisfy the constraints outlined in the `where` clause.

## Returns

The `graph-match` operator returns a tabular result, where each record corresponds to a match of the pattern in the graph.  
The returned columns are defined in the operator's `project` clause using properties of edges and/or nodes defined in the pattern. Properties and functions of properties of variable length edges are returned as a dynamic array, each value in the array corresponds to an occurrence of the variable length edge.

## Examples

### Attack path

The following example builds a graph from edges and nodes tables, the nodes represent people and systems and the edges are different relations between nodes. Following the `make-graph` operator that builds the graph is a call to `graph-match` with a graph pattern that searches for attack paths to the "Trent" system node.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42SUWvCMBDH3wW/w9EnBSs4H4YOBTf2OBhssAeREdujzWwTSc6JsA+/SxrTVvYwSkvS/+Xufv9chQRK52hhBbkgfvYVjpSocWnJSFVMgC7HdiMKXFZaFWMYDrb8QrKpZIbJBJJXNFYrXt3NJ+ClR73vCfNZEJ6/+ydm90F4EVWlzaWfbhHEd4OKnPR2sYQ1rxYLFnYP/KmYA/PihsPqk8na5hmTpBIktYr/3KHPDuIfYAEj03V9UjIThPZDUpmEtmJc7I/MyZJN+i5EtRSW2WpprfR8XUdiLkEkskPM0fHlHyGh4jUAriY1Bg0HP1CLA6aFEccSGo8gTdddf+DMhGEyeOcGwh/0Z9JaUFbCqG5KjtNtKLVL1yO26Wg042HOQg/WyeRscCbDuUSDEHJMfYXVquUAoXLw0a3WeOiVUHEa788HRGQX0qt9E9i/BNcON/2FGcHGp0DDg9TtbQJPLRhrHcygN1PJUtv0L6phv3BeAwAA" target="_blank">Run the query</a>

```kusto
let nodes = datatable(name:string, type:string, age:long) 
[ 
	"Alice", "Person", 23,  
	"Bob", "Person", 31,  
	"Eve", "Person", 17,  
	"Mallory", "Person", 29,  
	"Trent", "System", 99 
]; 
let edges = datatable(source:string, destination:string, edge_type:string) 
[ 
	"Alice", "Bob", "communicatesWith",  
	"Alice", "Trent", "trusts",  
	"Bob", "Trent", "hasPermission",  
	"Eve", "Alice", "attacks",  
	"Mallory", "Alice", "attacks",  
	"Mallory", "Bob", "attacks"  
]; 
edges 
| make-graph source --> destination with nodes on name 
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(trent) 
	where mallory.name == "Mallory" and trent.name == "Trent" and attacks.edge_type == "attacks" and hasPermission.edge_type == "hasPermission" 
	project Attacker = mallory.name, Compromised = compromised.name, System = trent.name
```

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

### All employees in a manager's org

The following example represents an organizational hierarchy, it demonstrates how a variable length edge could be used to find employees of different levels of the hierarchy in a single query. The nodes in the graph represent employees and the edges are from an employee to their manager. After we build the graph using `make-graph`, we search for employees in `Alice`'s org that are younger than `30`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WSwU7DMAyG75P2DtZOK2ortlKhjRUJEBdOiOu0Q9ZabSFNqjRiIPHwOGmSrqp6+B3/zmc7HDVg13P5izhAARXT9J05rgXrcD9o1Yo6BlbjnktRR7BcHOmH1RNvS1zFkG1jsIFneTZy4+Trtznd3jv5Jq3cOfnSqHagwF0eu2r4Y9x5bEuhMMmZFR9t2TBVmdMdBU4PZOBErbCXSs+ZfSeBu2OC0JXTE/0IG5qYMc2jYx+jYWLzyVNrwTVntkZH7YmXiz8C+8KkVqxvwvghSR49MFxa3VwtRgow+7BW60o6pssG1szcGh2Soyt+s0nT/JSESUSEc2lQIdjM1FYpCo8LTFThmpRuhgNkt+TplfzEcnobNOaQZmrYJ3EdJBm7ndCk3xnhF35HqevqH55azattAgAA" target="_blank">Run the query</a>

```kusto
let employees = datatable(name:string, age:long) 
[ 
	"Alice", 32,  
	"Bob", 31,  
	"Eve", 27,  
	"Joe", 29,  
	"Chris", 45, 
	"Alex", 35,
	"Ben", 23,
	"Richard", 39,
]; 
let reports = datatable(employee:string, manager:string) 
[ 
	"Bob", "Alice",  
	"Chris", "Alice",  
	"Eve", "Bob",
	"Ben", "Chris",
	"Joe", "Alice", 
	"Richard", "Bob"
]; 
reports 
| make-graph employee --> manager with employees on name 
| graph-match (alice)<-[reports*1..5]-(employee)
	where alice.name == "Alice" and employee.age < 30
	project employee = employee.name, age = employee.age, reportingPath = reports.manager
```

**Output**

|employee|age|reportingPath|
|---|---|---|
|Joe|29|[<br>  "Alice"<br>]|
|Eve|27|[<br>  "Alice",<br>  "Bob"<br>]|
|Ben|23|[<br>  "Alice",<br>  "Chris"<br>]|

## See also

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
