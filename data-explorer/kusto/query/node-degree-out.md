---
title:  node_degree_out (graph function)
description:  This article describes the node_degree_out() command.
ms.topic: reference
ms.date: 02/24/2025
---

# node_degree_out() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_out` function calculates the *out-degree*, or number of outgoing edges, from  a node in a directed graph.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) and [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

## Syntax

`node_degree_out([`*node*`])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
|*node*|`string`| :heavy_check_mark: |The reference to a graph node variable in a graph pattern. <br> No parameters should be passed when used inside [all()](all-graph-function.md), [any()](any-graph-function.md) and [map()](map-graph-function.md) graph functions, in conjunction with [inner_nodes()](inner-nodes-graph-function.md). |

## Returns

Returns the out-degree of the input node or of all inner nodes, when used inside [all()](all-graph-function.md), [any()](any-graph-function.md) and [map()](map-graph-function.md) functions in conjunction with [inner_nodes()](inner-nodes-graph-function.md).

## Examples

The examples in this section show how to use the syntax to help you get started.

### Find paths between locations and transportation modes

The following example uses the `Locations` and `Routes` data tables to construct a graph that finds paths from a source location to a destination location through a `route`. It returns the source location name, destination location name, transportation methods along the route, the `node_degree_out`, which is the number of outgoing edges from the source node (location), and the `route_nodes_degree_out`, which are the number of outgoing edges from the inner nodes (stopover locations) along the route.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32TUWuDMBSF3%2F0VF590aGV73FhhtAwGXQdbYYxSShYvmlUTSVJKYT9%2BiVYbtV0e77n3S87xmiSwEJRoJrgCTb4LhICLFFXoFagd7RFSokndEbTVJSnxHpSWjGdR17s6Vl01hLUH5vhLPMCXkDs%2FAn%2FG9NGPmvoH4fAsCadMUTEUZzmjJBuVF0LBE8%2BwQDXCIdG6QFv%2BJBJzsVfoe5sHL0ngXew1diYxzVqTJ8F1%2BCZZxnjr6GV%2BdjlHpRmvy5fklfGiKiH1qwnx3xRGzldyT3etkV5e5xgMnvGr2Q2C6QEdiBNSjzcYd5%2FQQznzF0xYoE28SdX7hZLsMM4kqXIYxgpxPL2cKByYzp31ExzcrTPYmhiXRNMcAiVpGK%2BlvfLmdjK528TTwCyxDr1Kih%2BkGkzHxCVEUJuxxzZe0%2By%2FsE0xk4hbQ68vijq1vnDb%2B%2BZ2j0pSBbU02IfRZP2nOfjTLOMcZSM2nDAaPSQM%2FwCR5KUquwMAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Locations table (nodes)
let Locations = datatable(LocationName: string, LocationType: string) [
    "New York", "City",
    "San Francisco", "City",
    "Chicago", "City",
    "Los Angeles", "City",
    "Seattle", "Warehouse"
];
// Routes table (edges)
let Routes = datatable(OriginLocationID: string, DestinationLocationID: string, TransportMode: string) [
    "New York", "San Francisco", "Truck",
    "New York", "Chicago", "Train",
    "San Francisco", "Los Angeles", "Truck",
    "Chicago", "Seattle", "Train",
    "Los Angeles", "New York", "Truck",
    "Seattle", "San Francisco", "Train"
];
Routes
| make-graph OriginLocationID --> DestinationLocationID with Locations on LocationName
| graph-match (src)-[route*1..2]->(dest)
project src.LocationName, 
        dest.LocationName, 
        node_degree_out(src),
        route_TransportModes = map(route, TransportMode),
        route_nodes_degree_out = map(inner_nodes(route), node_degree_out())
```

**Output**

| src_LocationName | dest_LocationName | node_degree_out | route_TransportModes | route_nodes_degree_out |
|--|--|--|--|--|
| Chicago | Seattle | 1 | ["Train"] | [] |
| New York | Chicago | 2 | ["Train"] | [] |
| Los Angeles | New York | 1 | ["Truck"] | [] |
| San Francisco | Los Angeles | 1 | ["Truck"] | [] |
| Seattle | San Francisco | 1 |  ["Train"] | [] |
| New York | San Francisco | 2 |  ["Truck"] | [] |
| Chicago | San Francisco | 1 | ["Train","Train"] | [1] |
| New York | Seattle | 2 | ["Train","Train"] | [1] |
| New York | Los Angeles | 2 | ["Truck","Truck"] | [1] |
| San Francisco | New York | 1 | ["Truck","Truck"] | [1] |
| Seattle | Los Angeles | 1 | ["Train","Truck"] | [1] |
| Los Angeles | San Francisco | 1|  ["Truck","Truck"] | [2] |
| Los Angeles | Chicago | 1 | ["Truck","Train"] | [2] |

## Find employee with no managers

The following example creates a graph to represent the hierarchical relationships between employees and their managers. It uses the `graph-match` operator to find employees who report to a top-level manager who doesn't report to anyone else. It uses the `node_degree_out` function to identify the managers who don't report to any other manager.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12QzU7DMBCE734KK6dGShC0IEQhSBRx6ZFrVUVusooN%2FokcQ0Hi4fEmthOQL7P2zO7nleAoqF6ab4CBVrRlzp%2BThJVmCraDs0J3BWUdbKXRXU4OJHuSooGsoJt1QbKdOaG88vLlE2%2FXt17uzSjvvHzmVgy%2BuL4pMApfaEe9A42ejZevouHMtviCkb1QGPDtj%2FdEekILvbHuL1%2BkToyKaY9pQz2STnAReGaZbybmyRiRoi1%2BY3bPnDERdzEyI25AJT%2Be5x3KzrKepw3TsnyMnPQsHF%2Fs3miKK%2FfBMVMq5hpOV8GdP5SH0PpYpr%2Fn5MzBAtWmhbqFzgLU5sOlEK0qekl6a96gcXHwBY4p0uRQhrTQtaqW7YRO3ZLJj%2FjnWg79BbnOHEdTAgAA" target="_blank">Run the query</a>
::: moniker-end

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
"Jim", 42,
];
let reports = datatable(employee:string, manager:string)
[
"Bob", "Alice",
"Chris", "Alice",
"Eve", "Bob",
"Ben", "Chris",
"Joe", "Alice",
"Richard", "Bob",
"Alice", "Jim"
];
reports
| make-graph employee --> manager with employees on name
| graph-match (manager)<-[reports]-(employee)
where node_degree_out(manager) == 0
project manager.name, employee.name, di_m=node_degree_in(manager), do_m=node_degree_out(manager), di_e=node_degree_in(employee), do_e=node_degree_out(employee)
```

**Output**

| manager_name | employee_name | degree_in_m | degree_out_m |
|--|--|--|--|
| Jim | Alice | 1 | 0 |

## Related content

* [Graph overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-in](node-degree-in.md)
* [map()](map-graph-function.md)
