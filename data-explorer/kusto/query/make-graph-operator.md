---
title: make-graph operator (Preview)
description: Learn how to use the graph-to-table operator to build a graph structure from tabular inputs of edges and nodes.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/30/2023
---
# make-graph operator (Preview)

The `make-graph` operator builds a graph structure from tabular inputs of edges and nodes.

## Syntax

*Edges* `|` `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with` *Nodes1* `on` *NodeId1* [`,` *Nodes2* `on` *NodeId2* ]]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *Edges* | string | &check; | The tabular source containing the edges of the graph, each row represents an edge in the graph. |
| *SourceNodeId* | string | &check; | The column in *Edges* with the source node IDs of the edges. |
| *TargetNodeId* | string | &check; | The column in *Edges* with the target node IDs of the edges. |
| *Nodes* | string || The tabular expressions containing the properties of the nodes in the graph. |
| *NodesId* | string || The columns with the node IDs in *Nodes*. |

## Returns

The `make-graph` operator returns a graph expression and has to be followed by a [graph operator](graph-operators.md#supported-graph-operators). Each row in source *Edges* expression becomes an edge with the graph with properties that are the column values of the row. Each row in the nodes tabular expression becomes a node in the graph with properties that are the column values of the row. Nodes that appear in the *Edges* table but don't have a corresponding row in the nodes tables are created as nodes with the corresponding node ID and empty properties.

> [!NOTE]
> Each node has a unique identifier. If the same node ID appears in both the *Nodes1* and *Nodes2* tables, a single node is created by merging their properties. If there are conflicting property values for the same node, one of the values is arbitrarily chosen.

## Example

The following example builds a graph from edges and nodes tables. The nodes represent people and systems, and the edges are different relations between nodes. The `make-graph` operator builds the graph. Then, there's a call to `graph-match` with a graph pattern that searches for attack paths to the "Trent" system node.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42SXUvDMBSG7wf7D4debdAO5i5kygZTvBQEBS/GkKwNbVyTjOTMMfDHe5qmTToRbKFt+p6v501qjqB0wS2soGBI977mE8UkvwOLRqgyBbwcoxUraSEUTmE8Arq2/p1sapHzJIXkhRurFX3dLFLo1Ae9H2iLedCevoZ589ugPbO61uYyrLsM+pvhChv19WKRS/paLknb3dOjJjhelFdwVp9MHgERPArFUGgVfjZpHzH437ieLNdSnpTIGXL7LrBKwox9aD8smpNFm/yypw+omCVcKawVDvnKqr4iQ2T5Ia4UGfa/KN+6i4HOvda58egbJDvwrDTsWEFrHmTZOvYNzgTszxGtmuPjEl1OJhnmFUxk23KabX2rXbaekGtHo4mTFyQMqBsZGz86688VNxx8mZlrsloFFGCqAJcQtNZPp/ims35nXUBP3YQM2l8FDjfET0Sjf/IcYeOqcEPnLB4vhceAR1oE6/X20JIU5v4BuRhhNpIDAAA=" target="_blank">Run the query</a>

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

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

## See also

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
