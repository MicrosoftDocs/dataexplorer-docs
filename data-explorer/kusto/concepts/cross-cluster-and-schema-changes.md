---
title: Cross-cluster queries and schema changes - Azure Data Explorer
description: This article describes cross-cluster queries and schema changes in Azure Data Explorer.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 07/18/2023
---

# Cross-cluster queries and schema changes

When running a cross-cluster query, the cluster that performs the initial query interpretation must have the schema of the entities referenced on the remote clusters.

Retrieving the schema can be a costly network operation, so the schema entities from the remote clusters are cached. However, if there are any changes to the schema in the remote cluster, the cached schema may become outdated and lead to errors. To clear the cache, see [Clear schema cache for cross-cluster queries](../management/clear-cross-cluster-schema-cache.md).

> [!NOTE]
> For clusters in different tenants, see [Allow cross-tenant queries and commands](../access-control/cross-tenant-query-and-commands.md). Non-trusted external tenants may get an `Unauthorized error (401)` failure.

## Example

Consider the following cross-cluster query:

```kusto
Table1 | join (cluster("Cluster2").database("MyDatabase2").Table2 ) on KeyColumn
```

In order for the query to run on *Cluster1*, the columns and their data types of *Table2* must be known. To get this information, a command is sent from *Cluster1* to *Cluster2*. However, this network operation can be costly, so the retrieved entities are cached to reduce future network operations for queries referencing the same entities.

If there are any changes to the schema in the remote cluster, the cached schema may become outdated and lead to unwanted effects. For example, new columns won't be recognized, or deleted columns will cause a `Partial query failure` instead of a semantic error.

To reduce the likelihood of encountering such issues, the cached schemas expire after one hour. After this time, subsequent queries must fetch the most up-to-date schema. Alternatively, you can manually refresh the schema with the [.clear cache remote-schema](../management/clear-cross-cluster-schema-cache.md) command.

## See also

* [Cross-cluster and cross-database queries](../query/cross-cluster-or-database-queries.md)
* [Clear schema cache for cross-cluster queries](../management/clear-cross-cluster-schema-cache.md)
* [Allow cross-tenant queries and commands](../access-control/cross-tenant-query-and-commands.md)
