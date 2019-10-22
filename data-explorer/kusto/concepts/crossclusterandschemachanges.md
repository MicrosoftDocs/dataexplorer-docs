---
title: Cross-cluster queries and schema changes  - Azure Data Explorer | Microsoft Docs
description: This article describes Cross-cluster queries and schema changes  in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018

---
# Cross-cluster queries and schema changes 

When executing cross-cluster query the cluster which is doing the initial query interpretation must have the schema of the entities referenced in remote cluster(s).
So when the following query sent to *Cluster1*

```kusto
Table1 | join ( cluster("Cluster2").database("SomeDB").Table2 ) on KeyColumn
``` 

*Cluster1* must know what columns *Table2* on *Cluster2* has and what are the data types of those columns. In order accomplish that the special command is sent from *Cluster1* to *Cluster2*.
This sending of this command can be quite expensive, so once retrieved, the schemas for remote entities are cached and the next query referencing the same entities will have to execute less network operations.

This can cause unwanted effects when schema of the remote entity changes (added columns not being recognized or deleted columns causing 'Partial Query Error' instead of semantic error).

In order to alleviate this problem cached schemas expire in 1 hour after retrieval, so any query executed in more than 1 hour after the change will work with the up-to-date schema.