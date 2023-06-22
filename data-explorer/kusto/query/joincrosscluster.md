---
title:  Cross-cluster join
description: Learn how to perform the Cross-cluster join operation to join datasets residing on different clusters.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/22/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Cross-cluster join

::: zone pivot="azuredataexplorer, fabric"

This article describes the Kusto Query Language (KQL) support for join operations on datasets that reside in different clusters.

## Syntax

*LeftTable* `|` ... `|` `join` [ `hint.remote=`*Strategy* ] `(cluster(`*ClusterName*`).database(`*DatabaseName*`).`*RightTable* `|` ...`)` on *Conditions*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The left table or tabular expression whose rows are to be merged. Denoted as `$left`.|
|*Strategy*|string||Determines the cluster on which to execute the join. Supported values are: `left`, `right`, `local`, and `auto`. For more information, see [Strategies](#strategies).|
|*ClusterName*|string|&check;|The cluster that contains the right table or tabular expression for the join.|
|*DatabaseName*|string|&check;|The database that contains the right table or tabular expression for the join.|
|*RightTable*|string|&check;|The right table or tabular expression whose rows are to be merged. Denoted as `$right`.|
|*Conditions*|string|&check;|Determines how rows from *LeftTable* are matched with rows from *RightTable*. If the columns you want to match have the same name in both tables, use the syntax `ON` *ColumnName*. Otherwise, use the syntax `ON $left.`*LeftColumn* `==` `$right.`*RightColumn. To specify multiple conditions, you can either use the "and" keyword or separate them with commas. If you use commas, the conditions are evaluated using the "and" logical operator.|

### Strategies

The following list explains the supported values for the *Strategy* parameter:

* `left`: Execute join on the cluster of the left table.
* `right`: Execute join on the cluster of the right table.
* `local`: Execute join on the cluster of the current cluster.
* `auto`: (Default) Kusto makes the remoting decision.

> [!NOTE]
> The join remoting hint is ignored if the hinted strategy isn't applicable to the join operation.

## Performance considerations

By default, the `auto` strategy determines where the cross-cluster join should be executed based on the following rules:

1. If one of the tables being joined is local to the cluster, the join is performed on the local cluster.
1. If the tables are located on different clusters, the join is executed on the cluster of the right table.

Consider the following examples:

```kusto
// Example 1
T | ... | join (cluster("SomeCluster").database("SomeDB").T2 | ...) on Col1

// Example 2
cluster("SomeCluster").database("SomeDB").T | ... | join (cluster("SomeCluster2").database("SomeDB2").T2 | ...) on Col1
```

With the `auto` strategy, "Example 1" would be executed on the local cluster. For "Example 2", assuming neither cluster is the local cluster, the join would be executed on "SomeCluster2" since it is the cluster of the right table. The cluster performing the join fetches the data from the other cluster.

For optimal performance, we recommend performing the join on the cluster that contains the largest table.

For example, "Example 1" was set to be run on the local cluster. However, if the dataset produced by `T | ...` is much smaller than one produced by `cluster("SomeCluster").database("SomeDB").T2 | ...`, then it would be more efficient to execute the join operation on `SomeCluster`. By specifying the strategy as `right`, the following query instructs Kusto to perform the join operation on the cluster that contains the right table, rather than executing it on the local cluster where the left table resides.

```kusto
T | ... | join hint.remote=right (cluster("SomeCluster").database("SomeDB").T2 | ...) on Col1
```

## See also

* [join operator](joinoperator.md)
* [Cross-cluster or cross-database queries](cross-cluster-or-database-queries.md)

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
