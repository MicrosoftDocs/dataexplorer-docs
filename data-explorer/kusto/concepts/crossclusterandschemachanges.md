---
title: Kusto cross-cluster queries & schema changes - Azure Data Explorer
description: This article describes Cross-cluster queries and schema changes  in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# Cross-cluster queries and schema changes

When executing cross-cluster query, the cluster that is doing the initial query interpretation must have the schema of the entities referenced in the remote clusters.
When the following query is sent to *Cluster1*

```kusto
Table1 | join ( cluster("Cluster2").database("SomeDB").Table2 ) on KeyColumn
``` 

*Cluster1* must know what columns *Table2* on *Cluster2* has, and the data types of those columns. To get that information, the special command is sent from *Cluster1* to *Cluster2*.
Sending the command can be expensive. Once retrieved, the schemas for remote entities are cached, and the next query referencing the same entities will run fewer network operations.

Changes in the schema of the remote entity may result in unwanted effects. For example, added columns aren't recognized, or deleted columns cause a 'Partial Query Error' instead of a semantic error.

To solve this problem, cached schemas expire one hour after retrieval, so that any query executed more than one hour after the change, will work with the up-to-date schema.

> [!IMPORTANT]
> In case the clusters are in different tenants, and the queries fails with Unauthorized error (401), you probably should edit the trustedExternalTenants property (for more information, see [How to allow principals from another tenant to access your cluster](../../cross-tenant-query-and-commands.md)).
