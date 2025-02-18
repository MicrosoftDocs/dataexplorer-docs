---
title:  node_degree_out (graph function)
description:  This article describes the node_degree_out() command.
ms.topic: reference
ms.date: 02/18/2025
---

# node_degree_out() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_out` function calculates the *out-degree*, or number of outgoing edges, from  a node in a directed graph.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) and [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

## Syntax

`node_degree_out(`*node*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
|*node*|`string`| :heavy_check_mark: |The reference to a graph node variable in a graph pattern.|

## Returns

Returns the out-degree of the input node.

## Example

The examples in this section show how to use the syntax to help you get started.

### Find paths between locations and transportation modes

The following example uses the `Locations` and `Routes` data tables to construct a graph that finds paths from a source location to a destination location through a `route`. It returns the source location name, destination location name, transportation method, and the `node_degree_out`, which is the number of outgoing edges from the source node (location).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32TUWuDMBSF3%2F0VF58UtL5vrDBaBoOug60wRikljZeYVRNJrpTCfvyinW203Xw8J%2FfE83nNMlhozkhqZYHYrkSIlM7RxkGJ5HkPkDNi3YmoV5eswjuwZKQSyfns6lif1RjWAbgnXOIBPrXZhwmEM0nHMDnp70zBk2GKS8v12JwVkjNxJS%2B0hUclsER7FYeMqMRW%2FmAGC91YDIPNfZBl8KYbwnNJzEVf8tfwG74aKaTqGz3PLy3naEmqTr5lr1wXW2tDLw7ivxSumq9Mw%2Fd9kQGvCwYXL9Wf7EZgBoFeiAdpkDca919hEOXN3yjRBrbET1SDb6jYHlNhWF3AGCuk6fQ2UThIKrz10wr8rXOxXWJaMeIFRNbwOF2b9spNOo3c%2FlIc1EZ%2FISdw5sQfTqD1R1I3Oxl8vgTaP2GbozCIW%2Bd31%2FwACegTXTIDAAA%3D" target="_blank">Run the query</a>
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
| graph-match (src)-[route]->(dest)
project src.LocationName, dest.LocationName, route.TransportMode, node_degree_out(src)
```

**Output**

| src_LocationName | dest_LocationName | route_TransportMode | node_degree_out |
|--|--|--|--|
| New York | San Francisco | Truck | 2 |
| New York | Chicago | Train | 2 |
| San Francisco | Los Angeles | Truck | 1 |
| Chicago | Seattle | Train | 1 |
| Los Angeles | New York | Truck | 1 |
| Seattle | San Francisco | Train | 1 |

## Find employee with no managers

The following example creates a graph to represent the hierarchical relationships between employees and their managers. It uses the `graph-match` operator to find instances where a manager node has an incoming edge from an employee node. Then, it uses the `node_degree_out` function to identify managers who don't report to any manager.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12QzU7DMBCE734KK6dGShC0IEQhSBRx6ZFrVUVusooN%2FokcQ0Hi4fEmthOQL7P2zO7nleAoqF6ab4CBVrRlzp%2BThJVmCraDs0J3BWUdbKXRXU4OJHuSooGsoJt1QbKdOaG88vLlE2%2FXt17uzSjvvHzmVgy%2BuL4pMApfaEe9A42ejZevouHMtviCkb1QGPDtj%2FdEekILvbHuL1%2BkToyKaY9pQz2STnAReGaZbybmyRiRoi1%2BY3bPnDERdzEyI25AJT%2Be5x3KzrKepw3TsnyMnPQsHF%2Fs3miKK%2FfBMVMq5hpOV8GdP5SH0PpYpr%2Fn5MzBAtWmhbqFzgLU5sOlEK0qekl6a96gcXHwBY4p0uRQhrTQtaqW7YRO3ZLJj%2FjnWg79BbnOHEdTAgAA" target="_blank">Run the query</a>
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
* [node-degree-in](node_degree_in.md)
