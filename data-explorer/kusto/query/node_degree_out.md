---
title:  node_degree_out
description:  This article describes the node_degree_out() command.
ms.topic: reference
ms.date: 02/16/2025
---

# node_degree_out()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_degree_out` function calculates the *out-degree*, or number of outgoing edges, from  a node in a directed graph.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) or [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

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

The following example creates a graph to represent the hierarchical relationships between employees and their managers. It uses the `graph-match` operator to find instances where a manager node has an incoming edge from an employee node. Then, it uses the `node_degree_out` function to identify managers who report to exactly one manager.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
<a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12RQUvEMBCF7%2FkVoactNMLuKuJqBVe8ePS6LCXbDk00TUoaXQV%2FvJM2SbuSy5v0vZmvEwWOQtcr8wMw0JI23OE5KVhp3sFucFbqtqC8hZ0yus3JgWRPStaQFXS7KUi2Nycv1yhfvvzt5hblqxnlHcpnYeWAxfVN4aPw7e1e70F7zxblm6wFt43%2FgpHjPVGIZaE31l1CRdQE1nGNbDbUI95EFClngPlmAp2MkSPaIvvsnuHGhMcLaOQX538Aay3vRVojZewxctGzdGKxYKOp3ysGxwzruKsFXQV3%2FsAOofWRpX%2FNyVmABapNA1UDrQWozKdLIVqWdE16a96hnh%2Fzys9J%2BwlVSEtddeWyndSpWzLhiH%2Bu5dA%2FyE4T3zgCAAA%3D" target="_blank">Run the query</a>
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
project employee.name, manager.name, degree_in_m=node_degree_in(manager), degree_out_m=node_degree_out(manager)
```

**Output**

| employee_name | manager_name | degree_in_m | degree_out_m |
|--|--|--|--|
| Eve | Bob | 2 | 1 |
| Richard | Bob | 2 | 1 |
| Ben | Chris | 1 | 1 |

## Related content

* [Graph overview](graph-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-in](node_degree_in.md)
