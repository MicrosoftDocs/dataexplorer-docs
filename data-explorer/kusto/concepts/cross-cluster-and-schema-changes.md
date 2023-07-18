---
title: Cross-cluster queries and schema changes - Azure Data Explorer
description: This article describes cross-cluster queries and schema changes in Azure Data Explorer.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 07/18/2023
---

# Cross-cluster queries and schema changes

With [cross-cluster queries](../query/cross-cluster-or-database-queries.md), the cluster that performs the initial query interpretation must have the schema of the entities referenced on the remote clusters.

Consider the following cross-cluster query:

```kusto
Table1 | join (cluster("Cluster2").database("MyDatabase2").Table2 ) on KeyColumn
```

In order for the query to run on *Cluster1*, the columns and their data types of *Table2* must be known. To get this information, a command is sent from *Cluster1* to *Cluster2*. However, this network operation can be costly, so the retrieved entities are cached to reduce future network operations for queries referencing the same entities.

If there are any changes to the schema in the remote cluster, the cached schema may become outdated and lead to unwanted effects. For example, new columns may not be recognized, or deleted columns may cause a `Partial query failure`.

To reduce the likelihood of encountering such issues, the cached schemas expire after one hour. After this time, subsequent queries must fetch the most up-to-date schema. Alternatively, you can manually refresh the schema with the [.clear cache remote-schema](../management/clear-cross-cluster-schema-cache.md) command.

## See also

* [Cross-cluster and cross-database queries](../query/cross-cluster-or-database-queries.md)
* [Clear schema cache for cross-cluster queries](../management/clear-cross-cluster-schema-cache.md)
* [Allow cross-tenant queries and commands](../access-control/cross-tenant-query-and-commands.md)
