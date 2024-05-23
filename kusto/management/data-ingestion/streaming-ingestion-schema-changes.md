---
title:  Streaming ingestion and schema changes
description:  This article discusses options of handling schema changes with streaming ingestion.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/26/2023
---
# Streaming ingestion and schema changes

Cluster nodes cache the schema of databases that get data through [streaming ingestion](../../../ingest-data-streaming.md), boosting performance and resource use. However, when there are schema changes, it can lead to delays in updates. 

If schema changes and streaming ingestion aren't synchronized, you can encounter failures like schema-related errors or incomplete and distorted data in the table.

This article outlines typical schema changes and provides guidance on avoiding problems with streaming ingestion during these changes.

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

## Coordinate schema changes with streaming ingestion

The schema cache is kept while the cluster is online. If there are schema changes, the system automatically refreshes the cache, but this refresh can take several minutes. If you rely on the automatic refresh, you can experience uncoordinated ingestion failures. 

You can reduce the effects of propagation delay by explicitly clearing the schema cache on the cluster nodes. If the streaming ingestion flow and schema changes are coordinated, you can completely eliminate failures and their associated data distortion. 

To coordinate the streaming ingestion flow with schema changes:

1. Suspend streaming ingestion.
1. Wait until all outstanding streaming ingestion requests are complete.
1. Do schema changes.
1. Issue one or several [.clear cache streaming ingestion](clear-schema-cache-command.md) schema commands. 
    * Repeat until successful and all rows in the command output indicate success
1. Resume streaming ingestion.
 
> [!NOTE]
> If you've built an application for [custom ingestion](../../../ingest-data-streaming.md#choose-the-appropriate-streaming-ingestion-type), we recommend managing schema-related failures by either retrying for a set duration or redirecting data from failed requests using [queued ingestion methods](../../api/get-started/app-queued-ingestion.md).
