---
title: graph-shortest-paths Operator (Preview)
description: Learn how to use the graph-shortest-paths operator to efficiently find the shortest paths from a given set of source nodes to a set of target nodes within a graph
ms.reviewer: royo
ms.topic: reference
ms.date: 06/13/2024
---

# graph-shortest-paths Operator (Preview)

> [!WARNING]
> This feature is currently in preview and is subject to change. The semantics and syntax of the graph feature might change before they are released as generally available.

The `graph-shortest-paths` operator finds shortest paths between a set of source nodes and a set of target nodes in a graph and returns a table with the results.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-shortest-paths` [`output` `=` *OutputOption*] *Pattern* `where` *Predicate* `project` [*ColumnName* `=`] *Expression* [`,` ...]

## Parameters

| Name                    | Type          | Required | Description |
|-------------------------|---------------|----------|-------------|
| *G*                     | string        | ✔️       | The graph source, typically the output from a `make-graph` operation. |
| *Pattern*               | string        | ✔️       | A [path pattern](graph-shortest-path-operator.md#path-pattern-notation) describing the path to find. Patterns must include at least one variable length edge and cannot contain multiple sequences. |
| *Predicate*             | expression    |           | A Boolean expression composed of properties of named variables in the Pattern and constants. |
| *Expression*            | expression    | ✔️       | A scalar expression that defines the output row for each found path, using constants and references to properties of named variables in the Pattern. |
| *OutputOption*          | string        |           | Specifies the search output: `any` for a single shortest path per source/target pair, `all` for all shortest paths of equal minimum length. |


### Path pattern notation

The following table shows the supported notations:

|Element|Named variable|Anonymous|
|---|---|---|
|Node|`(`*n*`)`|`()`|
|Directed edge: left to right|`-[`*e*`]->`|`-->`|
|Directed edge: right to left|`<-[`*e*`]-`|`<--`|
|Any direction edge|`-[`*e*`]-`|`--`|
|Variable length edge|`-[`*e*`*3..5]-`|`-[*3..5]-`|

#### Variable length edge

A variable length edge allows a specific pattern to be repeated multiple times within defined limits. This type of edge is denoted by an asterisk (`*`), followed by the minimum and maximum occurrence values in the format *min*`..`*max*. Both the minimum and maximum values must be integer scalars. Any sequence of edges falling within this occurrence range can match the variable edge of the pattern, provided that all the edges in the sequence satisfy the constraints outlined in the `where` clause.

## Returns

The `graph-shortest-paths` operator returns a tabular result, where each record corresponds to a path found in the graph. The returned columns are defined in the operator's `project` clause using properties of nodes and edges defined in the pattern. Properties and functions of properties of variable length edges are returned as a dynamic array, each value in the array corresponds to an occurrence of the variable length edge.

## Examples

### Example: Finding Any Shortest Paths in a Complex Manufacturing Network

Assume we have an expanded dataset describing assets, lines, and multiple factories:

```kusto
let nodes = datatable(Name:string, Type:string, Description:string, hasAnomaly:bool)
[
    "Asset1", "Asset", "", true,
    "Asset2", "Asset", "", false,
    "Asset3", "Asset", "", true,
    "Asset4", "Asset", "", false,
    "Line1", "Line", "Primary line", false,
    "Line2", "Line", "Secondary line", false,
    "Line3", "Line", "Tertiary line", false,
    "Factory1", "Factory", "Main plant", false,
    "Factory2", "Factory", "Auxiliary unit", false,
    "Factory3", "Factory", "Secondary plant", false,
    "Factory4", "Factory", "Tertiary unit", false
];
let connections = datatable(Source:string, Destination:string)
[
    "Asset1", "Line1",
    "Line1", "Factory1",
    "Asset2", "Line2",
    "Line2", "Factory2",
    "Asset3", "Line3",
    "Line3", "Factory3",
    "Asset1", "Line2",
    "Line2", "Factory3",
    "Asset3", "Line1",
    "Line1", "Factory4"
];
connections | make-graph Source --> Destination with nodes on Name
| graph-shortest-paths output=any (asset)-[e*1..10]->(line)-->(factory)
   where asset.hasAnomaly and line.Description contains "Primary"
   project line=line.Name, factory=factory.Description
```

**Expected Output:**

Assuming this finds a valid path, the output would be a single row with the names of the line and factory description as specified:

```
| line  | factory       |
|-------|---------------|
| Line1 | Main plant    |
```

### Example: Organizational Chart Paths Finding

This example uses an organizational chart to find all shortest paths from employees to their managers within a certain range:

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
| graph-shortest-paths output=all (employee)-[reports*1..5]->(manager)
  where employee.age < 30
  project employee = employee.name, manager = manager.name
```

**Expected Output:**

```
| employee | manager |
|----------|---------|
| Eve      | Alice   |
| Ben      | Alice   |
```
```
