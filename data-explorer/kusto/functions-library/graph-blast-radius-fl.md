---
title:  graph_blast_radius_fl()
description: Learn how to use the graph_blast_radius_fl() function to calculate the Blast Radius of source nodes over path or edge data.
ms.reviewer: andkar
ms.topic: reference
ms.date: 05/25/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# graph_blast_radius_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculate the Blast Radius (list and score) of source nodes over path or edge data.

The function `graph_blast_radius_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that allows you to calculate the Blast Radius of each of the source nodes based on paths or edges data. Each row of input data contains a source node and a target node, which can represent direct connections (edges) between nodes and targets, or longer multi-hop paths between them. If the paths aren't available, we can first discover them using the [graph-match](../query/graph-match-operator.md) operator or [graph_path_discovery_fl()](graph-path-discovery-fl.md) function. Then `graph_blast_radius_fl()` can be executed on top of the output of path discovery.

Blast Radius represents the connectivity of a specific source node to relevant targets. The more targets the source can access, the more effect it has if it's compromised by the attacker - hence the name. Nodes with high Blast Radius are important in the cybersecurity domain due to the potential damage they might cause and to being highly valued by attackers. Thus, nodes with high Blast Radius should be protected accordingly - in terms of hardening and prioritizing security signals such as alerts.

The function outputs a list of connected targets for each source and also a score representing targets' number. Optionally, in case there's a meaningful 'weight' for each target (such as criticality or cost), a weighted score is calculated as a sum of targets' weights. In addition, the limits for maximum total number of shown sources and maximum number of targets in each list are exposed as optional parameters for better control.

## Syntax

`graph_blast_radius_fl(`*sourceIdColumnName*, *targetIdColumnName*, [*targetWeightColumnName*], [*resultCountLimit*], [*listedIdsLimit*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *sourceIdColumnName* | `string` |  :heavy_check_mark: | The name of the column containing the source node Ids (either for edges or paths). |
| *targetIdColumnName* | `string` |  :heavy_check_mark: | The name of the column containing the target node Ids (either for edges or paths). |
| *targetWeightColumnName* | `string` |   | The name of the column containing the target nodes' weights (such as criticality). If no relevant weights are present, the weighted score is equal to 0. The default column name is *noWeightsColumn*. |
| *resultCountLimit* | `long` |   | The maximum number of returned rows (sorted by descending score). The default value is 100000. |
| *listedIdsLimit* | `long` |   | The maximum number of targets listed for each source. The default value is 50. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `graph_blast_radius_fl()`, see [Example](#example).

```kusto
let graph_blast_radius_fl = (T:(*), sourceIdColumnName:string, targetIdColumnName:string, targetWeightColumnName:string = 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend targetWeight       = tolong(column_ifexists(targetWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by sourceId, targetWeight desc
    | summarize blastRadiusList = array_slice(make_set_if(targetId, isnotempty(targetId)), 0, (listedIdsLimit - 1))
                , blastRadiusScore = dcountif(targetId, isnotempty(targetId))
                , blastRadiusScoreWeighted = sum(targetWeight)
        by sourceId
    | extend isBlastRadiusListCapped = (blastRadiusScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by blastRadiusScore desc
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (docstring = "Calculate the Blast Radius (list and score) of source nodes over path or edge data", skipvalidation = "true", folder = 'Cybersecurity') 
graph_blast_radius_fl (T:(*), sourceIdColumnName:string, targetIdColumnName:string, targetWeightColumnName:string = 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend targetWeight       = tolong(column_ifexists(targetWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by sourceId, targetWeight desc
    | summarize blastRadiusList = array_slice(make_set_if(targetId, isnotempty(targetId)), 0, (listedIdsLimit - 1))
                , blastRadiusScore = dcountif(targetId, isnotempty(targetId))
                , blastRadiusScoreWeighted = sum(targetWeight)
        by sourceId
    | extend isBlastRadiusListCapped = (blastRadiusScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by blastRadiusScore desc
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
let connections = datatable (SourceNodeName:string, TargetNodeName:string, TargetNodeCriticality:int)[						
    'vm-work-1',            'webapp-prd', 	          3,
    'vm-custom',        	'webapp-prd', 	          3,
    'webapp-prd',           'vm-custom', 	          1,
    'webapp-prd',       	'test-machine', 	      1,
    'vm-custom',        	'server-0126', 	          1,
    'vm-custom',        	'hub_router', 	          2,
    'webapp-prd',       	'hub_router', 	          2,
    'test-machine',       	'vm-custom',              1,
    'test-machine',        	'hub_router', 	          2,
    'hub_router',           'remote_DT', 	          1,
    'vm-work-1',            'storage_main_backup', 	  5,
    'hub_router',           'vm-work-2', 	          1,
    'vm-work-2',        	'backup_prc', 	          3,
    'remote_DT',            'backup_prc', 	          3,
    'backup_prc',           'storage_main_backup', 	  5,
    'backup_prc',           'storage_DevBox', 	      1,
    'device_A1',            'sevice_B2', 	          2,
    'sevice_B2',            'device_A1', 	          2
];
let graph_blast_radius_fl = (T:(*), sourceIdColumnName:string, targetIdColumnName:string, targetWeightColumnName:string = 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend targetWeight       = tolong(column_ifexists(targetWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by sourceId, targetWeight desc
    | summarize blastRadiusList = array_slice(make_set_if(targetId, isnotempty(targetId)), 0, (listedIdsLimit - 1))
                , blastRadiusScore = dcountif(targetId, isnotempty(targetId))
                , blastRadiusScoreWeighted = sum(targetWeight)
        by sourceId
    | extend isBlastRadiusListCapped = (blastRadiusScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by blastRadiusScore desc
};
connections
| invoke graph_blast_radius_fl(sourceIdColumnName 		= 'SourceNodeName'
                            , targetIdColumnName 		= 'TargetNodeName'
                            , targetWeightColumnName 	= 'TargetNodeCriticality'
)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let connections = datatable (SourceNodeName:string, TargetNodeName:string, TargetNodeCriticality:int)[
    'vm-work-1',            'webapp-prd',           3,
    'vm-custom',            'webapp-prd',           3,
    'webapp-prd',           'vm-custom',            1,
    'webapp-prd',          'test-machine',          1,
    'vm-custom',           'server-0126',           1,
    'vm-custom',           'hub_router',            2,
    'webapp-prd',          'hub_router',            2,
    'test-machine',        'vm-custom',             1,
    'test-machine',        'hub_router',            2,
    'hub_router',           'remote_DT',            1,
    'vm-work-1',            'storage_main_backup',  5,
    'hub_router',           'vm-work-2',            1,
    'vm-work-2',            'backup_prc',           3,
    'remote_DT',            'backup_prc',           3,
    'backup_prc',           'storage_main_backup',  5,
    'backup_prc',           'storage_DevBox',       1,
    'device_A1',            'sevice_B2',            2,
    'sevice_B2',            'device_A1',            2
];
connections
| invoke graph_blast_radius_fl(sourceIdColumnName       = 'SourceNodeName'
                            , targetIdColumnName        = 'TargetNodeName'
                            , targetWeightColumnName    = 'TargetNodeCriticality'
)
```

---

**Output**


| sourceId | blastRadiusList | blastRadiusScore | blastRadiusScoreWeighted | isBlastRadiusListCapped |
|--|--|--|--|--|
| webapp-prd | ["vm-custom","test-machine","hub_router"] | 3 | 4 | FALSE |
| vm-custom | ["webapp-prd","server-0126","hub_router"] | 3 | 6 | FALSE |
| test-machine | ["vm-custom","hub_router"] | 2 | 3 | FALSE |
| vm-work-1 | ["webapp-prd","storage_main_backup"] | 2 | 8 | FALSE |
| backup_prc | ["storage_main_backup","storage_DevBox"] | 2 | 6 | FALSE |
| hub_router | ["remote_DT","vm-work-2"] | 2 | 2 | FALSE |
| vm-work-2 | ["backup_prc"] | 1 | 3 | FALSE |
| device_A1 | ["sevice_B2"] | 1 | 2 | FALSE |
| remote_DT | ["backup_prc"] | 1 | 3 | FALSE |
| sevice_B2 | ["device_A1"] | 1 | 2 | FALSE |

Running the function aggregates the connections or paths between sources and targets by source. For each source, Blast Radius represents the connected targets as score (regular and weighted) and list.


Each row in the output contains the following fields:

* `sourceId`: ID of the source node taken from relevant column.
* `blastRadiusList`: a list of target nodes Ids (taken from relevant column) that the source node is connected to. The list is capped to maximum length limit of listedIdsLimit parameter.
* `blastRadiusScore`: the score is the count of target nodes that the source is connected to. High Blast Radius score indicates that the source node can potentially access lots of targets, and should be treated accordingly.
* `blastRadiusScoreWeighted`: the weighted score is the sum of the optional target nodes' weight column, representing their value - such as criticality or cost. If such weight exists, weighted Blast Radius score might be a more accurate metric of source node value due to potential access to high value targets.
* `isBlastRadiusListCapped`: boolean flag whether the list of targets was capped by listedIdsLimit parameter. If it's true, then other targets can be accessed from the source in addition to the listed one (up to the number of blastRadiusScore).

In the example above, we run the `graph_blast_radius_fl()` function on top of connections between sources and targets. In the first row of the output, we can see that source node 'webapp-prd' is connected to three targets ('vm-custom', 'test-machine', 'hub_router'). We use the input data TargetNodeCriticality column as target weights, and get a cumulative weight of 4. Also, since the number of targets is 3 and the default list limit is 50, all of the targets are shown - so the value of isBlastRadiusListCapped column is FALSE.

If the multi-hop paths aren't available, we can build multi-hop paths between sources and targets (for example, by running 'graph_path_discovery_fl()') and run 'graph_blast_radius_fl()' on top of the results.

The output looks similar, but represents Blast Radius calculated over multi-hop paths, thus being a better indicator of source nodes true connectivity to relevant targets. In order to find the full paths between source and target scenarios (for example, for disruption), [graph_path_discovery_fl()](graph-path-discovery-fl.md) function can be used with filters on relevant source and target nodes.

The function `graph_blast_radius_fl()` can be used to calculate the Blast Radius of source nodes, calculated either over direct edges or longer paths. In the cybersecurity domain, it can provide several insights. Blast Radius scores, regular and weighted, represent a source node's importance from both defenders' and attackers' perspectives. Nodes with a high Blast Radius should be protected accordingly, for example, in terms of access hardening and vulnerability management. Security signals such as alerts on such nodes should be prioritized. The Blast Radius list should be monitored for undesired connections between sources and targets and used in disruption scenarios. For example, if the source was compromised, connections between it and important targets should be broken.

## Related content

* [Functions library](functions-library.md)
* [Graph semantics overview](../management/graph/graph-semantics-overview.md)
* [Graph operators](../query/graph-operator.md)
* [Graph Scenarios](../management/graph/graph-scenarios.md)
* [Best practices](../management/graph/graph-best-practices.md)
* [graph-path-discovery-fl()](graph-path-discovery-fl.md)
