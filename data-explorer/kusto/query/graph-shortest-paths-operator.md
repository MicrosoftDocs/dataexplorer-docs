---
title: graph-shortest-paths Operator (Preview)
description: Learn how to use the graph-shortest-paths operator to efficiently find the shortest paths from a given set of source nodes to a set of target nodes within a graph
ms.reviewer: royo
ms.topic: reference
ms.date: 11/05/2024
---

# graph-shortest-paths Operator (Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `graph-shortest-paths` operator finds the shortest paths between a set of source nodes and a set of target nodes in a graph and returns a table with the results.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-shortest-paths` [`output` `=` *OutputOption*] *Pattern* `where` *Predicate* `project` [*ColumnName* `=`] *Expression* [`,` ...]

## Parameters

| Name | Type | Required |Description |
|---------------|-------------|----------|-----------------------------|
| *G* | string | :heavy_check_mark: | The graph source, typically the output from a `make-graph` operation.                                                 |
| *Pattern* | string | :heavy_check_mark: | A [path pattern](#path-pattern-notation) that describes the path to find. Patterns must include at least one variable length edge and can't contain multiple sequences. |
| *Predicate* | expression | | A boolean expression that consists of properties of named variables in the pattern and constants. |
| *Expression* | expression | :heavy_check_mark: | A scalar expression that defines the output row for each found path, using constants and references to properties of named variables in the pattern. |
| *OutputOption*| string | | Specifies the search output as `any` (default) or `all`. Output is specified as `any` for a single shortest path per source/target pair and `all` for all shortest paths of equal minimum length. |

### Path pattern notation

The following table shows the supported path pattern notations.

| Element                  | Named variable | Anonymous element |
|--------------------------|----------------|-----------|
| Node                     | `(`*n*`)`      | `()`      |
| Directed edge from left to right | `-[`*e*`]->` | `-->`     |
| Directed edge from right to left | `<-[`*e*`]-` | `<--`     |
| Any direction edge       | `-[`*e*`]-`    | `--`      |
| Variable length edge     | `-[`*e*`*3..5]-` | `-[*3..5]-` |

#### Variable length edge

A variable length edge allows a specific pattern to repeat multiple times within defined limits. An asterisk (`*`) denotes this type of edge, followed by the minimum and maximum occurrence values in the format *min*`..`*max*. These values must be integer scalars. Any sequence of edges within this range can match the variable edge of the pattern, provided all the edges in the sequence meet the `where` clause constraints.

## Returns

The `graph-shortest-paths` operator returns a tabular result, where each record corresponds to a path found in the graph. The returned columns are defined in the operator's `project` clause using properties of nodes and edges defined in the pattern. Properties and functions of properties of variable length edges, are returned as a dynamic array. Each value in the array corresponds to an occurrence of the variable length edge.

## Examples

This section provides practical examples demonstrating how to use the `graph-shortest-paths` operator in different scenarios.

### Find `any` shortest path between two train stations

The following example demonstrates how to use the `graph-shortest-paths` operator to find the shortest path between two stations in a transportation network. The query constructs a graph from the data in `connections` and finds the shortest path from the `"South-West"` to the `"North"` station, considering paths up to five connections long. Since the default output is `any`, it finds any shortest path.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3VSPW%2FDIBDd%2FStOnuzKWOrQpZWzVF27dOgQRRYJNJA6YAFRlv74HjhOjziVF3gf9w7fDTLAzhojd0Fb46EDwQN%2B20FWX84ee483ZJ59cNrsGwh2AQ3ayMulhmINBUD5Kk1wfCgbKN%2BtCyoenBRlE8krQlSJvLV%2B2FMSUnrGiO4unQ7sU%2FqQl8%2Fxq%2Fw%2FwbJAZr0TQPp%2F4xO5HU7yws4QURGWoHPhiaXBC2uxeYGCTrH4gSP%2Flmzv%2BKiAzhEYW5EZwlkH1RsrZK9FdwHRnYzMKxwUhrKRB%2BWhQt6Fmq1J1MNj2z5t2KoSqNMm%2BWts9qykk5AM7ZzVddlPA24EEFumm1YEC43OHjArPQK3M6vYQGwMUdJQ%2B%2Fe4aTNv6AjFLY6bvsz%2BBe1b5s0PAwAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let connections = datatable(from_station:string, to_station:string, line:string) 
[ 
  "Central", "North", "red",
  "North", "Central", "red", 
  "Central", "South",  "red", 
  "South", "Central",  "red", 
  "South", "South-West", "red", 
  "South-West", "South", "red", 
  "South-West", "West", "red", 
  "West", "South-West", "red", 
  "Central", "East", "blue", 
  "East", "Central", "blue", 
  "Central", "West", "blue",
  "West", "Central", "blue",
]; 
connections 
| make-graph from_station --> to_station with_node_id=station
| graph-shortest-paths (start)-[connections*1..5]->(destination)
  where start.station == "South-West" and destination.station == "North"
  project from = start.station, path = connections.to_station, line = connections.line, to = destination.station
```

**Output**

|from|path|line|to|
|---|---|---|---|
|South-West|[<br>  "South",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "red",<br>  "red"<br>]|North|

### Finding all shortest paths between two train stations

The following example, like the previous example, finds the shortest paths in a transportation network. However, it uses `output=all`, so returns all shortest paths.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3VSPW%2BDMBDd%2BRUnJqgwUocurchSde3SoUMUISdcY1LHRsYoS398zwbSI6Risd%2FHvTN3Gj0crDF48K01PVTQSE%2FfXmP25ey57ulGzHPvXWuOBXi7gnRrcLrkkGwhAUhf0XgndVpA%2Bm6dV%2BHgsEmLQF4RporkrfXDDlHI6Rljurt0PIhP7P2y%2FBK%2Fyv8TrAssrHcCWP9vciT3esCJnSGmYixD58Ijy4NX1mT3AgmfYvIDZ%2FmN4uhkp4DPEYTYsBnCpfWqNrbBum2qCSR3NIpe0aAoVHTSqx7ovd3gK6k1ZCR1PhdblvrwWJZPO7HJGrK0JpbKqe%2BLQocQDeUcW1WL%2FwfSNMBsC924LVSoc%2FZEWfE9tKiLigWEHgllDZV%2F7xyX9IYOUFjosPTr7F%2FiorS0GgMAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let connections = datatable(from_station:string, to_station:string, line:string) 
[ 
  "Central", "North", "red",
  "North", "Central", "red", 
  "Central", "South",  "red", 
  "South", "Central",  "red", 
  "South", "South-West", "red", 
  "South-West", "South", "red", 
  "South-West", "West", "red", 
  "West", "South-West", "red", 
  "Central", "East", "blue", 
  "East", "Central", "blue", 
  "Central", "West", "blue",
  "West", "Central", "blue",
]; 
connections 
| make-graph from_station --> to_station with_node_id=station
| graph-shortest-paths output=all (start)-[connections*1..5]->(destination)
  where start.station == "South-West" and destination.station == "North"
  project from = start.station, path = connections.to_station, line = connections.line, to = destination.station
```

**Output**

|from|path|line|to|
|---|---|---|---|
|South-West|[<br>  "South",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "red",<br>  "red"<br>]|North|
|South-West|[<br>  "West",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "blue",<br>  "red"<br>]|North|

## Related content

* [Best practices for Kusto Query Language (KQL) graph semantics](graph-best-practices.md)
* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)

