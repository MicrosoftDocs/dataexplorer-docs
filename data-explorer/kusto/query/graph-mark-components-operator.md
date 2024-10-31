---
title: graph-mark-components operator (Preview)
description: Learn how to use the graph-mark-components operator to find and mark all connected components of a graph.
ms.reviewer: royo
ms.topic: reference
ms.date: 02/18/2024
---
# graph-mark-components operator (Preview)

> [!WARNING]
> This feature is currently in preview and might be subject to change. The semantics and syntax of the graph feature might change before they are released as generally available.

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

The `graph-mark-componenets` operator returns a *graph* result, where the component identifier of each node is added in the *ComponentId* property. The identifier is zero-based consecutive index of the components, each component index is chosen arbitrarily and is not guaranteed to be consistent across runs.

## Examples

### Finding families by their relationships

```kusto
let Characters = datatable(name:string) 
[ 
  "Homer",
  "Mona",
  "Marge", 
  "Lisa", 
  "Bart", 
  "Maggie",
  "Kirk", 
  "Luann", 
  "Milhouse", 
  "Nana Sophie",
]; 
let ChildOf = datatable(child:string, parent:string) 
[ 
  "Homer", "Mona",  
  "Bart", "Homer",  
  "Bart", "Marge",  
  "Lisa", "Homer",  
  "Lisa", "Marge",  
  "Maggie", "Homer",  
  "Maggie", "Marge",  
  "Milhouse", "Luann",  
  "Luann", "Nana Sophie",
  "Milhouse", "Kirk",
]; 
ChildOf 
| make-graph child --> parent with Characters on name 
| graph-mark-components with_component_id = family
| graph-to-table nodes
```

**Output**

|name|family|
|---|---|
|Homer|0|
|Mona|0|
|Marge|0|
|Lisa|0|
|Bart|0|
|Maggie|0|
|Kirk|1|
|Luann|1|
|Milhouse|1|
|Nana Sophie|1|

### Finding a greatest ancesstor for each family

```kusto
let Characters = datatable(name:string) 
[ 
  "Homer",
  "Mona",
  "Marge", 
  "Lisa", 
  "Bart", 
  "Maggie",
  "Kirk", 
  "Luann", 
  "Milhouse", 
  "Nana Sophie",
]; 
let ChildOf = datatable(child:string, parent:string) 
[ 
  "Homer", "Mona",  
  "Bart", "Homer",  
  "Bart", "Marge",  
  "Lisa", "Homer",  
  "Lisa", "Marge",  
  "Maggie", "Homer",  
  "Maggie", "Marge",  
  "Milhouse", "Luann",  
  "Luann", "Nana Sophie",
  "Milhouse", "Kirk",
]; 
ChildOf 
| make-graph child --> parent with Characters on name 
| graph-mark-components with_component_id = family
| graph-match (descendant)-[childOf*1..5]->(ancestor)
  project name = ancestor.name, lineage = childOf.child, family = ancestor.family
| summarize (generations, name) = argmax(array_length(lineage),name) by family
```

**Output**

|family|generations|name|
|---|---|---|
|1|2|Nana Sophie|
|0|2|Mona|

## Related content

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
