---
title:  Cross-cluster join
description: Learn how to perform the Cross-cluster join operation to join datasets residing on different clusters.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/03/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Cross-cluster join

::: zone pivot="azuredataexplorer, fabric"

A cross-cluster join involves joining data from datasets that reside in different clusters.

In a cross-cluster join, the query can be executed in three possible locations, each with a specific designation for reference throughout this document:

* *Local cluster*: The cluster to which the request is sent, which is also known as the cluster hosting the database in context.
* *Left cluster*: The cluster hosting the data on the left side of the join operation.
* *Right cluster*: The cluster hosting the data on the right side of the join operation.

The cluster that runs the query fetches the data from the other cluster.

> [!NOTE]
> If the data on the left and right sides of a join operation is hosted in the same cluster, it isn't considered a cross-cluster join, even if the data is hosted outside of the local cluster.

## Syntax

[ `cluster(`*ClusterName*`).database(`*DatabaseName*`).`]*LeftTable* `|` ...  
`|` `join` [ `hint.remote=`*Strategy* ] `(`  
&emsp;&emsp;[ `cluster(`*ClusterName*`).database(`*DatabaseName*`).`]*RightTable* `|` ...  
&emsp;`)` on *Conditions*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression whose rows are to be merged. Denoted as `$left`.|
|*Strategy*|string||Determines the cluster on which to execute the join. Supported values are: `left`, `right`, `local`, and `auto`. For more information, see [Strategies](#strategies).|
|*ClusterName*|string||If the data for the join resides outside of the local cluster, use the [cluster()](cluster-function.md) function to specify the cluster.|
|*DatabaseName*|string||If the data for the join resides outside of the local database context, use the [database()](database-function.md) function to specify the database.|
|*RightTable*|string|&check;|The right table or tabular expression whose rows are to be merged. Denoted as `$right`.|
|*Conditions*|string|&check;|Determines how rows from *LeftTable* are matched with rows from *RightTable*. If the columns you want to match have the same name in both tables, use the syntax `ON` *ColumnName*. Otherwise, use the syntax `ON $left.`*LeftColumn* `==` `$right.`*RightColumn*. To specify multiple conditions, you can either use the "and" keyword or separate them with commas. If you use commas, the conditions are evaluated using the "and" logical operator.|

### Strategies

The following list explains the supported values for the *Strategy* parameter:

* `left`: Execute join on the cluster of the left table, or left cluster.
* `right`: Execute join on the cluster of the right table, or right cluster.
* `local`: Execute join on the cluster of the current cluster, or local cluster.
* `auto`: (Default) Kusto makes the remoting decision.

> [!NOTE]
> The join remoting hint is ignored if the hinted strategy isn't applicable to the join operation.

## How the auto strategy works

By default, the `auto` strategy determines where the cross-cluster join should be executed based on the following rules:

* If one of the tables is hosted in the local cluster, then the join is performed on the local cluster.
* If both tables are hosted outside of the local cluster, then join is performed on the right cluster.

Consider the following examples:

```kusto
// Example 1
T | ... | join (cluster("B").database("DB").T2 | ...) on Col1

// Example 2
cluster("B").database("DB").T | ... | join (cluster("C").database("DB2").T2 | ...) on Col1
```

With the `auto` strategy, "Example 1" would be executed on the local cluster. In "Example 2", assuming neither cluster is the local cluster, the join would be executed on the right cluster.

## Performance considerations

For optimal performance, we recommend running the query on the cluster that contains the largest table.

Let's consider the following examples again:

```kusto
// Example 1
T | ... | join (cluster("B").database("DB").T2 | ...) on Col1

// Example 2
cluster("B").database("DB").T | ... | join (cluster("C").database("DB2").T2 | ...) on Col1
```

"Example 1" is set to run on the local cluster, but if the dataset produced by `T | ...` is smaller than one produced by `cluster("B").database("DB").T2 | ...` then it would be more efficient to execute the join operation on cluster `B`, in this case the right cluster, instead of on the local cluster.

The following query does this by using the `right` strategy. With the `right` strategy, the join operation is performed on the right cluster, even if left table is in the local cluster.

```kusto
T | ... | join hint.remote=right (cluster("B").database("DB").T2 | ...) on Col1
```

## Related content

* [join operator](join-operator.md)
* [Cross-cluster or cross-database queries](cross-cluster-or-database-queries.md)

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
