---
title: graph-mark-components operator (preview)
description: Learn how to use the graph-mark-components operator to find and mark all connected components of a graph.
ms.reviewer: royo
ms.topic: reference
ms.date: 05/25/2025
---
# graph-mark-components operator (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `graph-mark-components` operator finds all connected components of a graph and marks each node with a component identifier.

> [!NOTE]
> This operator is used with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-mark-components` [`kind` `=` *Kind*] [`with_component_id` `=` *ComponentId*]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *G* | string |  :heavy_check_mark: | The graph source. |
| *Kind* | string |  | The connected component kind, either `weak` (default) or `strong`. A weak component is a set of nodes connected by a path, ignoring the direction of edges. A strong component is a set of nodes connected in both directions, considering the edges' directions. |
| *ComponentId* | string |  | The property name that denotes the component identifier. The default property name is `ComponentId`. |

## Returns

The `graph-mark-components` operator returns a *graph* result, where each node has a component identifier in the *ComponentId* property. The identifier is a zero-based consecutive index of the components. Each component index is chosen arbitrarily and might not be consistent across runs.

## Examples

The following example creates a graph from a set of child-parent pairs and identifies connected components using a `family` identifier.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQ24rCMBCG7%2FMUQ65caF5AccGzILIPsCwyNrENzaFMw4qwD79pNLUiuUj%2Bb77JxW9UgFWtjfy6wBwkhnjORk3Knk27QNpVBbRIyoVH%2FAD2DQyAL4wuFS%2BAL%2F05XomtkLzpWR6%2B0jX%2BDnBHqnozMxyLe39Fkm%2FqE4%2FlTXryLaFrMsuBH9EYTzdejMyDpjhjPzNguQj2BxYbJSrCtoZUBQjx%2BagBrjrUJ%2BelOmk5d2hV9JMqLFIjSm9b76LY3c0hRz12fEGrzW1YCV6kxqH%2FsPsH1QoVAI8BAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let ChildOf = datatable(child:string, parent:string) 
[ 
  "Alice", "Bob",  
  "Carol", "Alice",  
  "Carol", "Dave",  
  "Greg", "Alice",  
  "Greg", "Dave",  
  "Howard", "Alice",  
  "Howard", "Dave",  
  "Eve", "Frank",  
  "Frank", "Mallory",
  "Eve", "Kirk",
]; 
ChildOf 
| make-graph child --> parent with_node_id=name
| graph-mark-components with_component_id = family
| graph-to-table nodes
```

**Output**

|name|family|
|---|---|
|Alice|0|
|Bob|0|
|Carol|0|
|Dave|0|
|Greg|0|
|Howard|0|
|Eve|1|
|Frank|1|
|Mallory|1|
|Kirk|1|

The following example uses the connected component `family` identifier and the `graph-match` operator to identify the greatest ancestor of each family in a set of child-parent data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQ207DMAyG7%2FsUVq9alE7ighvQJsE4SQjxANNUeanXhuVQuYFRxMOTnkbRlIvEvz%2F7d6zJw7pSunjbwxIK9OHsNCWy064bz8qWAmpksn4MU4g2EAHEt1pJigXEd24Xrl5bIzvdaVPyv3qPnyfxiak8IydxDj67I3Jxhv7Jc%2Fihf8aPjPYwaVMQv6LWjttYzMgXxSEXbW8gmhYR%2FYDBA2UlY11BvwrIstW4BjgqX%2BXWFZSrYmnRUOB7NDPIh0w6UzsbwGYgT3HAw473aJRuZyVeVpAU1EiyBVqfZhs5zHFxuVhcbbNVglZS4x2nYeya3TtJD51v6DalFl0sQCtLWHYJg3Uy9hHDF1Ixes%2FLTtM0HyZMr74JkpIsMXrlbCN6n7Sr4DI3%2BJUgM7a5Jlv6KhntUjFQu3Z0%2BAVmt0c2VgIAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let ChildOf = datatable(child:string, parent:string) 
[ 
  "Alice", "Bob",  
  "Carol", "Alice",  
  "Carol", "Dave",  
  "Greg", "Alice",  
  "Greg", "Dave",  
  "Howard", "Alice",  
  "Howard", "Dave",  
  "Eve", "Frank",  
  "Frank", "Mallory",
  "Eve", "Kirk",
]; 
ChildOf 
| make-graph child --> parent with_node_id=name
| graph-mark-components with_component_id = family
| graph-match (descendant)-[childOf*1..5]->(ancestor)
  project name = ancestor.name, lineage = map(childOf, child), family = ancestor.family
| summarize (generations, name) = arg_max(array_length(lineage),name) by family
```

**Output**

|family|generations|name|
|---|---|---|
|1|2|Mallory|
|0|2|Bob|

## Related content

* [Graph best practices](graph-best-practices.md)
* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)
* [graph-to-table operator](graph-to-table-operator.md)
