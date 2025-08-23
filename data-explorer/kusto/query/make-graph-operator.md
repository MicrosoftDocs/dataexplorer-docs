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

*Edges* `|` `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with_node_id=` *NodeIdPropertyName* ]

*Edges* `|` `make-graph` *SourceNodeId* `-->` *TargetNodeId* [ `with` *Nodes1* `on` *NodeId1* [`,` *Nodes2* `on` *NodeId2* ]] `partitioned-by` *PartitionColumn* `(` *GraphOperator* `)`

## Parameters

| Name                   | Type     | Required           | Description                                                                 |
|------------------------|----------|--------------------|-----------------------------------------------------------------------------|
| *Edges*                | `string` | :heavy_check_mark: | The tabular source containing the edges of the graph, each row represents an edge in the graph. |
| *SourceNodeId*         | `string` | :heavy_check_mark: | The column in *Edges* with the source node IDs of the edges. |
| *TargetNodeId*         | `string` | :heavy_check_mark: | The column in *Edges* with the target node IDs of the edges. |
| *Nodes1*, *Nodes2*     | `string` |                    | The tabular expressions containing the properties of the nodes in the graph. |
| *NodesId1*, *NodesId2* | `string` |                    | The corresponding columns with the node IDs in *Nodes1*, *Nodes2* respectively. |
| *NodeIdPropertyName*   | `string` |                    | The name of the property for node ID on the nodes of the graph. |
| *PartitionColumn*      | `string` |                    | The column to partition the graph by. Creates separate graphs for each unique value in this column. |
| *GraphOperator*        | `string` |                    | The graph operator to apply to each partitioned graph. |

## Returns

The `make-graph` operator returns a graph expression and must be followed by a [graph operator](graph-operators.md#supported-graph-operators). Each row in the source *Edges* expression becomes an edge in the graph with properties that are the column values of the row. Each row in the *Nodes* tabular expression becomes a node in the graph with properties that are the column values of the row. Nodes that appear in the *Edges* table but don't have a corresponding row in the *Nodes* table are created as nodes with the corresponding node ID and empty properties.

When using the `partitioned-by` clause, separate graphs are created for each unique value in the specified *PartitionColumn*. The specified *GraphOperator* is then applied to each partitioned graph independently, and the results are combined into a single output. This is particularly useful for multitenant scenarios where you want to analyze each tenant's data separately while maintaining the same graph structure and analysis logic.

> [!IMPORTANT]
> When using the `partitioned-by` clause, both the *Edges* table and all *Nodes* tables must contain the partition column.

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

### Multitenant partitioned graph

This example demonstrates using the `partitioned-by` clause to analyze a multitenant social network. The `partitioned-by` clause creates separate graphs for each unique value in the partition column (in this case, `tenantId`), applies the graph operator to each partition independently, and combines the results.

:::image type="content" source="media/graphs/graph-example-make-graph-partitioned.png" alt-text="A graph showing three different companies which are representing three different partitions.":::

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA62XbW%2FiOBDH3%2FMp5ngFJ6AkhKfesRLQ7kOv7VYLq9WpqlZuMiK%2BBjtyTCt27777jUPCgxO0W%2B4iVY2NPf%2Bfx%2BPx5OwMbmWACWj2GCEojBUmKDQXC1glqBJgvpJJAstVpHlMQzQKJnQCNakWTPBvTHMpknolQg0iNTWCgGmWGqwZGx%2BC80QrstjIJu91CLbEbSPAmCm9JPltl5LR7vdI%2BqnaebCmedyvQ%2BW%2BAvScncE8tXwOU7mMmViPoQkzJuCtYsLniS9hwtYwVsjSCdVVu%2B1UG1DNh5v3ccR9hCsZikQK03EpFlwgGnHTnKHgUsEFPmMkY1TUl4HUvlf1OsbqOVTvJBfajPalVAEXTGNC%2FfdNx3VbnjP0GtDpt%2Fp9b%2FjwT72xhXFtmIl8hNmS67AEZI5sCdfIghMI2jnBwCLo2ATTkKmII0yUfEndccPUE%2BqM4YYJtjjJB25O0LMIPJvggpMI3NGyfTTt9582vQp9LU%2BQ7gxz6aEl3bWlL58RvvCoPBCuVv85EDo5SXePpBjGEwrjW3yBP6V6SqMXYMvc22OemHcT609ww6MoRarOWESSJrB9X66EhpP2rO%2B1SKvdAK%2Fd6jvu4MBvfZvhnWJ0hq4R%2F%2FfzYzicnMO1OAY2x3sUag0X7JknhdCdxehzFvFEv5Kg0xoOc4K2RTC0CT48r2EaYln8nHh%2BjQfcXL9zqO%2B0bf0r5j%2FBPKSeLIg%2Fkss3yfrk82s8MMgIesM9gmLkTilyx6uEfH6QdZ39rDs173%2BQdRiLgO6aDedbEswO%2FFiwaP3abRrSqfI6Dh2vdsvt9d0DN7m2%2FDWnvbhZqThcl%2BzUWPkh15RuXo%2FQyRH6FkLHRrhha8pyNDkyrTslg1UqeNoeGe1urt21tD1b%2B1ayEN4xRQeiZPknHlWD0MsRPAuhayN8jPgzZ%2FBJBoovVvitcF5PS%2FgGws0hBilE5eG3CkXqZbAoL3gURpsDEvI4OSO7dGD8tAMeUb8gik1NlNY6mFrZr3USuVI%2BfrYqHqYWqO1OuwzaV57TyrY%2F0H8UCx2eE019V%2B1sq5wD5MPSpqyqoOVKpZO5pMbQuv5%2BNH5gVStlNYMvo4g9SpXuQgN6jQJS4aY15Z5UZnTfKkbKSgJLoFsUKGFaLunC9rMpXsNy4uSIE%2FuZwUJmP%2BLE3mZ8MRMfceIgs1%2B4x487cXhMwlpjt1FYReGGLPV7tobivV7OtHPi9NCJuzJlk3LKMm%2B5G50stopp0kLYUTvOT07pWUm4LBuVb9aWqjD%2BqOe3VIWcu%2FN8z2SkNJFU%2FoYle8LmQrE4hP1MAs3mm4MsAi%2F0VZB9aslNRqJO8%2BXEjf8xaD6utxkGailPara5ZNoPwV%2F7VBeOBA2FmnDqzXv81W21vIfmm5pw6%2Bl487yEqBCE08oUfhmBcPMGE%2FQXRTUs5i4YjSzP183wrd2UB%2BXXgAowc9F%2FdWOTw5OaloFcmURKmvmnXmsvrd%2B3H%2BqUO380ynnIbpujz86E%2B1NCR0aRUB1%2BB6dNz1YwVvIvuq1gRlum6XqgBE5TDaz51KXdhxptPDXzHaKuepXk5tl39YgCITZ%2BzQfQb5fk7Z0p99CUa5mq1P8FZTuk0NUPAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Nodes table representing users across multiple tenants (organizations)
let nodes = datatable(userId:string, tenantId:string, name:string, department:string, role:string, location:dynamic) 
[
    // Tenant: CompanyA - San Francisco Bay Area
    "u001", "CompanyA", "Alice Johnson", "Engineering", "Senior Developer", dynamic({"type": "Point", "coordinates": [-122.4194, 37.7749]}),
    "u002", "CompanyA", "Bob Smith", "Engineering", "Team Lead", dynamic({"type": "Point", "coordinates": [-122.4094, 37.7849]}),
    "u003", "CompanyA", "Charlie Brown", "Marketing", "Manager", dynamic({"type": "Point", "coordinates": [-122.4294, 37.7649]}),
    "u004", "CompanyA", "Diana Prince", "HR", "Director", dynamic({"type": "Point", "coordinates": [-122.3994, 37.7949]}),
    "u005", "CompanyA", "Eve Wilson", "Engineering", "Junior Developer", dynamic({"type": "Point", "coordinates": [-122.4394, 37.7549]}),
    // Tenant: CompanyB - New York Area  
    "u006", "CompanyB", "Frank Miller", "Sales", "Account Manager", dynamic({"type": "Point", "coordinates": [-74.0060, 40.7128]}),
    "u007", "CompanyB", "Grace Lee", "Engineering", "Senior Developer", dynamic({"type": "Point", "coordinates": [-74.0160, 40.7228]}),
    "u008", "CompanyB", "Henry Davis", "Marketing", "Specialist", dynamic({"type": "Point", "coordinates": [-73.9960, 40.7028]}),
    "u009", "CompanyB", "Ivy Chen", "Engineering", "Team Lead", dynamic({"type": "Point", "coordinates": [-74.0260, 40.7328]}),
    "u010", "CompanyB", "Jack Thompson", "Operations", "Manager", dynamic({"type": "Point", "coordinates": [-73.9860, 40.6928]}),
    // Tenant: CompanyC - Austin Area
    "u011", "CompanyC", "Kate Anderson", "Finance", "Analyst", dynamic({"type": "Point", "coordinates": [-97.7431, 30.2672]}),
    "u012", "CompanyC", "Liam Murphy", "Engineering", "Architect", dynamic({"type": "Point", "coordinates": [-97.7331, 30.2772]}),
    "u013", "CompanyC", "Maya Patel", "Product", "Manager", dynamic({"type": "Point", "coordinates": [-97.7531, 30.2572]}),
    "u014", "CompanyC", "Noah Garcia", "Engineering", "Developer", dynamic({"type": "Point", "coordinates": [-97.7631, 30.2472]}),
    "u015", "CompanyC", "Olivia Rodriguez", "Marketing", "Director", dynamic({"type": "Point", "coordinates": [-97.7231, 30.2872]})
];
// Edges table representing relationships/interactions between users
let edges = datatable(sourceUserId:string, targetUserId:string, tenantId:string, relationshipType:string, strength:int)
[
    // CompanyA relationships
    "u001", "u002", "CompanyA", "reportsTo", 9,
    "u005", "u002", "CompanyA", "reportsTo", 8,
    "u002", "u003", "CompanyA", "collaborates", 6,
    "u001", "u005", "CompanyA", "mentors", 7,
    "u003", "u004", "CompanyA", "collaborates", 5,
    "u001", "u003", "CompanyA", "communicates", 4,
    // CompanyB relationships
    "u007", "u009", "CompanyB", "reportsTo", 9,
    "u006", "u010", "CompanyB", "reportsTo", 8,
    "u008", "u006", "CompanyB", "collaborates", 6,
    "u009", "u010", "CompanyB", "communicates", 5,
    "u007", "u008", "CompanyB", "mentors", 7,
    "u006", "u007", "CompanyB", "collaborates", 6,
    // CompanyC relationships  
    "u014", "u012", "CompanyC", "reportsTo", 9,
    "u012", "u013", "CompanyC", "collaborates", 7,
    "u011", "u013", "CompanyC", "collaborates", 6,
    "u013", "u015", "CompanyC", "reportsTo", 8,
    "u012", "u015", "CompanyC", "communicates", 5,
    "u011", "u014", "CompanyC", "mentors", 6
];
edges
| make-graph sourceUserId --> targetUserId with nodes on userId partitioned-by tenantId (
    graph-match cycles=none (n1)-[e*2..4]->(n2)
        where n1.userId != n2.userId and all(e, relationshipType == "collaborates") and
            geo_distance_2points(todouble(n1.location.coordinates[0]), todouble(n1.location.coordinates[1]),
                             todouble(n2.location.coordinates[0]), todouble(n2.location.coordinates[1])) < 10000
        project Start = strcat(n1.name, " (", n1.tenantId, ")"), Tenants = map(e, tenantId), End = strcat(n2.name, " (", n2.tenantId, ")")
)
```

|Start|Tenants|End|
|---|---|---|
|Bob Smith (CompanyA)|[<br>  "CompanyA",<br>  "CompanyA"<br>]|Diana Prince (CompanyA)|
|Henry Davis (CompanyB)|[<br>  "CompanyB",<br>  "CompanyB"<br>]|Grace Lee (CompanyB)|

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
