---
title: Show query results cache - Azure Data Explorer
description: This article describes .show query results cache in Azure Data Explorer.
services: data-explorer
author: amitof
ms.author: amitof
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# .show database query results cache

Returns a table showing statistics related to the [query results cache](../query/query-results-cache.md) made against the context database.

**Syntax**

`.show database query results cache`

**Output**
 
|Output parameter |Type |Description 
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Hits  |`long`|The number of cache hits.
|Misses  |`long`|The number of cache misses.
|CacheCapacityInBytes |`long` |The cache capacity in bytes.
|UsedBytes  |`long` |The cache used space.
|Count  |`long`| The number of unique query results stored in the cache.
