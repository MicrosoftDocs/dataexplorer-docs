---
title: cluster() (scope function) - Azure Kusto | Microsoft Docs
description: This article describes cluster() (scope function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# cluster() (scope function)

Changes the reference of the query to a remote cluster. 

```kusto
cluster('help').database('Sample').SomeTable
```
 
**Syntax**

`cluster(`*stringConstant*`)`

**Arguments**

* *stringConstant*: Name of the cluster that is referenced. Cluster name can be either 
as fully qualified DNS name or as a stirng that will be suffixied with `.kusto.windows.net`. Argument has to be _constant_ prior of query execution, i.e. cannot come from sub-query evaluation.

**Notes**

* For accessing database within the same cluster - use [database()](databasefunction.md) function.
* More information about cross-cluster and cross-database queries available [here](cross-cluster-or-database-queries.md)  

## Examples

### Use cluster() to access remote cluster 

The next query can be run on any of the Kusto clusters.

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

**Note:** such functions can be used only locally and not in the cross-cluster query.