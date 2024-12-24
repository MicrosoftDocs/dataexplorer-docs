---
title: make-graph operator
description: Learn how to use the graph-to-table operator to build a graph structure from tabular inputs of edges and nodes.
ms.reviewer: royo
ms.topic: reference
ms.date: 11/05/2024
---
# make-graph operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `make-graph` operator builds a graph structure from tabular inputs of edges and nodes.

## Syntax

*Edges* `|` `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with` *Nodes1* `on` *NodeId1* [`,` *Nodes2* `on` *NodeId2* ]]

*Edges* `|` `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with_node_id=` *DefaultNodeId* ]

## Parameters

| Name            | Type     | Required           | Description                                                                 |
|-----------------|----------|--------------------|-----------------------------------------------------------------------------|
| *Edges*         | `string` | :heavy_check_mark: | The tabular source containing the edges of the graph, each row represents an edge in the graph. |
| *SourceNodeId*  | `string` | :heavy_check_mark: | The column in *Edges* with the source node IDs of the edges. |
| *TargetNodeId*  | `string` | :heavy_check_mark: | The column in *Edges* with the target node IDs of the edges. |
| *Nodes*         | `string` |                    | The tabular expressions containing the properties of the nodes in the graph. |
| *NodesId*       | `string` |                    | The columns with the node IDs in *Nodes*. |
| *DefaultNodeId* | `string` |                    | The name of the column for the default node ID. |

## Returns

The `make-graph` operator returns a graph expression and must be followed by a [graph operator](graph-operators.md#supported-graph-operators). Each row in the source *Edges* expression becomes an edge in the graph with properties that are the column values of the row. Each row in the *Nodes* tabular expression becomes a node in the graph with properties that are the column values of the row. Nodes that appear in the *Edges* table but don't have a corresponding row in the *Nodes* table are created as nodes with the corresponding node ID and empty properties.

> [!NOTE]
> Each node has a unique identifier. If the same node ID appears in both the *Nodes1* and *Nodes2* tables, a single node is created by merging their properties. If there are conflicting property values for the same node, one of the values is arbitrarily chosen.

Users can handle node information in the following ways:

1. **No node information required:** `make-graph` completes with source and target.
2. **Explicit node properties:** use up to two tabular expressions using "`with` *Nodes1* `on` *NodeId1* [`,` *Nodes2* `on` *NodeId2* ]."
3. **Default node identifier:** use "`with_node_id=` *DefaultNodeId*."

## Example

### Edges and nodes graph

The following example builds a graph from edges and nodes tables. The nodes represent people and systems, and the edges represent different relationships between nodes. The `make-graph` operator builds the graph. Then, the [`graph-match`](graph-match-operator.md) operator is used with a graph pattern to search for attack paths leading to the `"Trent"` system node.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAI2STWvDMAyG74X%2bB5FTC0mh62G0I4Xu4zgYdLBDKcNNROI1toutrhT246c432WHERLsvLKk57UKJNAmRQcxpIL4ORQ40ULhypGVOguBrqduIzJcSU1TGI92%2fAIEm0ImGIQQvKF1RvPqbhFCpT2aw0BZzBvl5Xt4Zn7fKK%2biKIy9DjMuG%2fXdoqZS214doeLVcsnK%2foE%2fBbNgmt2wbM3ZJh3AMzqSWpA0uv1XHvrsYf5FV6MkRqmzlokgdB%2bS8qBprA1sOyR7duSCGy9aOReO%2bZR0TnrGgS9tNkEkkmOXpefOf2Lqok0ENFZVNo1HP6DEEaPMilMOlVMQReu%2bS3BhzHpGeFeOhj%2foz0RKUJLDRFUlp9GuLrWP1hP26mQNE2LKwoC3lKl0YupbvuRoEeokM18ijjsQEDoFH95plY9eqUvO2mv0AS1zGTIofhM4vAjfD7f9hQnBxudAywPVby6Epw6NtR5orVfTyVLX9S8y3HEIagMAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let nodes = datatable(name:string, type:string, age:int) 
[ 
  "Alice", "Person", 23,  
  "Bob", "Person", 31,  
  "Eve", "Person", 17,  
  "Mallory", "Person", 29,  
  "Trent", "System", 99 
]; 
let edges = datatable(Source:string, Destination:string, edge_type:string) 
[ 
  "Alice", "Bob", "communicatesWith",  
  "Alice", "Trent", "trusts",  
  "Bob", "Trent", "hasPermission",  
  "Eve", "Alice", "attacks",  
  "Mallory", "Alice", "attacks",  
  "Mallory", "Bob", "attacks"  
]; 
edges 
| make-graph Source --> Destination with nodes on name 
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(trent) 
  where mallory.name == "Mallory" and trent.name == "Trent" and attacks.edge_type == "attacks" and hasPermission.edge_type == "hasPermission" 
  project Attacker = mallory.name, Compromised = compromised.name, System = trent.name
```

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

### Default node identifier

The following example builds a graph using only edges, with the `name` property as the default node identifier. This approach is useful when creating a graph from a tabular expression of edges, ensuring that the node identifier is available for the constraints section of the subsequent [`graph-match`](graph-match-operator.md) operator.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41Sy2rDMBC8%2ByuWnGyw8wEtDqSlx0KhhR5CCIq0xGosyUjrhkA%2Fviu%2F3VPxQUYzOzszdo0EqC4YoAQliJ9zjWlwrZf4EMhre8lBYSBtBWlnp7s4dKJ7M7IySA6QAGz2tZa4yWHz5M7xkM6Y1mopCMOnporv1rwPj5biC%2Fk2UBjxYXxCKxHe0BsdAtsYSS%2FfncSkJYiEvE4ar6Kunb%2F%2FkzJsHAmMHx8h6dtJfsCIKxYXL5oK%2Bn6gKHbLbuDG8U7WKTxpVVphkKe6gcIIkhWkpl%2BWFYdhybHYpVxQ4x0HQ8XAKmaEKRaQRa%2B3Cj3CoLGN%2BlCWcwIQVkHHnrG%2BvQ4ZNm6nD9cRprCRstr9h7iuP9ph018oCfadBHr%2Bg5becniegzG2iDng7%2FdAaBiaTf8C4hVjl48CAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
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
| make-graph source --> destination with_node_id=name
| graph-match (mallory)-[attacks]->(compromised)-[hasPermission]->(trent) 
  where mallory.name == "Mallory" and trent.name == "Trent" and attacks.edge_type == "attacks" and hasPermission.edge_type == "hasPermission" 
  project Attacker = mallory.name, Compromised = compromised.name, System = trent.name
```

**Output**

|Attacker|Compromised|System|
|---|---|---|
|Mallory|Bob|Trent|

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
