---
title:  cluster()
description: Learn how to use the cluster() function to change the reference of the query to a remote cluster or Eventhouse.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# cluster()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

:::moniker range="azure-data-explorer"
Changes the reference of the query to a remote cluster. To access a database within the same cluster, use the [database()](database-function.md) function. For more information, see [cross-database and cross-cluster queries](cross-cluster-or-database-queries.md).
:::moniker-end

:::moniker range="microsoft-fabric"
Changes the reference of the query to a remote Eventhouse. To access a database within the same Eventhouse, use the [database()](database-function.md) function. For more information, see [cross-database and cross-cluster queries](cross-cluster-or-database-queries.md).
<!-- Update link to the correct version for Fabric -->
:::moniker-end

## Syntax

`cluster(`*name*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

:::moniker range="azure-data-explorer"
| Name | Type | Required | Description |
|--|--|--|--|
| *name* | `string` |  :heavy_check_mark: | The name of the cluster to reference. The value can be specified as a fully qualified domain name, or the name of the cluster without the `.kusto.windows.net` suffix. The cluster name is treated as case-insenstive and the recommendation is to provide it lower-case. The value can't be the result of subquery evaluation. |
:::moniker-end

:::moniker range="microsoft-fabric"
| Name | Type | Required | Description |
|--|--|--|--|
| *name* | `string` |  :heavy_check_mark: | The full URL of the Eventhouse to reference. The value can be specified as a fully qualified domain name, or the name of the Eventhouse. The Eventhouse name is treated as case-insenstive and the recommendation is to provide it lower-case. The value can't be the result of subquery evaluation. |
:::moniker-end

## Examples

:::moniker range="azure-data-explorer"
### Use cluster() to access remote cluster

The following query can be run on any cluster.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAA0vOKS0uSS3SUM9IzSlQ19RLSSxJTEosTtVQD07MLchJLQaKBZfkF+W6lqXmlRQr1Cgk55fmlQAAayjLjjcAAAA=" target="_blank">Run the query</a>

```kusto
cluster('help').database('Samples').StormEvents | count

cluster('help.kusto.windows.net').database('Samples').StormEvents | count
```
:::moniker-end

:::moniker range="microsoft-fabric"
### Use cluster() to access remote Eventhouse

The following query can be run on any Eventhouse.

```kusto
cluster('help').database('Samples').StormEvents | count

cluster('help.kusto.windows.net').database('Samples').StormEvents | count
```
:::moniker-end

**Output**

|Count|
|---|
|59066|

### Use cluster() inside let statements

The previous query can be rewritten to use a query-defined function (`let` statement) that takes a parameter called `clusterName` and passes it to the `cluster()` function.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAA8tJLVFIy89XsFXQSM4pLS5JLfJLzE21Ki4pysxL1+Sq5lIAAqgMsgpNvZTEksSkxOJUDfXgxNyCnNRidU294JL8olzXstS8kmKFGoXk/NK8Eq5aay6gBRrqGak5BeqaADuaG9BwAAAA" target="_blank">Run the query</a>
:::moniker-end

```kusto
let foo = (clusterName:string)
{
    cluster(clusterName).database('Samples').StormEvents | count
};
foo('help')
```

**Output**

|Count|
|---|
|59066|

### Use cluster() inside Functions

The same query as above can be rewritten to be used in a function that receives a parameter `clusterName` - which is passed into the cluster() function.

```kusto
.create function foo(clusterName:string)
{
    cluster(clusterName).database('Samples').StormEvents | count
};
```

:::moniker range="azure-data-explorer"
> [!NOTE]
> Stored functions using the `cluster()` function can't be used in cross-cluster queries.
:::moniker-end

:::moniker range="microsoft-fabric"
> [!NOTE]
> Stored functions using the `cluster()` function can't be used in cross-Eventhouse queries.
:::moniker-end
