---
title: Query results cache commands - Azure Data Explorer
description: This article describes Query results cache in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: amitof
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# Query results cache commands for management and observability

The query results cache is a cache dedicated for storing query results. For more information, see [Query results cache](../query/query-results-cache.md).

**Query results cache commands**

Kusto provides two commands for cache management and observability:

* [`Show cache`](show-query-results-cache-command.md):
   Use this command to show statistics exposed by the results cache.

* [`Clear cache(rhs:string)`](clear-query-results-cache-command.md):
   Use this command to clear cached results.
