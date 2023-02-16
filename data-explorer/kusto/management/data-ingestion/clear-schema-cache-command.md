---
title: Clearing cached schema for streaming ingestion - Azure Data Explorer
description: This article describes management command for clearing cached database schema in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/16/2023
---
# Clear schema cache for streaming ingestion

Cluster nodes cache schema of the databases that receive data via streaming ingestion. This process optimizes performance and utilization of cluster resources, but can cause propagation delays when the schema change.

Clear the cache to guarantee that subsequent streaming ingestion requests incorporate database or table schema changes. For more information, see [Streaming ingestion and schema changes](streaming-ingestion-schema-changes.md).

## Clear schema cache

The `.clear cache streamingingestion schema` command flushes cached schema from all cluster nodes.

## Syntax

`.clear` `table` *TableName* `cache` `streamingingestion` `schema`

`.clear` `database` `cache` `streamingingestion` `schema`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table for which to clear the cache. |

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
