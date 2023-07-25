---
title: make-graph operator (Preview)
description: Learn how to use the graph-to-table operator to build a graph structure from tabular inputs of edges and nodes.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# make-graph operator (Preview)

The `make-graph` operator builds a graph structure from tabular inputs of edges and nodes.

> [!WARNING]
> The `make-graph` operator is currently offered in preview mode. 
> The syntax and semantics of the operator might change prior to public availability.

## Syntax

*Edges*  
| `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with ` *Nodes1* `on` *NodeId1* [`,` *Nodes2* `on` *NodeId2*] ]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *Edges* | string | &check; | tabular source containing the edges of the graph, each row represents an edge in the graph. |
| *SourceNodeId* | string | &check; | column in *Edges* with the source node ids of the edges. |
| *TargetNodeId* | string | &check; | column in *Edges* with the target node ids of the edges. |
| *Nodes* | string || tabular expressions containing the properties of the nodes in the graph. |
| *NodesId* | string || columns with the node ids in *Nodes*. |
 
## Returns

The `make-graph` operator returns a *graph* expression and has to be followed by a *graph* operator such as [graph-match](graph-match-operator.md). Each row in source *Edges* expression becomes an edge with the graph with properties that are the column values of the row. Each row in the node(s) tabular expression becomes a node in the graph with properties that are the column values of the row. Nodes that appear in the *Edges* table but don't have a corresponding row in the nodes table(s) are created as nodes with the corresponding node id and empty properties. 

> [!NOTE]
> A node identifier is unique in the created graph, if the same node id is present in both *Nodes1* and *Nodes2* tables, a single node would be created in the graph merging the properties (in a case of conflicting property values, an arbitrary value would be taken).

## Example

The following example builds a graph from edges and nodes tables, the nodes represent people and systems and the edges are different relations between nodes.   
Following the `make-graph` operator that builds the graph is a call to `graph-match` with a graph pattern that searches for attack paths to the "Trent" system node. 

```kusto
let nodes = datatable(name:string, type:string, age:int) 
[ 
	"Alice", "Person", 23,  
	"Bob", "Person", 31,  
	"Eve", "Person", 17,  
	"Mallory", "Person", 29,  
	"Trent", "System", 99 
]; 
let edges = datatable(source:string, destination:string, edge_type:string) 
[ 
	"Alice", "Bob", "communicatesWith",  
	"Alice", "Trent", "trusts",  
	"Bob", "Trent", "hasPermission",  
	"Eve", "Alice", "attacks",  
	"Mallory", "Alice", "attacks",  
	"Mallory", "Bob", "attacks"  
]; 
edges 
| make-graph source --> destination with nodes on name 
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(trent) 
	where mallory.name == "Mallory" and trent.name == "Trent" and attacks.edge_type == "attacks" and hasPermission.edge_type == "hasPermission" 
	project Attacker = mallory.name, Compromised = compromised.name, System = trent.name
```

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

## Next steps

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-match operator](graph-to-table-operator.md)
