---
title: Cross-cluster queries and schema changes - Azure Data Explorer
description: This article describes cross-cluster queries and schema changes in Azure Data Explorer.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 02/28/2022
---

# Cross-cluster queries and schema changes

When running a cross-cluster query, the cluster that performs the initial query interpretation must have the schema of the entities referenced on the remote clusters.

For example, take the following cross-cluster query:

```kusto
Table1 | join (cluster("Cluster2").database("MyDatabase").Table2 ) on KeyColumn
```

In order for the query to run on *Cluster1*, the columns and their data types of *Table2* must be known. To get that information, a special command is sent from *Cluster1* to *Cluster2*. Sending the command can be an expensive network operation; hence, once the entities are retrieved, they're cached so that future queries referencing the same entities require fewer network operations.

Any changes to the schema of the remote entity may result in unwanted effects. For example, new columns aren't recognized or deleted columns may cause a 'Partial Query Error' instead of a semantic error.

To reduce the possibility of this issue arising, cached schemas expire one hour after retrieval, so that any queries run after that  time will work with the up-to-date schema.
Alternatively, you can refresh the schema manually by using the [Clear Cross Cluster Schema Cache](../management/clear-cross-cluster-schema-cache.md) command.

> [!IMPORTANT]
> If the clusters are in different tenants, you may need to edit the `trustedExternalTenants` property. Non-trusted external tenants may get an **Unauthorized error (401)** failure. For more information, see [How to allow principals from another tenant to access your cluster](../access-control/cross-tenant-query-and-commands.md).
