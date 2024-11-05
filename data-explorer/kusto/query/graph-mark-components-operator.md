---
title: graph-mark-components operator (Preview)
description: Learn how to use the graph-mark-components operator to find and mark all connected components of a graph.
ms.reviewer: royo
ms.topic: reference
ms.date: 02/18/2024
---
# graph-mark-components operator (Preview)

> [!WARNING]
> This feature is currently in preview and is subject to change. The semantics and syntax of this operator might change before it will be released as generally available.

The `graph-mark-components` operator finds all connected components of a graph and marks each node with a component identifier.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

## Syntax

*G* `|` `graph-mark-components` [`kind` `=` *Kind*] [`with_component_id` `=` *ComponentId*]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *G* | string |  :heavy_check_mark: | The input graph source. |
| *Kind* | string |  | The connected component kind: either `weak` (default) or `strong`. A weak comoponent is a set of nodes that are connected to each other by some path, ignoring the direction of edges. A strong component is a set of nodes that are connected to each other in both directions, while considering the edges' directions. |
| *ComponentId* | string |  | A name for the property that denotes the component identifier, if not provided the default property name is `ComponentId`. |

## Returns

The `graph-mark-components` operator returns a *graph* result, where the component identifier of each node is added in the *ComponentId* property. The identifier is zero-based consecutive index of the components, each component index is chosen arbitrarily and is not guaranteed to be consistent across runs.

## Examples

### Finding families by their relationships

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

### Finding a greatest ancesstor for each family

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

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)
* [graph-to-table operator](graph-to-table-operator.md)
