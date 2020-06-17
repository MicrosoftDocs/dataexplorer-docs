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

The query results cache (described in more details [here](..\query\query-results-cache.md)) is a cache dedicated for storing query results.


## Query results cache functions

Kusto provides two commands for cache management and observability:

* [Show cache](show-query-results-cache.md):
   Use this command to show statistics exposed by the results cache.

* [Clear cache(rhs:string)](clear-query-results-cache-command.md):
   Use this command to clear cached results.