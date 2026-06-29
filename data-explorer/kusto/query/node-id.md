---
title:  node_id (graph function)
description:  This article describes the node_id() function.
ms.topic: reference
ms.date: 10/29/2025
---

# node_id() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `node_id` function calculates the graph node identifier as it was set by the user either in make-graph or graph model.

> [!NOTE]
> This function is used with the [`graph-match`](graph-match-operator.md) and [`graph-shortest-paths`](graph-shortest-paths-operator.md) operators.

> [!WARNING]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

## Syntax

`node_id([`*node*`])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *node* | `string` |  | The reference to a graph node variable in a graph pattern. <br>Don't pass any parameters when used inside [all()](all-graph-function.md), [any()](any-graph-function.md), and [map()](map-graph-function.md) graph functions, with [inner_nodes()](inner-nodes-graph-function.md).|

## Returns

Returns the node ID string representation of the input node or of all inner nodes, when used inside [all()](all-graph-function.md), [any()](any-graph-function.md), and [map()](map-graph-function.md) functions with [inner_nodes()](inner-nodes-graph-function.md).

## Example

The following example creates a graph to analyze a hierarchical structure of employees and their managers. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WQ22rDMAyG7%2F0UwlfxiAtJLwYdK2ylT1FKcRORuPMJx7QM9vBTDs5W%2B0aW9X%2B%2FJIMJ0AbjvxEHeIdWJbpXg4VTFndDitp1JagOd8a7TrAT4x9GN8hL2NYl45%2F%2BOoYVhcf7mK1fS3Z%2BY4bAEYOP6RmbzVa0VY7ocXlPBjMz%2BzB%2B6KMenjKz1Vw4ui1O7IdwXyi7qEK%2FzgVS7rMNPHTq%2F03sHYyDknDSSKtS08PapZCnBf1SbTbbs9wXC0gwoPPoMSI43%2BJFt38qGJIizeTFj3wqDdHfsEm5kYq2knUZuS6jpk%2BrQqGdw3gZy4Zi6YOKskyIX8puk%2By%2BAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let employees = datatable(name:string, age:long)
[
"Alice", 32,
"Bob", 31,
"Eve", 27,
];
let reports = datatable(employee:string, manager:string)
[
"Bob", "Alice",
"Chris", "Alice",
"Eve", "Bob",
];
reports
| make-graph employee --> manager with employees on name
| graph-match (employee)-[reports*1..3]->(manager)
    where node_id(employee) startswith "E"
    project manager1 = node_id(manager), manager2 = map(inner_nodes(reports), node_id())
```

**Output**

| manager_1 | manager_2 |
|--|--|
| Bob | [] |
| Alice | ["Bob"]


## Related content

* [Graph overview](graph-semantics-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node-degree-out.md)
* [any()](any-graph-function.md)
* [map()](map-graph-function.md)
