---
title: Show query results cache - Azure Data Explorer
description: This article describes .show query results cache in Azure Data Explorer.
ms.reviewer: amitof
ms.topic: reference
ms.date: 05/09/2023
---
# .show database cache query_results

Returns a table showing statistics related to the [query results cache](../query/query-results-cache.md) made against the context database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` `cache` `query_results`

## Returns
 
|Output parameter |Type |Description 
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Hits  |`long`|The number of cache hits.
|Misses  |`long`|The number of cache misses.
|CacheCapacityInBytes |`long` |The cache capacity in bytes.
|UsedBytes  |`long` |The cache used space.
|Count  |`long`| The number of unique query results stored in the cache.
