---
title: Clearing cached schema for streaming ingestion - Azure Data Explorer
description: This article describes management command for clearing cached database schema in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/24/2020
---
# Cached database schema

Cluster nodes cache schema of databases that receive data via streaming ingestion. This done in order to achieve best performance and optimize utilization of cluster resources but can cause propagation delays when schema changes.
In order to guarantee that subsequent streaming ingestion requests see the database or table schema changes the cache needs to be cleared.

## Clear cached schema

The `.clear cache streamingingestion schema` command flushes cached schema from all cluster nodes

**Syntax**

`.clear` `table` &lt;table name&gt; `cache` `streamingingestion` `schema`

`.clear` `database` `cache` `streamingingestion` `schema`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node
|Status|`string`|Succeeded/Failed

**Examples**

```kusto
.clear database cache streamingingestion schema

.show table T1 cache streamingingestion schema
```

|NodeId|Status|
|---|---|
|Node1|Succeeded
|Node2|Failed

> [!NOTE]
If the command fails or one of the rows in the returned table contains _Status=**Failed**_ the command can be safely retried.