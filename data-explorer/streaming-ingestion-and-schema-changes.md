---
title: Streaming ingestion and schema changes - Azure Data Explorer
description: This article discusses options of handling schema changes with streaming ingestion in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/20/2020
---
# Streaming ingestion and schema changes
## Challenges coordinating schema changes with streaming ingestion

Cluster nodes cache schema of databases that receive data via streaming ingestion. This done in order to achieve best performance and optimize utilization of cluster resources but can cause propagation delays when schema changes.

Examples of schema changes are

* creation and deletion of databases and tables
* adding, removing, retyping or renaming the columns of the table
* adding or removing pre-created ingestion mappings
* adding, removing or altering policies

If schema changes and streaming ingestion flows are completely uncoordinated some of the streaming ingestion requests may fail with schema-related errors or insert incomplete or distorted data into the table.
It is highly recommended that custom ingestion application handle the schema-related failures by performing a retries for a limited time or re-routing data from the failed requests via queued ingestion methods.

## Clearing the schema cache
It is possible to reduce the effects of propagation delay by explicitly clearing the schema cache on the cluster nodes.
This is done by issuing one of the [Clear schema cache for streaming ingestion](kusto/management/clear-schema-cache-command.md) management commands.
If streaming ingestion flow and schema changes can be coordinated it is possible to completely eliminate failures and data distortion associated with them. Here is the example of coordinated flow

1. Suspend streaming ingestion
1. Wait until all outstanding streaming ingestion requests are complete
1. Perform schema changes
1. Issue one or several .clear cache streaming ingestion schema commands 
    * Repeat until successful and all rows in the command output indicate success
1. Resume streaming ingestion

> [!NOTE]
Using clear cache streaming ingestion schema commands frequently may have an adverse effect on the performance of streaming ingestion.
