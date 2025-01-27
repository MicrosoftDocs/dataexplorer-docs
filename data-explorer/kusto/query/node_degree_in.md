---
title:  node_degree_in
description:  This article describes the node_degree_in() command.
ms.topic: reference
ms.date: 01/27/2025
---

# node_degree_in()

The node_degree_in function is used to compute the in-degree of nodes in a directed graph. The in-degree of a node is the number of incoming edges to that node. This function is useful in graph analytics for understanding the connectivity and importance of nodes within a network.

## Syntax

`node_degree_out(node)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *node* | `string` |  :heavy_check_mark: | Reference to a graph node.

## Returns

* Returns the in-degree of the input node.

> [!IMPORTANT]
> This function can only be used in the context of graph-match operator.

## Example

The following example shows how to create a graph to represent the relationships between employees and their managers and compute the in-degree for each node to find employees with exactly two direct reports.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQUUvDMBSF3%2FMrLn1aIRHsFHFawYkvPvo6xsjaS5MtTUoanYI%2F3qRtGqdIX05yz8n5ehU6wLZT5hOxhxJq7vy3V7jQvMVV76zUDQXe4EoZ3eRkQ7JHJSvMKCwLSrK12Qd56eXze7gtbrx8MYO89fJJWNn7w9U1DVH8CPag16iDZ%2Bnlq6wEt3WY%2BMj2jiiPZbEz1p1DRdQZrOXas9npPOCNRJEyAaSbEXQ0Ro5oi%2BzJneCGRMCb0MiX7z8iayzvxLxGYOwhcsFJOvFjwUZD2KsPDhnWclcJWEzu%2FJ5tpqe3bP7XnJwEWgRtatzV2FjEndRpDGUJBemsOWDlYvFFqKG%2FIrGGnr1l3lya%2FFfyNzKPvgEBXARFQwIAAA%3D%3D" target="_blank">Run the query</a>
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
| graph-match (manager)<-[reports]-(employee)
where node_degree_in(employee) == 2
project manager.name,node_degree_in(manager), node_degree_out(manager),node_degree_in(employee), node_degree_out(employee) 
```

|manager_name|node_degree_in|node_degree_out|node_degree_in1|node_degree_out1|
|---|---|---|---|---|
|Alice|3|0|2|1|

## Related content

* [graph-overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node_degree_out.md)
