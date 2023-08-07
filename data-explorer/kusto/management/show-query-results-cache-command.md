---
title: .show database cache query_results command
description: Learn how to use the `.show cache query_results` command to show statistics related to the query results cache in the context of a database.
ms.reviewer: amitof
ms.topic: reference
ms.date: 05/24/2023
---
# .show database cache query_results command

Returns a table showing statistics related to the [query results cache](../query/query-results-cache.md) made against the context database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` `cache` `query_results`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

|Output parameter |Type |Description |
|---|---|---|
|NodeId|`string`|Identifier of the cluster node.|
|Hits  |`long`|The number of cache hits.|
|Misses  |`long`|The number of cache misses.|
|CacheCapacityInBytes |`long` |The cache capacity in bytes.|
|UsedBytes  |`long` |The cache used space.|
|Count  |`long`| The number of unique query results stored in the cache.|
