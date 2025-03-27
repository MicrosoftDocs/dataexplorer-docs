---
title:  node_degree_in (graph function)
description:  This article describes the node_degree_in() command.
ms.topic: reference
ms.date: 02/24/2025
---

# node_degree_in() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_in` function calculates the *in-degree*, or number of incoming edges, to a node in a directed graph.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) and [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

## Syntax

`node_degree_in([`*node*`])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *node* | `string` |  | The reference to a graph node variable in a graph pattern. <br>Do not pass any parameters when used inside [all()](all-graph-function.md), [any()](any-graph-function.md), and [map()](map-graph-function.md) graph functions, in conjunction with [inner_nodes()](inner-nodes-graph-function.md).|

## Returns

Returns the in-degree of the input node or of all inner nodes, when used inside [all()](all-graph-function.md), [any()](any-graph-function.md), and [map()](map-graph-function.md) functions in conjunction with [inner_nodes()](inner-nodes-graph-function.md).

## Example

The following example creates a graph to analyze a hierarchical structure of employees and their managers. 

The graph-match operator looks for managers who have exactly 3 direct reports (node_degree_in(manager) == 3) and where any of the inner nodes (employees) have at least one report (node_degree_in() > 1).

The query returns the manager, the name of each direct report, the in-degree to the manager, and the number of direct reports for each employee.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WRX2uDMBTF3%2F0UF590aKF1Y6ybhXX0ZY97LUVSvahbTCRm6wr78LvRRPuHJggnyTk3P284asCm5fKI2EEKBdM09xwDwRpcdlrVooyAlbjkUpSht%2FX8V17n6EeQLCLPX8u9kXOSmx%2Bzu3gk%2BS57%2BUTyrVJ1R4v7h8hE8dfYjV6jMJ6E5EedV0wV5sRENpz3Z0ni7Z49TogKW6n0OaDDHiEbJohT2XWPOtA54glm2hmgB6Njcjb3H5N7AnUJx9oXMrgW1fsjni%2BMS8XaamwxxPHKccKh1tVJ86UA03MK9pm4YTqvILDu8CXe2tJ389ks2cVjA0IPaBwqVAhCFpgVWCrErBZjGNIUEmCioO8Y1EKgyoy1C2zNMLqMhrCC%2BVC6VfITc%2B3AZwYzGsntsne6YatmdGN2cttUnl6yYe0NEnrAnOlgqOtDxTrwr%2FnMkc34YRid3T%2Fasia90ZILYmuQ3zrDswjtTJ3%2BBxQIrhUvAwAA" target="_blank">Run the query</a>
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
| graph-match (manager)<-[reports*1..3]-(employee)
    where node_degree_in(manager) == 3 and any(inner_nodes(reports), node_degree_in() > 1)
    project manager.name, employee.name, 
            reports_and_inner_nodes_degree_in = map(inner_nodes(reports), strcat(name, " has ", node_degree_in(), " reports")),
            degree_in_m=node_degree_in(manager), 
            degree_out_e=node_degree_out(employee) 
```

**Output**

| manager_name | employee_name | reports_and_inner_nodes_degree_in | degree_in_m | degree_out_e |
|--|--|--|--|--|
| Alice | Richard | ["Bob has 2 reports"] | 3 | 1 |
| Alice | Eve | ["Bob has 2 reports"] | 3 | 1 |
| Alice | Ellen | [<br>"Bob has 2 reports", <br>"Eve has 1 reports"<br>] | 3 | 1 |

## Related content

* [Graph overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node-degree-out.md)
* [any()](any-graph-function.md)
* [map()](map-graph-function.md)
