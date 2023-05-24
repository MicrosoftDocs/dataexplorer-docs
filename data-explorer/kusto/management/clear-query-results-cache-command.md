---
title: Clear query results cache
description: Learn how to use the `.clear database cache query_results` command to clear all cached query results.
 clear cached query results.
ms.reviewer: amitof
ms.topic: reference
ms.date: 05/24/2023
---
# Clear query results cache

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `database` `cache` `query_results`

## Returns

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Count|`long`|The number of entries deleted by the node.

## Example

```kusto
.clear database cache query_results
```

|NodeId|Entries|
|---|---|
|Node1|42
|Node2|0
