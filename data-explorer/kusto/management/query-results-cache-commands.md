---
title: Query results cache - Azure Data Explorer
description: This article describes Query results cache in Azure Data Explorer.
services: data-explorer
author: amitof
ms.author: amitof
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# Query results cache

The query results cache is a cache dedicated for storing query results. For more information, see [Query results cache](../query/query-results-cache.md).

**Query results cache commands**

Kusto provides two commands for cache management and observability:

* [`Show cache`](show-query-results-cache-command.md):
   Use this command to show statistics exposed by the results cache.

* [`Clear cache(rhs:string)`](clear-query-results-cache-command.md):
   Use this command to clear cached results.
