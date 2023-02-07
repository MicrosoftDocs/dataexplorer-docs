---
title: Clear query results cache - Azure Data Explorer
description: Find out how to clear cached query results in Azure Data Explorer. Learn which command to use and see an example.
ms.reviewer: amitof
ms.topic: reference
ms.date: 06/16/2020
---
# Clear query results cache

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

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
