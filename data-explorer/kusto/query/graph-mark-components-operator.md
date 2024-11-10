---
title: graph-mark-components operator (Preview)
description: Learn how to use the graph-mark-components operator to find and mark all connected components of a graph.
ms.reviewer: royo
ms.topic: reference
ms.date: 11/06/2024
---
# graph-mark-components operator (Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `graph-mark-components` operator finds all connected components of a graph and marks each node with a component identifier.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

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

### Find families by their relationships

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

### Find a greatest common ancestor for each family

The following example uses the connected component `family` identifier and the `graph-match` operator to identify the greatest ancestor of each family in a set of child-parent data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQy07DQAxF9%2FkKK6sEJZFYsAG1EpSXhBAfUFWVO%2BMmQ%2BYROQMliI9nkiYlqJqFx9fHvpY1eVhVSsu3PSxAog9vpykRvXbdela2zKBBJuvHNIVoDRFAfKuVoDiD%2BM7tQhi0FbLTvTYV%2F6v3%2BHkSn5jKM3IS5%2BCzOyDLM%2FRPnsMPwzd%2BZLT1pE1J%2FIpaO%2B7ibEa%2BKA61aHMD0XSI6AcM1pSXjE0Fwykgz5fjGeCgfLW1TtJWyYVFQ4Ef0Nwg17lwpnE2gO2RPOUBDzfeo1G6m7V4UUEiqRVkJVqf5mtx3OPisiiuNvkyQSuo9Y7TsHbD7p2Eh943TJtKRZ9noJUlLPvCOKMYYja6zhtOe7QfJuytvgmSkiwxeuVsmw0Oad%2FBpcGvBJmx22qypa%2BS0SfNjtCuGw1%2BAcTWyMtPAgAA" target="_blank">Run the query</a>
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
  project name = ancestor.name, lineage = childOf.child, family = ancestor.family
| summarize (generations, name) = argmax(array_length(lineage),name) by family
```

**Output**

|family|generations|name|
|---|---|---|
|1|2|Mallory|
|0|2|Bob|

## Related content

* [Best practices for Kusto Query Language (KQL) graph semantics](graph-best-practices.md)
* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)
* [graph-to-table operator](graph-to-table-operator.md)

