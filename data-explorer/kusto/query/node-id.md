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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQUQuCMBSF3%2FcrLj4pzIfsITAKSvoVETH14lZzkzmSoB%2Ff5lSMtqdzds%2F52JVoAdtO6jdiDweomXW3lBgr1mLeWyNUQ4E1mEutmoRcCbgTnaSoMKKwzWgwzrr0cjPJy8u%2FZjtKbnsiHcRgp439RczgBdMy5Uhm0gssdM%2FM4BXciP7PDdgQ8OSJSj6u%2BolpY1jHl%2F9Cmh5nJAzC8tUmtAK%2FABccM2nLbMUhVsnIGTgaBKVrvIvamdBb5jBjR1RE40xn9AMru5r6Aupkq31sAQAA" target="_blank">Run the query</a>
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
| graph-match (n)
    where node_id(n) startswith "C"
    project node_id(n)
```

**Output**

| node_id_n |
|--|
| Chris |

## Related content

* [Graph overview](graph-semantics-overview.md)
* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [node-degree-out](node-degree-out.md)
* [any()](any-graph-function.md)
* [map()](map-graph-function.md)
