---
title: graph-match operator
description: Learn how to use the graph-match operator to search for all occurrences of a graph pattern in a graph.
ms.reviewer: rocohen
ms.topic: reference
ms.date: 12/20/2023
---
# graph-match operator

The `graph-match` operator searches for all occurrences of a graph pattern in an input graph source.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-match` [`cycles` `=` *CyclesOption*]  *Pattern* `where` *Constraints* `project` [*ColumnName* `=`] *Expression* [`,` ...]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *G* | `string` |  :heavy_check_mark: | The input graph source. |
| *Pattern* | `string` |  :heavy_check_mark: | One or more comma delimited sequences of graph node elements connected by graph edge elements using graph notations. See [Graph pattern notation](#graph-pattern-notation). |
| *Constraints* | `string` |  :heavy_check_mark: | A Boolean expression composed of properties of named variables in the *Pattern*. Each graph element (node/edge) has a set of properties that were attached to it during the graph construction. The constraints define which elements (nodes and edges) are matched by the pattern. A property is referenced by the variable name followed by a dot (`.`) and the property name. |
| *Expression* | `string` |  | The `project` clause converts each pattern to a row in a tabular result, the project expression(s) have to be scalar and reference properties of named variables defined in the *Pattern*. A property is referenced by the variable name followed by a dot (`.`) and the attribute name. |
| *CyclesOption* | `string` |  | Controls whether cycles are matched in the *Pattern*, allowed values: `all`, `none`, `unique_edges`. If `all` is specified then all cycles are matched, if `none` is specified cycles are not matched, if `unique_edges` (default) is specified, cycles are matched but only if the cycles don't include the same edge more than once. |

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

### Multiple sequences (Preview)

Multiple comma delimited sequences are used to express nonlinear patterns. To describe the connection between different sequences they have to share one or more variable name of a node. For example, to express a star pattern with a node *n* in the center of the star and connected to nodes *a*,*b*,*c* and *d* the following pattern could be used: `(`*a*`)--(`*n*`)--(`*b*`)`,`(`*c*`)--(`*n*`)--(`*d*`)`. Nore that only single connected component patterns are supported.

## Returns

The `graph-match` operator returns a tabular result, where each record corresponds to a match of the pattern in the graph.  
The returned columns are defined in the operator's `project` clause using properties of edges and/or nodes defined in the pattern. Properties and functions of properties of variable length edges are returned as a dynamic array, each value in the array corresponds to an occurrence of the variable length edge.

## Examples

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

### Attack path

The following example builds a graph from the `Actions` and `Entities` tables. The entities are people and systems, and the actions describe different relations between entities. Following the `make-graph` operator that builds the graph is a call to `graph-match` with a graph pattern that searches for attack paths to the "Apollo" system.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAI1SwWqDQBC9C%2f7D4CkBDaQ5lKQkkJYcC4UeegihbNZFt9Fd2Z00BPrxHVfNum0PRZTV92bmvedUAmGnUKIUFtaQM6TrWImJYrVYWTRSFSngtfEvrBCrSqtiCnG0pxsg2VaSiySF5EUYqxWd7hYpdNijPgbIYj4gu8%2bwZn4%2fIM%2bsqrS5hh2XA7ptNMEt%2bHq1KGo6LZcEHR7oUZGhLUepVejH6rPh3kQuLErFWp435sreR2b%2fstj74bquz0pyhsK%2bSSyTm7qB6GWiOVu0yY9EPF4ySzZraa10VoN4bv0YIuMn32YU0n84%2fdSBAUNgQ1hx9AU1O4msMKwpocsLsmwzzgouZNUvDH1o98TVurKsZshLmNTd3Gm27%2bcdss2EImuMJpsiJyAw3cLM5TF1wi%2blMAL6LjM3Y732doCpHDq%2bB%2fs8O6ybOhv9Use5uW9JgYJf1PCnOFWk%2fkNw2i%2fXRRhasLHEFJ68Q8JGfnu821eCRtrjKI6%2bAdpZ186GAwAA" target="_blank">Run the query</a>

```kusto
let Entities = datatable(name:string, type:string, age:long) 
[ 
  "Alice", "Person", 23,  
  "Bob", "Person", 31,  
  "Eve", "Person", 17,  
  "Mallory", "Person", 29,  
  "Apollo", "System", 99 
]; 
let Actions = datatable(source:string, destination:string, action_type:string) 
[ 
  "Alice", "Bob", "communicatesWith",  
  "Alice", "Apollo", "trusts",  
  "Bob", "Apollo", "hasPermission",  
  "Eve", "Alice", "attacks",  
  "Mallory", "Alice", "attacks",  
  "Mallory", "Bob", "attacks"  
]; 
Actions 
| make-graph source --> destination with Entities on name 
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(apollo) 
  where mallory.name == "Mallory" and apollo.name == "Apollo" and attacks.action_type == "attacks" and hasPermission.action_type == "hasPermission" 
  project Attacker = mallory.name, Compromised = compromised.name, System = apollo.name
```

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Apollo|

### Star pattern (Preview)

The following example is similar to the previous attack path example, but with an additional constraint: we want the compromised entity to also communicate with *Alice*. The `graph-match` pattern prefix is the same as the previous example and we add an additional sequence with the *compromised* as a link between the sequences.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAI2ST2uDMBjG74Lf4cWTgha6HkY7WuhGj4PBDjuUMlINmtUkkqQrhX34vSbaxG2HIYr6vP9%2bT96WGtgJwwyjGtZQEYPXsaWpIJyutFFM1DmYa%2bc%2fSE1XrRR1BnG0xxsg2baspEkOyQtVWgp8u1vk4LRHeZwoi%2fmo7D6nOfP7UXkmbSvVdVpxOarbTqLci69XbSjHt%2bUSpcMDPloE2paGSTHl0fKsSg9RUW2YIH2cB7Np7wHsX4gDTyk5PwtWEkP1GzNNcptuDPRjGnXWRic%2fHPF6QzRicqY1s6gTe271iDGkPPkygUn%2fiRm6jhEwGjaaFUdfwMmJFrUiXQPOLyiKTegVXBDVLwz%2b6PfE5tq0ghNTNpBy1zcr9kO%2fQ7FJ0bJOScSkFQoT6F4m1o8shx%2bBodOHIiU9a2bxLg1VFIZeMzvJeu2hgYgKXFUvDq47zc02Cw7extw86oMmc%2f4KnR6dq9oPGDS0Z9OPi0wftMT1tOWpwv0MZ8%2fhyXOjFrgw6G7dUQqg4iiOvgFiI7WDxQMAAA" target="_blank">Run the query</a>

```kusto
let Entities = datatable(name:string, type:string, age:long) 
[ 
  "Alice", "Person", 23,  
  "Bob", "Person", 31,  
  "Eve", "Person", 17,  
  "Mallory", "Person", 29,  
  "Apollo", "System", 99 
]; 
let Actions = datatable(source:string, destination:string, action_type:string) 
[ 
  "Alice", "Bob", "communicatesWith",  
  "Alice", "Apollo", "trusts",  
  "Bob", "Apollo", "hasPermission",  
  "Eve", "Alice", "attacks",  
  "Mallory", "Alice", "attacks",  
  "Mallory", "Bob", "attacks"  
]; 
Actions 
| make-graph source --> destination with Entities on name 
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(apollo), (compromised)-[communicates]-(alice) 
  where mallory.name == "Mallory" and apollo.name == "Apollo" and attacks.action_type == "attacks" and hasPermission.action_type == "hasPermission" and alice.name == "Alice"
  project Attacker = mallory.name, Compromised = compromised.name, System = apollo.name
```

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Apollo|


## Related content

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
