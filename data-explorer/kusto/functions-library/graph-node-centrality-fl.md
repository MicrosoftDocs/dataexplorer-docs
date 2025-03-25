---
title:  graph_node_centrality_fl()
description: Learn how to use the graph_node_centrality_fl() function to calculate various metrics of node centrality over graph data.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/25/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# graph_node_centrality_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculate various metrics of node centrality (such as degree and betweenness) over graph data (edge and nodes).

The function `graph_node_centrality_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that allows you to calculate various metrics of node centrality over graph data. Graph data consists of nodes (for example - resources, applications or users) and edges (for example - existing access permissions or connections). The centrality of a node represents its importance in the graph structure and can be defined and measured in several ways. In cybersecurity context, centrality represents node's value for attackers: compromising a node with high centrality (such as well-connected token) provides more possibilities. For defenders, high-centrality nodes are also important and should be protected accordingly. We calculate the centrality directly over edges, as well as over discovered shortest paths. Various centrality metrics can be useful in different security contexts. 

The input data for this function should include a table of edges in the format 'SourceId, EdgeId, TargetId' and a list of nodes with optional relevant nodes' properties. Alternatively, graph input can be extracted from other types of data. For example, traffic logs with entries of type 'User A logged in to resource B' can be modeled as edges of type '(User A)-[logged in to]->(resource B)'. The list of distinct users and resources can be modeled as nodes. As part of the function, shortest paths are calculated and used as input for centrality calculations.

We make several assumptions:

* All edges are valid for path discovery. Edges that are irrelevant should be filtered out before calculating centrality.
* Edges are unweighted, independent, and unconditional, meaning that all edges have the same probability and moving from B to C isn't dependent on previous move from A to B.
* Centrality metrics are calculated over edges as well as simple directional shortest paths without cycles, of type A->B->C. More complex definitions can be made by changing the internal syntax of graph-match operator in the function.

These assumptions can be adapted as needed by changing the internal logic of the function.

The function discovers all possible shortest paths between valid sources to valid targets, under optional constraints such as path length limits, maximum output size, etc. Various centrality metrics are calculated over resulting paths as well as original edges, representing different aspects of node importance. The output is a list of nodes that are flagged as relevant (using the 'isValidConnectorColumnName' column), with additional columns containing the centrality metrics for each node. The function uses only the required fields, such as node Ids and edge Ids. In case other relevant fields - such as types, property lists, security-related scores, or external signals - are available in input data, they can be added to logic and output by changing the function definition.

## Syntax

`graph_node_centrality_fl(`*edgesTableName*, , *nodesTableName*, *scopeColumnName*, *isValidPathStartColumnName*, *isValidPathEndColumnName*, *isValidConnectorColumnName*, *nodeIdColumnName*, *edgeIdColumnName*, *sourceIdColumnName*, *targetIdColumnName*, [*minPathLength*], [*maxPathLength*], [*resultCountLimit*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edgesTableName* | `string` | :heavy_check_mark: | The name of the input table containing the edges of the graph. |
| *nodesTableName* | `string` | :heavy_check_mark: | The name of the input table containing the nodes of the graph. |
| *scopeColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes and edges tables containing the partition or scope (for example, subscription or account), so that a different anomaly model is built for each scope. |
| *isValidPathStartColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing a Boolean flag for a node, *True* meaning that the node is a valid start point for a path and *False* - not a valid one. |
| *isValidPathEndColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing a Boolean flag for a node, *True* meaning that the node is a valid end point for a path and *False* - not a valid one. |
| *isValidConnectorColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing a Boolean flag for a node, *True* meaning that the node is a valid connector that will be included in the output and *False* - that it is not a valid one. |
| *nodeIdColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing the node ID. |
| *edgeIdColumnName* | `string` | :heavy_check_mark: | The name of the column in edges table containing the edge ID. |
| *sourceIdColumnName* | `string` | :heavy_check_mark: | The name of the column in edges table containing edge's source node ID. |
| *targetIdColumnName* | `string` | :heavy_check_mark: | The name of the column in edges table containing edge's target node ID. |
| *minPathLength* | `long` |  | The minimum number of steps (edges) in the path. The default value is 1. |
| *maxPathLength* | `long` |  | The maximum number of steps (edges) in the path. The default value is 8. |
| *resultCountLimit* | `long` |  | The maximum number of paths returned for output. The default value is 100000. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `graph_node_centrality_fl()`, see [Example](#example).

```kusto
let graph_node_centrality_fl = (   edgesTableName:string, nodesTableName:string, scopeColumnName:string
								, isValidPathStartColumnName:string, isValidPathEndColumnName:string, isValidConnectorColumnName:string
								, nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
								, minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId               = column_ifexists(sourceIdColumnName, '')
    | extend targetId               = column_ifexists(targetIdColumnName, '')
    | extend edgeId                 = column_ifexists(edgeIdColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId                 = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart       = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd         = column_ifexists(isValidPathEndColumnName, '')
    | extend isNodeValidConnector   = column_ifexists(isValidConnectorColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
);
let potentialPairsOnScope = (
    nodes
    | summarize countSources = dcountif(nodeId, (isValidPathStart)), countTargets = dcountif(nodeId, (isValidPathEnd)) by scope
    | project scope, countPotentialPairsOnScope = countSources * countTargets
    );
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing shortest paths between source nodes and target nodes with less than predefined number of hops.
    // Current configurations looks for directed paths without any cycles; this can be changed if needed.
      graph-shortest-paths output = all  cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , innerNodeIds              = map(inner_nodes(e), nodeId)
                , innerNodeConnector        = map(inner_nodes(e), isNodeValidConnector)
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathEndpointsId               = hash_md5(strcat(sourceId, targetId))
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
);
let pathsProcessed = (
    paths
    | mv-expand with_itemindex = i innerNodeId = innerNodeIds to typeof(string), innerNodeConnector to typeof(bool)
    | where (innerNodeConnector)
    | summarize countShortestPathsThroughNode = count(), take_any(sourceId, targetId, pathLength) by scope, innerNodeId, pathEndpointsId
    | join kind = leftouter (paths | summarize countShortestPaths = count() by scope, pathEndpointsId) on scope, pathEndpointsId
    | project-away scope1, pathEndpointsId1
    | extend betweennessForPair = (todouble(countShortestPathsThroughNode)/countShortestPaths)
    | summarize betweenness = sum(betweennessForPair), countShortestPathsThroughNode = sum(countShortestPathsThroughNode)
            , countPairsConnectedByNode = dcount(pathEndpointsId)
        by scope, nodeId = innerNodeId
    | join kind = leftouter (potentialPairsOnScope) on scope
    | extend relativePrestige = round(todouble(countPairsConnectedByNode)/countPotentialPairsOnScope, 6)
    | project scope, nodeId, betweenness, relativePrestige, countShortestPathsThroughNode, countPairsConnectedByNode
);
let centrality = (
nodes
| summarize take_any(*) by scope, nodeId
| where (isNodeValidConnector)
| join kind = leftouter (edges | summarize outDegree = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (edges | summarize inDegree = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend inDegree = coalesce(inDegree, 0), outDegree = coalesce(outDegree, 0)
| extend totalDegree = inDegree * outDegree
| join kind = leftouter (paths | summarize sourceOutFlow = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (paths | summarize sinkInFlow = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend sourceOutFlow = coalesce(sourceOutFlow, 0), sinkInFlow = coalesce(sinkInFlow, 0)
| join kind = leftouter (pathsProcessed) on scope, nodeId
| project-away scope1, nodeId1
| extend betweenness = coalesce(betweenness, 0.0), relativePrestige = coalesce(relativePrestige, 0.0)
    , countShortestPathsThroughNode = coalesce(countShortestPathsThroughNode, 0), countPairsConnectedByNode = coalesce(countPairsConnectedByNode, 0)
);
centrality
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (docstring = "Calculate various centrality metrics for relevant nodes over graph data (edges and nodes) and discovered paths between valid endpoints (sych as exposed and critical assets) per scope (such as subscription or device)", skipvalidation = "true", folder = 'Cybersecurity') 
graph_node_centrality_fl (   edgesTableName:string, nodesTableName:string, scopeColumnName:string
								, isValidPathStartColumnName:string, isValidPathEndColumnName:string, isValidConnectorColumnName:string
								, nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
								, minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId               = column_ifexists(sourceIdColumnName, '')
    | extend targetId               = column_ifexists(targetIdColumnName, '')
    | extend edgeId                 = column_ifexists(edgeIdColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId                 = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart       = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd         = column_ifexists(isValidPathEndColumnName, '')
    | extend isNodeValidConnector   = column_ifexists(isValidConnectorColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
);
let potentialPairsOnScope = (
    nodes
    | summarize countSources = dcountif(nodeId, (isValidPathStart)), countTargets = dcountif(nodeId, (isValidPathEnd)) by scope
    | project scope, countPotentialPairsOnScope = countSources * countTargets
    );
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing shortest paths between source nodes and target nodes with less than predefined number of hops.
    // Current configurations looks for directed paths without any cycles; this can be changed if needed.
      graph-shortest-paths output = all  cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , innerNodeIds              = map(inner_nodes(e), nodeId)
                , innerNodeConnector        = map(inner_nodes(e), isNodeValidConnector)
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathEndpointsId               = hash_md5(strcat(sourceId, targetId))
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
);
let pathsProcessed = (
    paths
    | mv-expand with_itemindex = i innerNodeId = innerNodeIds to typeof(string), innerNodeConnector to typeof(bool)
    | where (innerNodeConnector)
    | summarize countShortestPathsThroughNode = count(), take_any(sourceId, targetId, pathLength) by scope, innerNodeId, pathEndpointsId
    | join kind = leftouter (paths | summarize countShortestPaths = count() by scope, pathEndpointsId) on scope, pathEndpointsId
    | project-away scope1, pathEndpointsId1
    | extend betweennessForPair = (todouble(countShortestPathsThroughNode)/countShortestPaths)
    | summarize betweenness = sum(betweennessForPair), countShortestPathsThroughNode = sum(countShortestPathsThroughNode)
            , countPairsConnectedByNode = dcount(pathEndpointsId)
        by scope, nodeId = innerNodeId
    | join kind = leftouter (potentialPairsOnScope) on scope
    | extend relativePrestige = round(todouble(countPairsConnectedByNode)/countPotentialPairsOnScope, 6)
    | project scope, nodeId, betweenness, relativePrestige, countShortestPathsThroughNode, countPairsConnectedByNode
);
let centrality = (
nodes
| summarize take_any(*) by scope, nodeId
| where (isNodeValidConnector)
| join kind = leftouter (edges | summarize outDegree = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (edges | summarize inDegree = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend inDegree = coalesce(inDegree, 0), outDegree = coalesce(outDegree, 0)
| extend totalDegree = inDegree * outDegree
| join kind = leftouter (paths | summarize sourceOutFlow = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (paths | summarize sinkInFlow = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend sourceOutFlow = coalesce(sourceOutFlow, 0), sinkInFlow = coalesce(sinkInFlow, 0)
| join kind = leftouter (pathsProcessed) on scope, nodeId
| project-away scope1, nodeId1
| extend betweenness = coalesce(betweenness, 0.0), relativePrestige = coalesce(relativePrestige, 0.0)
    , countShortestPathsThroughNode = coalesce(countShortestPathsThroughNode, 0), countPairsConnectedByNode = coalesce(countPairsConnectedByNode, 0)
);
centrality
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6VYbW%2FjuBH%2BHiD%2FgVjgICmVY9mb7LW59QLb2z1sUNw2aIK2QFsYtETb3EikINJ2dL3%2B986Q1BvlxDmcsVjHfJkZzvPMC5kzTTKmWaqXVMiC5nKnloIdlkxoruvlOicLEj7chBdRTOzYjzLfFeIrLdiN0hUXm5ioVJZsNH5%2BRl75iYnmxVgACNa00g8V5QJ%2B3mRUM1zoxj8Zu7kUvQkmsvHwbzGkoE%2Bf8ZicqYdtxdT2hgsNPniXwBwXjS2faD2cn13F4MiU1ne0osVNxSh6Lrn803VMrGfr%2B1RWzG3q5qPzs%2F%2Ben02nZcUmZSVTphTRW0a4KHeADdWUrGpCswy04rlFRquMpMZXRICzFMjPSMb33CzR0mxSTKvzsxzgRQ%2FcsYrL7M9c3PNfGOgNMloHP9gzT6fkwAhValfAFwHLlBR0lTOy4oKsZWUkEK5Abg2ul8Y8MHVFVzwHQpBCZizHBasdzzUpGWzZUm32K1Bo7XCHY9knPBOwysLyYL9%2BJexJA3qWS9ayhTvmkq%2FZE1dahR7RYhIEkbffkvSZ%2FT6DjwlQOU%2FZAx4ZBGjZkCj0ZQ0payS1og5bVqHLhNSsKHVtDY8MUr1Ra85ouLXANw2BvWdItxQADruF5MNiGCtGZDf93osYCOZA41KQFrwYHjEZK2nF%2BFoWg%2FiLCfDM%2FDip5fd84CgSGFkFnvcbZwEJw%2B6wcd8m2BH9gMFHgPwFrTA4kNxN1Fku0pZVlzALND%2FwPCcrRnZAZoy3FGJGY%2BxkHBPXamd8I9cNF2lZMsgKAuhPVhQ3wfSaV0oTxZgw6myM2A3DABnETXPEzt5U7oT%2Bmzyoz1bZwo6EALFRcQ8a2inIYD12xSSn%2FgL6NFjQirC0o9VmOZARN26OSAdw47mmYngs9mQ6Ac0iOO43gGdCD7Tu5hxMdLOp2Aad7VxrkMKE00G1wZwHIIpdsYKJBgaOidIAgeEh98zmNev3Vm72I4jgGPP3KHCIRIfOCzCYfbAHpkIPG%2FCnGWkKTLM0s4ix5xfd2sLTruVrt9pHaNGL66hDpL%2FMKUUYPYL0CNGuAj4MSQKLtlR9ZYfGQFjF1%2BvQN2xkVy%2FsyAcC5XQWk6RPmz51juVkdduW39ZzLjkvMzRhVOn8RsF3g5cxnvf7%2B8W4MeiS38iwD4vjvYLZMnTx8Zzqexj6CxsDSFZTbk8x85sEsx85yAJ4hAC2hy%2BRPMKUZGNo6JPn6fVMDHzMMpb1uOGT%2B2UiWljiZwFv85M%2F91xs4YbxRHQsWfWPOkqefiUGvt0KRPZ3sdCFlM1ttsVjT6UU6C2a57VtKXH4wPhmq5UpN3gc5RvkFv7DrAOjSnkIsdigfW1fGrficbg9w6jPcML%2BTvMdayrKENgLT%2BOYDYQIR%2BH6rtcsLkgF0rIQ8%2BNATzRFrHpGxeQqGncNDue%2FCHkQPZq16XZgpstoTSzVWLIAjKJ0zBgnQEuuv4rThJtOp9gcg0NzGHbHO8Uri7S9D%2BC86RK7pqDfVQPSWMqERD%2B2NQyOT%2FN0l2MYQwOC1LiTXEHLPuw%2BwrvwnwtIrws0MJzQ%2FSaKoHHRW%2BQZcxCjSgqVkG78hNtC97F3d2mxMyJnlwmw4BjGPeRagVx9bO6XLRquchzXBYlxfG9yRaPLhTC4y7V6Rcc0bAqHBemFpNkm2y5DHu1UzMzM7%2F%2BPndnkcj9YjjRWF9GpRsr556G2DYeuUqrDoHXnMhhf2aP2Nvp5wNve%2FgfonY7shMa5G8YfB6rEvwPXwoJvgtE7gNvijhCQbGd6L2zOMCpxbhhvbsORDBqoS3JXsT0HX%2Bao%2Flga6Pc7Qdf1HRALtDLuVEMOxM4Qfhe9rpAamyCqC6qX7cXveAYBFTV8Jj%2F%2FPMky8uXLTVEEeK267O4hfTrlbK3lTiOlek3%2B6SrrX2x%2FalaqDrIOk5tj9ntJ7qjhEbJRVvpY2nLEpSodUtZFp8Z2HBPlI1vmkIJC39COx6%2BMIQzuXmCfn%2F3PXdJqAYBpntq2f8MgQilmO5sLbDxb4txjxSWkV5zDeTKfT5KryduEJNc3SQL%2FLhP7abKJ8fpQwFjC20kysxKabfYVZviBAkzTxyWtKlqHbz5mENxvYvLmE9vP3Pccv28fJmpXluD5N400w%2BuvQ5F48wJBy5yJjd6GRmFrNPDRkGmgHa6bG7jMknUlCzLDYjK%2FuniXAGVY2SUgRy083T0GYrN75Ig%2FkNkWsr32NtrOag%2BIK6fW1If5BajPwgi2YYIP9XR%2BFX33%2FYfFNSRw8Dr8f30JxWlCQpj8DiansyS66P0NkTSPQOEsSfCBykGNd2wFVmFQYyk7MPaIddQ%2BWeXjDAk39Apd2bpFS%2Fu0aF34Lw0RqkNjbOf2KPrPuCHag3dus1YONOjbZZFd272Rv56mrTi73rjBLSbvSXI5t68%2BYef692MCR%2BadBvD9LPa8kqIAR%2BMLBkRN1h%2Fy1Y%2BO3fSlVtNiMVYFUr9cpY9vK5DfbD%2FphVeJpas0Y%2BvNln97zAshy0rv9oen%2BpdkNn97df3u%2Bz8GcSu51djkok56xlR6fgacb%2Fh%2BfvYrFOm9fGQnXrBHr37W%2BKA5ZoBvoCWwIuUlzc0CbOxKqaB%2B7FlnnRkWeIWC4dPvWaN6OAjQoMeRVzyO%2BU%2Fkw2gPWj%2B9StTwqXAoyg%2F9V8vrbrADeSNKvEZg%2FxlxOPebBUb%2FB5zA89XjGAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let edges = datatable (SourceNodeName:string, EdgeName:string, EdgeType:string, TargetNodeName:string, Region:string)[						
    'vm-work-1',            'e1',           'can use',	            'webapp-prd', 	          'US',
    'vm-custom',        	'e2',           'can use',	            'webapp-prd', 	          'US',
    'webapp-prd',           'e3',           'can access',	        'vm-custom', 	          'US',
    'webapp-prd',       	'e4',           'can access',	        'test-machine', 	      'US',
    'vm-custom',        	'e5',           'can access',	        'server-0126', 	          'US',
    'vm-custom',        	'e6',	        'can access',	        'hub_router', 	          'US',
    'webapp-prd',       	'e7',	        'can access',	        'hub_router', 	          'US',
    'test-machine',       	'e8',	        'can access',	        'vm-custom',              'US',
    'test-machine',        	'e9',	        'can access',	        'hub_router', 	          'US',
    'hub_router',           'e10',	        'routes traffic to',	'remote_DT', 	          'US',
    'vm-work-1',            'e11',	        'can access',	        'storage_main_backup', 	  'US',
    'hub_router',           'e12',	        'routes traffic to',	'vm-work-2', 	          'US',
    'vm-work-2',        	'e13',          'can access',	        'backup_prc', 	          'US',
    'remote_DT',            'e14',	        'can access',	        'backup_prc', 	          'US',
    'backup_prc',           'e15',	        'moves data to',        'storage_main_backup', 	  'US',
    'backup_prc',           'e16',	        'moves data to',        'storage_DevBox', 	      'US',
    'device_A1',            'e17',	        'is connected to',      'device_B2', 	          'EU',
    'device_B2',            'e18',	        'is connected to',      'device_A1', 	          'EU'
];
let nodes = datatable (NodeName:string, NodeType:string, NodeEnvironment:string, Region:string) [
        'vm-work-1',                'Virtual Machine',      'Production',       'US',
        'vm-custom',                'Virtual Machine',      'Production',       'US',
        'webapp-prd',               'Application',          'None',             'US',
        'test-machine',             'Virtual Machine',      'Test',             'US',
        'hub_router',               'Traffic Router',       'None',             'US',
        'vm-work-2',                'Virtual Machine',      'Production',       'US',
        'remote_DT',                'Virtual Machine',      'Production',       'US',
        'backup_prc',               'Service',              'Production',       'US',
        'server-0126',              'Server',               'Production',       'US',
        'storage_main_backup',      'Cloud Storage',        'Production',       'US',
        'storage_DevBox',           'Cloud Storage',        'Test',             'US',
        'device_A1',                'Device',               'Backend',          'EU',
        'device_B2',                'Device',               'Backend',          'EU'
];
let nodesEnriched = (
    nodes
    | extend  IsValidStart      = (NodeType in ('Virtual Machine'))
            , IsValidEnd        = (NodeType in ('Cloud Storage'))
    | extend  IsValidConnector  = (NodeType in ('Application', 'Traffic Router', 'Service'))
);
let graph_node_centrality_fl = (   edgesTableName:string, nodesTableName:string, scopeColumnName:string
								, isValidPathStartColumnName:string, isValidPathEndColumnName:string, isValidConnectorColumnName:string
								, nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
								, minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId               = column_ifexists(sourceIdColumnName, '')
    | extend targetId               = column_ifexists(targetIdColumnName, '')
    | extend edgeId                 = column_ifexists(edgeIdColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId                 = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart       = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd         = column_ifexists(isValidPathEndColumnName, '')
    | extend isNodeValidConnector   = column_ifexists(isValidConnectorColumnName, '')
    | extend scope                  = column_ifexists(scopeColumnName, '')
);
let potentialPairsOnScope = (
    nodes
    | summarize countSources = dcountif(nodeId, (isValidPathStart)), countTargets = dcountif(nodeId, (isValidPathEnd)) by scope
    | project scope, countPotentialPairsOnScope = countSources * countTargets
    );
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing shortest paths between source nodes and target nodes with less than predefined number of hops.
    // Current configurations looks for directed paths without any cycles; this can be changed if needed.
      graph-shortest-paths output = all  cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , innerNodeIds              = map(inner_nodes(e), nodeId)
                , innerNodeConnector        = map(inner_nodes(e), isNodeValidConnector)
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathEndpointsId               = hash_md5(strcat(sourceId, targetId))
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
);
let pathsProcessed = (
    paths
    | mv-expand with_itemindex = i innerNodeId = innerNodeIds to typeof(string), innerNodeConnector to typeof(bool)
    | where (innerNodeConnector)
    | summarize countShortestPathsThroughNode = count(), take_any(sourceId, targetId, pathLength) by scope, innerNodeId, pathEndpointsId
    | join kind = leftouter (paths | summarize countShortestPaths = count() by scope, pathEndpointsId) on scope, pathEndpointsId
    | project-away scope1, pathEndpointsId1
    | extend betweennessForPair = (todouble(countShortestPathsThroughNode)/countShortestPaths)
    | summarize betweenness = sum(betweennessForPair), countShortestPathsThroughNode = sum(countShortestPathsThroughNode)
            , countPairsConnectedByNode = dcount(pathEndpointsId)
        by scope, nodeId = innerNodeId
    | join kind = leftouter (potentialPairsOnScope) on scope
    | extend relativePrestige = round(todouble(countPairsConnectedByNode)/countPotentialPairsOnScope, 6)
    | project scope, nodeId, betweenness, relativePrestige, countShortestPathsThroughNode, countPairsConnectedByNode
);
let centrality = (
nodes
| summarize take_any(*) by scope, nodeId
| where (isNodeValidConnector)
| join kind = leftouter (edges | summarize outDegree = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (edges | summarize inDegree = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend inDegree = coalesce(inDegree, 0), outDegree = coalesce(outDegree, 0)
| extend totalDegree = inDegree * outDegree
| join kind = leftouter (paths | summarize sourceOutFlow = dcount(targetId) by scope, sourceId) on scope, $left.nodeId == $right.sourceId
| join kind = leftouter (paths | summarize sinkInFlow = dcount(sourceId) by scope, targetId) on scope, $left.nodeId == $right.targetId
| project-away scope1, scope2, sourceId, targetId
| extend sourceOutFlow = coalesce(sourceOutFlow, 0), sinkInFlow = coalesce(sinkInFlow, 0)
| join kind = leftouter (pathsProcessed) on scope, nodeId
| project-away scope1, nodeId1
| extend betweenness = coalesce(betweenness, 0.0), relativePrestige = coalesce(relativePrestige, 0.0)
    , countShortestPathsThroughNode = coalesce(countShortestPathsThroughNode, 0), countPairsConnectedByNode = coalesce(countPairsConnectedByNode, 0)
);
centrality
};
graph_node_centrality_fl(edgesTableName         = 'edges'
                , nodesTableName                = 'nodesEnriched'
                , scopeColumnName               = 'Region'
                , nodeIdColumnName              = 'NodeName'
                , edgeIdColumnName              = 'EdgeName'
                , sourceIdColumnName            = 'SourceNodeName'
                , targetIdColumnName            = 'TargetNodeName'
                , isValidPathStartColumnName    = 'IsValidStart'
                , isValidPathEndColumnName      = 'IsValidEnd'
                , isValidConnectorColumnName    = 'IsValidConnector'
)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let edges = datatable (SourceNodeName:string, EdgeName:string, EdgeType:string, TargetNodeName:string, Region:string)[						
    'vm-work-1',            'e1',           'can use',	            'webapp-prd', 	          'US',
    'vm-custom',        	'e2',           'can use',	            'webapp-prd', 	          'US',
    'webapp-prd',           'e3',           'can access',	        'vm-custom', 	          'US',
    'webapp-prd',       	'e4',           'can access',	        'test-machine', 	      'US',
    'vm-custom',        	'e5',           'can access',	        'server-0126', 	          'US',
    'vm-custom',        	'e6',	        'can access',	        'hub_router', 	          'US',
    'webapp-prd',       	'e7',	        'can access',	        'hub_router', 	          'US',
    'test-machine',       	'e8',	        'can access',	        'vm-custom',              'US',
    'test-machine',        	'e9',	        'can access',	        'hub_router', 	          'US',
    'hub_router',           'e10',	        'routes traffic to',	'remote_DT', 	          'US',
    'vm-work-1',            'e11',	        'can access',	        'storage_main_backup', 	  'US',
    'hub_router',           'e12',	        'routes traffic to',	'vm-work-2', 	          'US',
    'vm-work-2',        	'e13',          'can access',	        'backup_prc', 	          'US',
    'remote_DT',            'e14',	        'can access',	        'backup_prc', 	          'US',
    'backup_prc',           'e15',	        'moves data to',        'storage_main_backup', 	  'US',
    'backup_prc',           'e16',	        'moves data to',        'storage_DevBox', 	      'US',
    'device_A1',            'e17',	        'is connected to',      'device_B2', 	          'EU',
    'device_B2',            'e18',	        'is connected to',      'device_A1', 	          'EU'
];
let nodes = datatable (NodeName:string, NodeType:string, NodeEnvironment:string, Region:string) [
        'vm-work-1',                'Virtual Machine',      'Production',       'US',
        'vm-custom',                'Virtual Machine',      'Production',       'US',
        'webapp-prd',               'Application',          'None',             'US',
        'test-machine',             'Virtual Machine',      'Test',             'US',
        'hub_router',               'Traffic Router',       'None',             'US',
        'vm-work-2',                'Virtual Machine',      'Production',       'US',
        'remote_DT',                'Virtual Machine',      'Production',       'US',
        'backup_prc',               'Service',              'Production',       'US',
        'server-0126',              'Server',               'Production',       'US',
        'storage_main_backup',      'Cloud Storage',        'Production',       'US',
        'storage_DevBox',           'Cloud Storage',        'Test',             'US',
        'device_A1',                'Device',               'Backend',          'EU',
        'device_B2',                'Device',               'Backend',          'EU'
];
let nodesEnriched = (
    nodes
    | extend  IsValidStart      = (NodeType in ('Virtual Machine'))
            , IsValidEnd        = (NodeType in ('Cloud Storage'))
    | extend  IsValidConnector  = (NodeType in ('Application', 'Traffic Router', 'Service'))
);
graph_node_centrality_fl(edgesTableName         = 'edges'
                , nodesTableName                = 'nodesEnriched'
                , scopeColumnName               = 'Region'
                , nodeIdColumnName              = 'NodeName'
                , edgeIdColumnName              = 'EdgeName'
                , sourceIdColumnName            = 'SourceNodeName'
                , targetIdColumnName            = 'TargetNodeName'
                , isValidPathStartColumnName    = 'IsValidStart'
                , isValidPathEndColumnName      = 'IsValidEnd'
                , isValidConnectorColumnName    = 'IsValidConnector'
)
```

---

**Output**

| scope	| nodeId	| NodeName	| NodeType	| NodeEnvironment	| Region	| IsValidStart	| IsValidEnd	| IsValidConnector	| isValidPathStart	| isValidPathEnd |	isNodeValidConnector	| outDegree	| inDegree	| totalDegree	| sourceOutFlow	| sinkInFlow	| betweenness	| relativePrestige	| countShortestPathsThroughNode |	countPairsConnectedByNode |
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| --- |	---	| ---	| --- | ---	| ---	| ---	| ---	| ---	| --- |	--- |
| US	| backup_prc	| backup_prc	| Service	| Production	| US	| False	| False	| True	| False	| False	| True	| 2	| 2	| 4	| 0	| 0	| 9	| 0.9	| 14	| 9 |


Running the function finds all shortest paths that connect between source nodes flagged as valid start points (isSourceValidPathStart == True) to all targets flagged as valid end points (isTargetValidPathEnd == True). Various centrality metrics are calculated on top of these paths as well as original edges for all nodes flagged as valid connectors (isValidConnector == True). The output is a table where each row corresponds to a valid connector node. Each row contains the following fields:

* `nodeId`: NodeId of the connector node.
* `isValidConnector`: Boolean flag for the node being a valid connector for which we want to calculate centrality; should be equal to True.
* `isSourceValidPathStart`: Boolean flag for the node being a valid path start.
* `isTargetValidPathEnd`: Boolean flag for the node being a valid path end.
* `scope`: The scope containing the node and the paths.
* `outDegree`: [OutDegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) of the node - number of distinct targets on outcoming edges adjacent to the node.
* `inDegree`: [InDegree](https://en.wikipedia.org/wiki/Directed_graph#Indegree_and_outdegree) of the node - number of distinct sources on incoming edges of the node.
* `totalDegree`: TotalDegree - indegree multiplied by outdegree; representing the potential number of paths that the node can create (since all the incoming edges are connected to all the outcoming ones).
* `sourceOutFlow`: The number of targets that can be reached via paths starting with the node - similar to [BlastRadius](graph-blast-radius-fl.md).
* `sinkInFlow`: The number of sources that can reach the node via paths - similar to [ExposurePerimeter](graph-exposure-perimeter-fl.md).
* `betweenness`: [Betweenness centrality](https://en.wikipedia.org/wiki/Betweenness_centrality) - the fraction of shortest paths that pass through the node out of all shortest paths.
* `relativePrestige`: [Prestige centrality](https://en.wikipedia.org/wiki/Eigenvector_centrality) is the count of source/target pairs connected by shortest paths passing through the node. Relative prestige normalizes this count by the number of  all potential source/target pairs. The calculation can be adapted to penalize the score for longer paths.
* `countShortestPathsThroughNode`: The number of shortest paths (perhaps with recurring source/target pairs) that pass through the node.
* `countPairsConnectedByNode`: The number of distinct source/target pairs from paths that pass through the node.


In the example above we calculate centrality metrics for all assets that are either applications, traffic routers or services, based on paths connecting virtual machines to storage accounts. In the first row of the output (if sorted by descending betweenness), we can see the service 'backup_prc'. It has in/out degrees of 2, betweenness of 9, etc. Different centrality metrics represent different aspects of importance, so they are not perfectly aligned - for example, node 'backup_prc' has high betweenness and relativePrestige, but low degrees (which highlights it as a node that doesn't have lots of direct edges, but is placed strategically and plays an important role in global relativePrestige of its scope).

The function `graph_node_centrality_fl()` can be used in cybersecurity domain to discover important nodes, such as well connected tokens or users, over data modeled as a graph. Various available centrality metrics provide a better understanding of node's posture and allow acting accordingly (for example, by prioritizing related signals, hardening the node or disrupting unnecessary connections).

## Related content

* [Functions library](functions-library.md)
* [Kusto Query Language (KQL) graph semantics overview](../query/graph-overview.md)
* [Graph operators](../query/graph-operators.md)
* [Scenarios](../query/graph-scenarios.md)
* [Best practices](../query/graph-best-practices.md)
