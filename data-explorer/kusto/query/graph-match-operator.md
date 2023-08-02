---
title: graph-match operator (Preview)
description: Learn how to use the graph-match operator to search for all occurences of a graph pattern in a graph.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# graph-match operator (Preview)

The `graph-match` operator searches for all occurences of a graph pattern in an input graph source.

> [!WARNING]
> The `graph-match` operator is currently offered in preview mode.
> The syntax and semantics of the operator might change prior to public availability.

## Syntax

*G* | `graph-match` [ *graphMatchParameters* ] *Patterns* `where` *Constraints* `project` [*ColumnName* =] *Expression* [`,` ...]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *graphMatchParameters* | string | | Zero or more space-separated parameters in the form of *Name* `=` *Value* that control the behavior of the pattern matching operation and execution plan. See [supported graph-match parameters](#supported-parameters). |
| *Patterns* | string | &check; | one or more sequences of graph node elements connected by graph edge elements using graph notations. all patterns must create a single connected component. For more information, see [Graph Pattern Notation](#graph-pattern-notation) |
| *Constraints* | string | | a Boolean expression composed of properties of named variables in the *Pattern*. Each graph element (node/edge) has a set of properties that were attached to it during the graph construction. The constraints define which elements (nodes and edges) are matched by the pattern. A property is referenced by the variable name followed by a dot (`.`) and the property name. |
| *Expression* | string | &check; | the `project` clause converts each pattern to a row in a tabular result, the project expression(s) have to be scalar and reference properties of named variables defined in the *Pattern*. A property is referenced by the variable name followed by a dot (`.`) and the attribute name. |

### Graph Pattern Notation
  
|Element|Named variable|Anonymous|
|---|---|---|
|Node|`(`*n*`)`|`()`|
|Directed edge: left to right|`-[`*e*`]->`|`-->`|
|Directed edge: right to left|`<-[`*e*`]-`|`<--`|
|Any direction edge|`-[`*e*`]-`|`--`|
|Variable length edge|`-[`*e*`*3..5]-`|`-[*3..5]-`|

### Supported parameters
|Name|Type|Required|Description|
|--|--|--|--|
| *cycles* |string|| Indicates to perform cycle prevention based on the specified type: `none`, `edges`, `nodes`. The default is `none`.|

## Returns

The `graph-match` operator returns a *tabular* result, each record corresponds to a match of the pattern in the graph.  
The returned columns are defined in the operator's `project` clause.

## Examples

### 1. Attack path

The following example builds a graph from edges and nodes tables, the nodes represent people and systems and the edges are different relations between nodes. Following the `make-graph` operator that builds the graph is a call to `graph-match` with a graph pattern that searches for attack paths to the "Trent" system node. 

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

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

### 2. All employees in a manager's org

The following example represents an organizational hierarchy. The nodes in the graph represent employees and the edges are from an employee to their manager. After we build the graph using `make-graph`, we search for employees in `Alice`'s org that are younger than `30`.

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

|employee|age|reportingPath|
|---|---|---|
|Joe|29|[<br>  "Alice"<br>]|
|Eve|27|[<br>  "Alice",<br>  "Bob"<br>]|
|Ben|23|[<br>  "Alice",<br>  "Chris"<br>]|


## Next steps

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-merge operator](graph-merge-operator.md)

