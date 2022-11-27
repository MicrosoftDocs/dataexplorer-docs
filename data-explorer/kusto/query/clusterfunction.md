---
title: cluster() (scope function) - Azure Data Explorer
description: Learn how to use the cluster() function to change the reference of the query to a remote cluster.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# cluster() (scope function)

::: zone pivot="azuredataexplorer"

Changes the reference of the query to a remote cluster.

## Syntax

`cluster(`*name*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *name* | string | &check; | Name of the cluster to reference. Either a fully qualified DNS name or string suffixed with `.kusto.windows.net`. Argument has to be constant prior to the query's execution, meaning it can't come from subquery evaluation. |

## Examples

### Use cluster() to access remote cluster

The next query can be run on any of the Kusto clusters.

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAA0vOKS0uSS3SUM9IzSlQ19RLSSxJTEosTtVQD07MLchJLQaKBZfkF+W6lqXmlRQr1Cgk55fmlQAAayjLjjcAAAA=)

```kusto
cluster('help').database('Samples').StormEvents | count

cluster('help.kusto.windows.net').database('Samples').StormEvents | count
```

|Count|
|---|
|59066|

### Use cluster() inside let statements

The same query as above can be rewritten to use inline function (let statement) that
receives a parameter `clusterName` - which is passed into the cluster() function.

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAA8tJLVFIy89XsFXQSM4pLS5JLfJLzE21Ki4pysxL1+Sq5lIAAqgMsgpNvZTEksSkxOJUDfXgxNyCnNRidU294JL8olzXstS8kmKFGoXk/NK8Eq5aay6gBRrqGak5BeqaADuaG9BwAAAA)

```kusto
let foo = (clusterName:string)
{
    cluster(clusterName).database('Samples').StormEvents | count
};
foo('help')
```

|Count|
|---|
|59066|

### Use cluster() inside Functions

The same query as above can be rewritten to be used in a function that
receives a parameter `clusterName` - which is passed into the cluster() function.

```kusto
.create function foo(clusterName:string)
{
    cluster(clusterName).database('Samples').StormEvents | count
};
```

> [!NOTE]
> Such functions can be used only locally and not in the cross-cluster query.

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end

## See also

* For accessing database within, the same cluster - use [database()](databasefunction.md) function.
* More information about cross-cluster and cross-database queries available [here](cross-cluster-or-database-queries.md).