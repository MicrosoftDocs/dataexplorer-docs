---
title: graph-shortest-paths Operator (preview)
description: Learn how to use the graph-shortest-paths operator to efficiently find the shortest paths from a given set of source nodes to a set of target nodes within a graph
ms.reviewer: royo
ms.topic: reference
ms.date: 02/17/2025
---

# graph-shortest-paths Operator (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `graph-shortest-paths` operator finds the shortest paths between a set of source nodes and a set of target nodes in a graph and returns a table with the results.

> [!NOTE]
> This operator is used with the [make-graph operator](make-graph-operator.md).

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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3VSPW%2BDMBDd%2BRUnJqgwUocurchSde3SoUMUISd2g1Owke0oS398zwaic6Fisd%2FHvTN3vfRwMlrLk1dGO2hAcI%2FfsZfFlzVD6%2FCGzLPzVulzBd6soF5pOV9KyPaQAeSvUnvL%2B7yC%2FN1Y34WDlSKvAnlHiCqSf60f5hqFlF4wotuk44F9SufT8il%2Bl%2F8nWBdIrBsBpP83PpHH%2FipndoGIirAEXQpPLA1eWbPDC2R0itkPDPxbsrPlYwd0jsDYjswQbsp3rTZCtko0M4juaGSuw0FhKBu57xwUyFtfsj2Jenis66cD2xUCdUpHf4nN3jppJURDvWQ1TfLTgGsBxJbophXBQqM1F8yKj8DtTCpWEBpDdOBjQZqiW1pO%2B7klCngZtGHr1338ApCGusgbAwAA" target="_blank">Run the query</a>
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
  project from = start.station, path = map(connections, to_station), line = map(connections, line), to = destination.station
```

**Output**

|from|path|line|to|
|---|---|---|---|
|South-West|[<br>  "South",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "red",<br>  "red"<br>]|North|

### Find all shortest paths between two train stations

The following example, like the previous example, finds the shortest paths in a transportation network. However, it uses `output=all`, so returns all shortest paths.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3VTvW6DMBDeeYoTE1QYqUOXVmSpunbp0CGKkBOuwamxkW2UpQ%2Ffw0B0lFQs5vu7M3doDHCyxuApKGs8VNDIQM9RY%2FblbFd7eiPm2QenzLmAYDeQVgbnlxySPSQA6Sua4KROC0jfrQvteHDYpMVI3hCmiuRf64cdopDTC8Z0d%2Bl4EJ%2Fowzp%2Bjd%2Fk%2Fwm2ASvrnQKs%2Fzc5kUc94MwuEFMxlqFL8MTywhtrcniBhE8x%2BYFOfqM4O9m3wOcIQuzYDOGqQlsb22CtmmoGyR2Nwrc0KCoqehlaD3TffgiV1BoykrqQiz2r%2BvBYlk8HscsasigTo3Lq%2B9qiQ4iGcilbVavvB9I0wGwr3bQtFNQ7e6Fa8T60qKvEAsYeCe1kn7Gm%2BMLm06reE414PmrHH2Dbxy%2FzY0GpJgMAAA%3D%3D" target="_blank">Run the query</a>
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
  project from = start.station, path = map(connections, to_station), line = map(connections, line), to = destination.station
```

**Output**

|from|path|line|to|
|---|---|---|---|
|South-West|[<br>  "South",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "red",<br>  "red"<br>]|North|
|South-West|[<br>  "West",<br>  "Central",<br>  "North"<br>]|[<br>  "red",<br>  "blue",<br>  "red"<br>]|North|

## Related content

* [Best practices for graph semantics](graph-best-practices.md)
* [Graph operator](graph-function.md)
* [make-graph operator](../query/make-graph-operator.md)
