---
title: Clearing cached schema for streaming ingestion - Azure Data Explorer
description: This article describes management command for clearing cached database schema in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/20/2020
---
# Clear schema cache for streaming ingestion

Cluster nodes cache schema of the databases that receive data via streaming ingestion. This process optimizes performance and utilization of cluster resources, but can cause propagation delays when the schema change.
Clear the cache to guarantee that subsequent streaming ingestion requests incorporate database or table schema changes. The command flushes cached schema from all cluster nodes.

For more information, see [Streaming ingestion and schema changes](streaming-ingestion-schema-changes.md).

## Permissions

You must have at least [Database Ingestor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `table` &lt;table name&gt; `cache` `streamingingestion` `schema`

`.clear` `database` `cache` `streamingingestion` `schema`

## Returns

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node
|Status|`string`|Succeeded/Failed

## Example

```kusto
.clear database cache streamingingestion schema

.clear table T1 cache streamingingestion schema
```

|NodeId|Status|
|---|---|
|Node1|Succeeded
|Node2|Failed

> [!NOTE]
> If the command fails or one of the rows in the returned table contains *Status=Failed* the command can be safely retried.
