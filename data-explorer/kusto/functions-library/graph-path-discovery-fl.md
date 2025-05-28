---
title:  graph_path_discovery_fl()
description: Learn how to use the graph_path_discovery_fl() function to detect paths over graph data.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/03/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# graph_path_discovery_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Discover valid paths between relevant endpoints (sources and targets) over graph data (edge and nodes).

The function `graph_path_discovery_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that allows you to discover valid paths between relevant endpoints over graph data. Graph data consists of nodes (for example - resources, applications or users) and edges (for example - existing access permissions). In cybersecurity context, such paths might represent possible lateral movement paths that a potential attacker can utilize. We're interested in paths connecting endpoints defined as relevant by some criteria - for example, exposed sources connected to critical targets. Based on the function's configuration, other types of paths, suitable for other security scenarios, can be discovered.

The input data for this function should include a table of edges in the format 'SourceId, EdgeId, TargetId' and a list of nodes with optional nodes' properties that can be used to define valid paths. Alternatively, graph input can be extracted from other types of data. For example, traffic logs with entries of type 'User A logged in to resource B' can be modeled as edges of type '(User A)-[logged in to]->(resource B)'. The list of distinct users and resources can be modeled as nodes.

We make several assumptions:

* All edges are valid for path discovery. Edges that are irrelevant should be filtered out before running path discovery.
* Edges are unweighted, independent, and unconditional, meaning that all edges have the same probability and moving from B to C isn't dependent on previous move from A to B.
* Paths we want to discover are simple directional paths without cycles, of type A->B->C. More complex definitions can be made by changing the internal syntax of graph-match operator in the function.

These assumptions can be adapted as needed by changing the internal logic of the function.

The function discovers all possible paths between valid sources to valid targets, under optional constraints such as path length limits, maximum output size, etc. The output is a list of discovered paths with source and target IDs, as well as list of connecting edges and nodes. The function uses only the required fields, such as node IDs and edge IDs. In case other relevant fields - such as types, property lists, security-related scores, or external signals - are available in input data, they can be added to logic and output by changing the function definition.

## Syntax

`graph_path_discovery_fl(`*edgesTableName*, , *nodesTableName*, *scopeColumnName*, *isValidPathStartColumnName*, *isValidPathEndColumnName*, *nodeIdColumnName*, *edgeIdColumnName*, , *sourceIdColumnName*, *targetIdColumnName*, [*minPathLength*], [*maxPathLength*], [*resultCountLimit*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edgesTableName* | `string` | :heavy_check_mark: | The name of the input table containing the edges of the graph. |
| *nodesTableName* | `string` | :heavy_check_mark: | The name of the input table containing the nodes of the graph. |
| *scopeColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes and edges tables containing the partition or scope (for example, subscription or account), so that a different anomaly model is built for each scope. |
| *isValidPathStartColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing a Boolean flag for a node, *True* meaning that the node is a valid start point for a path and *False* - not a valid one. |
| *isValidPathEndColumnName* | `string` | :heavy_check_mark: | The name of the column in nodes table containing a Boolean flag for a node, *True* meaning that the node is a valid end point for a path and *False* - not a valid one. |
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
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `graph_path_discovery_fl()`, see [Example](#example).

```kusto
let graph_path_discovery_fl = (   edgesTableName:string, nodesTableName:string, scopeColumnName:string
								, isValidPathStartColumnName:string, isValidPathEndColumnName:string
								, nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
								, minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend edgeId             = column_ifexists(edgeIdColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId             = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart   = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd     = column_ifexists(isValidPathEndColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
);
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing paths between source nodes and target nodes with less than predefined number of hops
    // Current configurations looks for directed paths without any cycles; this can be changed if needed
      graph-match cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , edgeAllTargetIds          = e.targetId
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
            , pathAllNodeIds                = array_concat(pack_array(sourceId), edgeAllTargetIds)
    | project-away edgeAllTargetIds
    | mv-apply with_itemindex = SortIndex nodesInPath = pathAllNodeIds to typeof(string), edgesInPath = edgeIds to typeof(string) on (
        extend step = strcat(
              iff(isnotempty(nodesInPath), strcat('(', nodesInPath, ')'), '')
            , iff(isnotempty(edgesInPath), strcat('-[',  edgesInPath, ']->'), ''))
       | summarize fullPath = array_strcat(make_list(step), '')
    )
);
paths
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (docstring = "Build paths on graph data (edges and nodes) between valid endpoints (sych as exposed and critical assets) per scope (such as subscription or device)", skipvalidation = "true", folder = 'Cybersecurity') 
graph_path_discovery_fl (     edgesTableName:string, nodesTableName:string, scopeColumnName:string
                            , isValidPathStartColumnName:string, isValidPathEndColumnName:string
                            , nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
                            , minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend edgeId             = column_ifexists(edgeIdColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId             = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart   = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd     = column_ifexists(isValidPathEndColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
);
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing paths between source nodes and target nodes with less than predefined number of hops
    // Current configurations looks for directed paths without any cycles; this can be changed if needed
      graph-match cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , edgeAllTargetIds          = e.targetId
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
            , pathAllNodeIds                = array_concat(pack_array(sourceId), edgeAllTargetIds)
    | project-away edgeAllTargetIds
    | mv-apply with_itemindex = SortIndex nodesInPath = pathAllNodeIds to typeof(string), edgesInPath = edgeIds to typeof(string) on (
        extend step = strcat(
              iff(isnotempty(nodesInPath), strcat('(', nodesInPath, ')'), '')
            , iff(isnotempty(edgesInPath), strcat('-[',  edgesInPath, ']->'), ''))
       | summarize fullPath = array_strcat(make_list(step), '')
    )
);
paths
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
    'device_A1',            'e17',	        'is connected to',      'sevice_B2', 	          'EU',
    'sevice_B2',            'e18',	        'is connected to',      'device_A1', 	          'EU'
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
    | extend IsValidStart = (NodeType == 'Virtual Machine'),             IsValidEnd = (NodeType == 'Cloud Storage')              // option 1
    //| extend IsValidStart = (NodeName in('vm-work-1', 'vm-work-2')),     IsValidEnd = (NodeName in('storage_main_backup'))       // option 2
    //| extend IsValidStart = (NodeEnvironment == 'Test'),                 IsValidEnd = (NodeEnvironment == 'Production')          // option 3
);
let graph_path_discovery_fl = (   edgesTableName:string, nodesTableName:string, scopeColumnName:string
								, isValidPathStartColumnName:string, isValidPathEndColumnName:string
								, nodeIdColumnName:string, edgeIdColumnName:string, sourceIdColumnName:string, targetIdColumnName:string
								, minPathLength:long = 1, maxPathLength:long = 8, resultCountLimit:long = 100000) 
{
let edges = (
    table(edgesTableName)
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend edgeId             = column_ifexists(edgeIdColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
    );
let nodes = (
    table(nodesTableName)
    | extend nodeId             = column_ifexists(nodeIdColumnName, '')
    | extend isValidPathStart   = column_ifexists(isValidPathStartColumnName, '')
    | extend isValidPathEnd     = column_ifexists(isValidPathEndColumnName, '')
    | extend scope              = column_ifexists(scopeColumnName, '')
);
let paths = (
    edges
    // Build graph object partitioned by scope, so that no connections are allowed between scopes.
    // In case no scopes are relevant, partitioning should be removed for better performance.
    | make-graph sourceId --> targetId with nodes on nodeId partitioned-by scope (
    // Look for existing paths between source nodes and target nodes with less than predefined number of hops
    // Current configurations looks for directed paths without any cycles; this can be changed if needed
      graph-match cycles = none (s)-[e*minPathLength..maxPathLength]->(t)
        // Filter only by paths with that connect valid endpoints
        where ((s.isValidPathStart) and (t.isValidPathEnd))
        project   sourceId                  = s.nodeId
                , isSourceValidPathStart    = s.isValidPathStart
                , targetId                  = t.nodeId
                , isTargetValidPathEnd      = t.isValidPathEnd
                , scope                     = s.scope
                , edgeIds                   = e.edgeId
                , edgeAllTargetIds          = e.targetId
    | limit resultCountLimit
    )
    | extend  pathLength                    = array_length(edgeIds)
            , pathId                        = hash_md5(strcat(sourceId, strcat(edgeIds), targetId))
            , pathAllNodeIds                = array_concat(pack_array(sourceId), edgeAllTargetIds)
    | project-away edgeAllTargetIds
    | mv-apply with_itemindex = SortIndex nodesInPath = pathAllNodeIds to typeof(string), edgesInPath = edgeIds to typeof(string) on (
        extend step = strcat(
              iff(isnotempty(nodesInPath), strcat('(', nodesInPath, ')'), '')
            , iff(isnotempty(edgesInPath), strcat('-[',  edgesInPath, ']->'), ''))
       | summarize fullPath = array_strcat(make_list(step), '')
    )
);
paths
};
graph_path_discovery_fl(edgesTableName          = 'edges'
                , nodesTableName                = 'nodesEnriched'
                , scopeColumnName               = 'Region'
                , nodeIdColumnName              = 'NodeName'
                , edgeIdColumnName              = 'EdgeName'
                , sourceIdColumnName            = 'SourceNodeName'
                , targetIdColumnName            = 'TargetNodeName'
                , isValidPathStartColumnName    = 'IsValidStart'
                , isValidPathEndColumnName      = 'IsValidEnd'
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
    'device_A1',            'e17',	        'is connected to',      'sevice_B2', 	          'EU',
    'sevice_B2',            'e18',	        'is connected to',      'device_A1', 	          'EU'
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
    | extend IsValidStart = (NodeType == 'Virtual Machine'),             IsValidEnd = (NodeType == 'Cloud Storage')              // option 1
    //| extend IsValidStart = (NodeName in('vm-work-1', 'vm-work-2')),     IsValidEnd = (NodeName in('storage_main_backup'))       // option 2
    //| extend IsValidStart = (NodeEnvironment == 'Test'),                 IsValidEnd = (NodeEnvironment == 'Production')          // option 3
);
graph_path_discovery_fl(edgesTableName          = 'edges'
                , nodesTableName                = 'nodesEnriched'
                , scopeColumnName               = 'Region'
                , nodeIdColumnName              = 'NodeName'
                , edgeIdColumnName              = 'EdgeName'
                , sourceIdColumnName            = 'SourceNodeName'
                , targetIdColumnName            = 'TargetNodeName'
                , isValidPathStartColumnName    = 'IsValidStart'
                , isValidPathEndColumnName      = 'IsValidEnd'
)
```

---

**Output**


| sourceId	| isSourceValidPathStart	| targetId	| isTargetValidPathEnd	| scope	| edgeIds	| pathLength	| pathId	| pathAllNodeIds	| fullPath |
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| --- |
| test-machine	| True	| storage_DevBox	| True	| US	| ["e9","e10","e14","e16"]	| 4	| 00605d35b6e1d28024fd846f217b43ac	| ["test-machine","hub_router","remote_DT","backup_prc","storage_DevBox"]	| (test-machine)-[e9]->(hub_router)-[e10]->(remote_DT)-[e14]->(backup_prc)-[e16]->(storage_DevBox) |



Running the function finds all paths using input edges that connect between source nodes flagged as valid start points (isSourceValidPathStart == True) to all targets flagged as valid end points (isTargetValidPathEnd == True). The output is a table where each row describes a single path (limited to maximum number of rows by resultCountLimit parameter). Each row contains the following fields:

* `sourceId`: nodeId of the source - first node in the path.
* `isSourceValidPathStart`: Boolean flag for source node being a valid path start; should be equal to True.
* `targetId`: nodeId of the target - last node in the path.
* `isTargetValidPathEnd`: Boolean flag for target node being a valid path end; should be always equal to True.
* `scope`: the scope containing the path.
* `edgeIds`: an ordered list of edges in the path.
* `pathLength`: the numbers of edges (hops) in the path.
* `pathId`: a hash of path's endpoints and steps can be used as unique identifier for the path.
* `pathAllNodeIds`: an ordered list of nodes in the path.
* `fullPath`: a string representing the full path, in format (source node)-[edge 1]->(node2)-.....->(target node).

In the previous example, we preprocess the nodes table and add several options of possible endpoint definitions. By commenting/uncommenting different options, several scenarios can be discovered:

* Option 1: Find paths between Virtual Machines to Cloud Storage resources. Useful in exploring connection patterns between types of nodes.
* Option 2: Find paths between any of the specific nodes (vm-work-1, vm-work-2) to a specific node (storage_main_backup). Useful in investigating known cases - such as paths from known compromised assets to known critical ones.
* Option 3: Find paths between groups of nodes, such as nodes in different environments. Useful for monitoring insecure paths, such as paths between test and production environments.

In the example above we use the first option to find all the paths between VMs to cloud storage resources, which might be used by potential attackers who want to access stored data. This scenario can be strengthened by adding more filters to valid endpoints - for example, connecting VMs with known vulnerabilities to storage accounts containing sensitive data.

The function `graph_path_discovery_fl()` can be used in cybersecurity domain to discover interesting paths, such as lateral movement paths, over data modeled as a graph.

## Related content

* [Functions library](functions-library.md)
* [Graph semantics overview](../query/graph-semantics-overview.md)
:::moniker range="microsoft-fabric || azure-data-explorer"
* [Graph function](graph-function.md)
:::moniker-end
* [Graph scenarios](../query/graph-scenarios.md)
* [Best practices](../query/graph-best-practices.md)
