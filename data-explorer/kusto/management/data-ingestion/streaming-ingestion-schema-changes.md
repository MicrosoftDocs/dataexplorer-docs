---
title:  Streaming ingestion and schema changes
description: This article discusses options of handling schema changes with streaming ingestion in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/26/2023
---
# Streaming ingestion and schema changes

Cluster nodes cache schema of databases that receive data via streaming ingestion. This process optimizes performance and utilization of cluster resources, but can cause propagation delays when schema changes.

If schema changes and streaming ingestion flows are uncoordinated, some of the streaming ingestion requests can fail. The failures could include schema-related errors, or the insertion of incomplete or distorted data into the table.

When implementing [custom ingestion](../../../ingest-data-streaming.md#choose-the-appropriate-streaming-ingestion-type), handle the schema-related failures by performing retries for a limited time or by rerouting data from the failed requests via queued ingestion methods.

## Schema changes

The following list covers key examples of schema changes:

* [Creation of tables](../create-table-command.md)
* [Deletion of tables](../drop-table-command.md)
* [Adding a column to a table](../alter-merge-table-command.md)
* [Removing a column from a table](../drop-column.md)
* [Retyping the columns of a table](../alter-column.md)
* [Renaming the columns of a table](../rename-column.md)
* [Adding precreated ingestion mappings](../create-ingestion-mapping-command.md)
* [Removing precreated ingestion mappings](../drop-ingestion-mapping-command.md)
* Adding, removing, or altering [policies](../policies.md)

## Clear the schema cache

The schema cache is kept while the cluster is online. If there are schema changes, the system automatically refreshes the cache, but this refresh can take several minutes. If you rely on the automatic refresh, you can experience uncoordinated ingestion failures. 

Reduce the effects of propagation delay by explicitly clearing the schema cache on the cluster nodes.

If the streaming ingestion flow and schema changes are coordinated, you can completely eliminate failures and their associated data distortion. 

**Coordinated flow example:**

1. Suspend streaming ingestion.
1. Wait until all outstanding streaming ingestion requests are complete.
1. Do schema changes.
1. Issue one or several [.clear cache streaming ingestion](clear-schema-cache-command.md) schema commands. 
    * Repeat until successful and all rows in the command output indicate success
1. Resume streaming ingestion.

> [!NOTE]
> Using clear cache streaming ingestion schema commands can have an adverse effect on the performance of streaming ingestion.
