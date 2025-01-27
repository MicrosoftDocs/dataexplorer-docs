---
title:  node_degree_out
description:  This article describes the node_degree_out() command.
ms.topic: reference
ms.date: 01/27/2025
---

# node_degree_out()

The node_degree_out function is used to compute the out-degree of nodes in a directed graph. The out-degree of a node is the number of outgoing edges from that node. This function is useful in graph analytics for understanding the connectivity and influence of nodes within a network.

## Syntax

`node_degree_out(node)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
|*node*|`string`|:heavy_check_mark:|Reference to a graph node.

## Returns

* Returns the out-degree of the input node.

> [!IMPORTANT]
> This function can only be used in the context of graph-match operator.

## Example

The following example shows how to create a graph to represent the relationships between employees and their managers and compute the out-degree for each node to find managers with exactly one report.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQQU%2FDIBiG7%2FyKLz2tCZhs0xjnauKMF49el2Vh7ZfCpNBQdJr444W20DljenmB9%2BF7ikIH2LTKfCF2UEDFnf8OCmeaN7jqnJW6psBrXCmj65xsSfaoZIkZheWCkmxjDiHOfXz%2BCLuLWx9fTB%2FvfHwSVnZ%2BcX1DA4qfoR7yBnXoLH18laXgtgonHtndE%2BW1LLbGut9SUTWJNVx7Nzuue73BKFpOAtPOIDoUo0esRfepPcn1RNAb1ci3n%2F%2BGrLa8FekZgbGH6AUn6cTZAxsN4V092DOs4a4UMBvb%2BZptx6t3LP1rTk4CLYI2Fe4rrC3i3ry7BEFRwJy01hyxdHHwVRhDzxGpE0H%2FveuSSA5%2FkXT0A7lPLqdDAgAA" target="_blank">Run the query</a>
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
where node_degree_out(manager) == 1
project manager.name,node_degree_in(manager), node_degree_out(manager),node_degree_in(employee), node_degree_out(employee) 
```

|manager_name|node_degree_in|node_degree_out|node_degree_in1|node_degree_out1|
|---|---|---|---|---|
|Bob|2|1|0|1|
|Bob|2|1|0|1|
|Chris|1|1|0|1|

## Related content

* [graph-overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-in](node_degree_in.md)
