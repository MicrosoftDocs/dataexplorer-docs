---
title:  graph_exposure_perimeter_fl()
description: Learn how to use the graph_exposure_perimeter_fl() function to calculate the Exposure Perimeter of target nodes over path or edge data.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/03/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# graph_exposure_perimeter_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculate the Exposure Perimeter (list and score) of target nodes over path or edge data.

The function `graph_exposure_perimeter_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that allows you to calculate the Exposure Perimeter of each of the target nodes based on paths or edges data. Each row of input data contains a source node and a target node, which can represent direct connections (edges) between nodes and targets, or longer multi-hop paths between them. If the paths aren't available, we can first discover them using the [graph-match](../query/graph-match-operator.md) operator or [graph_path_discovery_fl()](graph-path-discovery-fl.md) function. Then `graph_exposure_perimeter_fl()` can be executed on top of the output of path discovery.

Exposure Perimeter represents the accessibility of a specific target from relevant source nodes. The more sources can access the target, the more exposed it's to potential compromise by the attacker - hence the name. Nodes with high Exposure Perimeter are important in cybersecurity domain due to the likelihood they might be reached illegitimately and to being highly valued by attackers. Thus, nodes with high Exposure Perimeter should be protected accordingly - in terms of hardening and monitoring their perimeter.

The function outputs a list of connected sources that can reach each target and also a score representing sources' number. Optionally, in case there's a meaningful 'weight' for each source (such as vulnerability or exposedness), a weighted score is calculated as a sum of sources' weights. In addition, the limits for maximum total number of shown targets and maximum number of sources in each list are exposed as optional parameters for better control.

## Syntax

`graph_exposure_perimeter_fl(`*sourceIdColumnName*, *targetIdColumnName*, [*sourceWeightColumnName*], [*resultCountLimit*], [*listedIdsLimit*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *sourceIdColumnName* | `string` |  :heavy_check_mark: | The name of the column containing the source node Ids (either for edges or paths). |
| *targetIdColumnName* | `string` |  :heavy_check_mark: | The name of the column containing the target node Ids (either for edges or paths). |
| *sourceWeightColumnName* | `string` |   | The name of the column containing the source nodes' weights (such as vulnerability). If no relevant weights are present, the weighted score is equal to 0. The default column name is 'noWeightsColumn'. |
| *resultCountLimit* | `long` |   | The maximum number of returned rows (sorted by descending score). The default value is 100000. |
| *listedIdsLimit* | `long` |   | The maximum number of targets listed for each source. The default value is 50. |


## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `graph_exposure_perimeter_fl()`, see [Example](#example).

```kusto
let exposure_perimeter_fl = (T:(*), sourceIdColumnName:string, targetIdColumnName:string, sourceWeightColumnName:string= 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend sourceWeight       = tolong(column_ifexists(sourceWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by targetId, sourceWeight desc
    | summarize exposurePerimeterList = array_slice(make_set_if(sourceId, isnotempty(sourceId)), 0, (listedIdsLimit - 1))
                , exposurePerimeterScore = dcountif(sourceId, isnotempty(sourceId))
                , exposurePerimeterScoreWeighted = sum(sourceWeight)
        by targetId
    | extend isExposurePerimeterCapped = (exposurePerimeterScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by exposurePerimeterScore desc
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (docstring = "Calculate the Exposure Perimeter (list and score) of target nodes over path or edge data", skipvalidation = "true", folder = 'Cybersecurity') 
graph_exposure_perimeter_fl (T:(*), sourceIdColumnName:string, targetIdColumnName:string, sourceWeightColumnName:string = 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend sourceWeight       = tolong(column_ifexists(sourceWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by targetId, sourceWeight desc
    | summarize exposurePerimeterList = array_slice(make_set_if(sourceId, isnotempty(sourceId)), 0, (listedIdsLimit - 1))
                , exposurePerimeterScore = dcountif(sourceId, isnotempty(sourceId))
                , exposurePerimeterScoreWeighted = sum(sourceWeight)
        by targetId
    | extend isExposurePerimeterCapped = (exposurePerimeterScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by exposurePerimeterScore desc
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
let connections = datatable (SourceNodeName:string, TargetNodeName:string, SourceNodeVulnerability:int)[						
    'vm-work-1',            'webapp-prd', 	          0,
    'vm-custom',        	'webapp-prd', 	          4,
    'webapp-prd',           'vm-custom', 	          1,
    'webapp-prd',       	'test-machine', 	      1,
    'vm-custom',        	'server-0126', 	          4,
    'vm-custom',        	'hub_router', 	          4,
    'webapp-prd',       	'hub_router', 	          2,
    'test-machine',       	'vm-custom',              5,
    'test-machine',        	'hub_router', 	          5,
    'hub_router',           'remote_DT', 	          0,
    'vm-work-1',            'storage_main_backup', 	  0,
    'hub_router',           'vm-work-2', 	          0,
    'vm-work-2',        	'backup_prc', 	          1,
    'remote_DT',            'backup_prc', 	          2,
    'backup_prc',           'storage_main_backup', 	  0,
    'backup_prc',           'storage_DevBox', 	      0,
    'device_A1',            'sevice_B2', 	          1,
    'sevice_B2',            'device_A1', 	          2
];
let exposure_perimeter_fl = (T:(*), sourceIdColumnName:string, targetIdColumnName:string, sourceWeightColumnName:string = 'noWeightsColumn'
    , resultCountLimit:long = 100000, listedIdsLimit:long = 50)
{
let paths = (
    T
    | extend sourceId           = column_ifexists(sourceIdColumnName, '')
    | extend targetId           = column_ifexists(targetIdColumnName, '')
    | extend sourceWeight       = tolong(column_ifexists(sourceWeightColumnName, 0))
);
let aggregatedPaths = (
    paths
    | sort by targetId, sourceWeight desc
    | summarize exposurePerimeterList = array_slice(make_set_if(sourceId, isnotempty(sourceId)), 0, (listedIdsLimit - 1))
                , exposurePerimeterScore = dcountif(sourceId, isnotempty(sourceId))
                , exposurePerimeterScoreWeighted = sum(sourceWeight)
        by targetId
    | extend isExposurePerimeterCapped = (exposurePerimeterScore > listedIdsLimit)
);
aggregatedPaths
| top resultCountLimit by exposurePerimeterScore desc
};
connections
| invoke exposure_perimeter_fl(sourceIdColumnName 		= 'SourceNodeName'
                                    , targetIdColumnName 		= 'TargetNodeName'
                                    , sourceWeightColumnName 	= 'SourceNodeVulnerability'
)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let connections = datatable (SourceNodeName:string, TargetNodeName:string, SourceNodeVulnerability:int)[						
    'vm-work-1',            'webapp-prd', 	          0,
    'vm-custom',        	'webapp-prd', 	          4,
    'webapp-prd',           'vm-custom', 	          1,
    'webapp-prd',       	'test-machine', 	      1,
    'vm-custom',        	'server-0126', 	          4,
    'vm-custom',        	'hub_router', 	          4,
    'webapp-prd',       	'hub_router', 	          2,
    'test-machine',       	'vm-custom',              5,
    'test-machine',        	'hub_router', 	          5,
    'hub_router',           'remote_DT', 	          0,
    'vm-work-1',            'storage_main_backup', 	  0,
    'hub_router',           'vm-work-2', 	          0,
    'vm-work-2',        	'backup_prc', 	          1,
    'remote_DT',            'backup_prc', 	          2,
    'backup_prc',           'storage_main_backup', 	  0,
    'backup_prc',           'storage_DevBox', 	      0,
    'device_A1',            'sevice_B2', 	          1,
    'sevice_B2',            'device_A1', 	          2
];
connections
| invoke exposure_perimeter_fl(sourceIdColumnName 		= 'SourceNodeName'
                                    , targetIdColumnName 		= 'TargetNodeName'
                                    , sourceWeightColumnName 	= 'SourceNodeVulnerability'
)
```

---

**Output**


| targetId            | exposurePerimeterList                     | exposurePerimeterScore | exposurePerimeterScoreWeighted | isExposurePerimeterCapped |
| ------------------- | ----------------------------------------- | ---------------------- | ------------------------------ | ------------------------- |
| hub_router          | ["vm-custom","webapp-prd","test-machine"] | 3                      | 11                             | FALSE                     |
| storage_main_backup | ["vm-work-1","backup_prc"]                | 2                      | 0                              | FALSE                     |
| vm-custom           | ["webapp-prd","test-machine"]             | 2                      | 6                              | FALSE                     |
| backup_prc          | ["vm-work-2","remote_DT"]                 | 2                      | 3                              | FALSE                     |
| webapp-prd          | ["vm-work-1","vm-custom"]                 | 2                      | 4                              | FALSE                     |
| test-machine        | ["webapp-prd"]                            | 1                      | 1                              | FALSE                     |
| server-0126         | ["vm-custom"]                             | 1                      | 4                              | FALSE                     |
| remote_DT           | ["hub_router"]                            | 1                      | 0                              | FALSE                     |
| vm-work-2           | ["hub_router"]                            | 1                      | 0                              | FALSE                     |
| storage_DevBox      | ["backup_prc"]                            | 1                      | 0                              | FALSE                     |
| device_A1           | ["sevice_B2"]                             | 1                      | 2                              | FALSE                     |
| sevice_B2           | ["device_A1"]                             | 1                      | 1                              | FALSE                     |



Running the function aggregates the connections or paths between sources and targets by target. For each target, Exposure Perimeter represents the sources that can connect to it as score (regular and weighted) and list.


Each row in the output contains the following fields:

* `targetId`: ID of the target node taken from relevant column.
* `exposurePerimeterList`: a list of source nodes Ids (taken from relevant column) that can connect to the target node. The list is capped to maximum length limit of listedIdsLimit parameter.
* `exposurePerimeterScore`: the score is the count of source nodes that can connect to the target. High Exposure Perimeter score indicates that the target node can be potentially accessed from lots of sources, and should be treated accordingly.
* `exposurePerimeterScoreWeighted`: the weighted score is the sum of the optional source nodes' weight column, representing their value - such as vulnerability or exposedness. If such weight exists, weighted Exposure Perimeter score might be a more accurate metric of target node value due to potential access from highly vulnerable or exposed sources.
* `isExposurePerimeterCapped`: boolean flag whether the list of sources was capped by listedIdsLimit parameter. If it's true, then other sources can access the target in addition to the listed ones (up to the number of exposurePerimeterScore).

In the example above we run the `graph_exposure_perimeter_fl()` function on top of connections between sources and targets. In the first row of the output, we can see that target node 'hub_router' can be connected from three sources ('vm-custom', 'webapp-prd', 'test-machine'). We use the input data SourceNodeVulnerability column as source weights, and get a cumulative weight of 11. Also, since the number of sources is 3 and the default list limit is 50, all of the sources are shown - so the value of isExposurePerimeterCapped column is FALSE.

In case the multi-hop paths aren't available, we can build multi-hop paths between sources and targets (for example, by running 'graph_path_discovery_fl()') and run 'graph_exposure_perimeter_fl()' on top of the results.

The output looks similar, but represents Exposure Perimeter calculated over multi-hop paths, thus being a better indicator of target nodes true accessibility from relevant sources. In order to find the full paths between source and target scenarios (for example, for disruption), [graph_path_discovery_fl()](graph-path-discovery-fl.md) function can be used with filters on relevant source and target nodes.

The function `graph_exposure_perimeter_fl()` can be used to calculate the Exposure Perimeter of target nodes, either over direct edges or longer paths. In the cybersecurity domain, it can be used for several insights. Exposure Perimeter scores (regular and weighted), represent target node's importance both from defenders' and attackers' perspectives. Nodes with high Exposure Perimeter, especially critical ones, should be protected accordingly. For example, in terms of access monitoring and hardening. Security signals, such as alerts, should be prioritized on sources that can access these nodes. The Exposure Perimeter list should be monitored for undesired connections between sources and targets and used in disruption scenarios. For example, if some of the sources were comrpomised, connections between them and the target should be broken.

## Related content

* [Functions library](functions-library.md)
* [Kusto Query Language (KQL) graph semantics overview](../../graph-overview.md)
* [Graph operators](../query/graph-operators.md)
* [Scenarios](../../graph-scenarios.md)
* [Best practices](../../graph-best-practices.md)
* [graph_path_discovery_fl()](graph-path-discovery-fl.md)
