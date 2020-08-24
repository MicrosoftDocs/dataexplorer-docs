---
title: Clear query results cache - Azure Data Explorer
description: This article describes management command for clearing cached database schema in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: amitof
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# Clear query results cache

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

**Syntax**

`.clear` `database` `cache` `query_results`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Count|`long`|The number of entries deleted by the node.

**Example**

```kusto
.clear database cache queryresults
```

|NodeId|Entries|
|---|---|
|Node1|42
|Node2|0
