---
title: Clear query results cache - Azure Data Explorer
description: This article describes management command for clearing cached database schema in Azure Data Explorer.
services: data-explorer
author: amitof 
ms.author: amitof
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# Clear query results cache

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

**Syntax**

`.clear` `database` `cache` `queryresults`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Entries|`long`|The number of entries cleared by the node.

**Example**

```kusto
.clear database cache queryresults
```

|NodeId|Entries|
|---|---|
|Node1|42
|Node2|0
