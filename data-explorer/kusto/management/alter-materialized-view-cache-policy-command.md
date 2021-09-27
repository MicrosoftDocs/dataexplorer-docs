---
title: .alter materialized view cache policy command - Azure Data Explorer
description: This article describes the .alter materialized view cache policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .alter materialized view cache policy

Change the materialized view cache policy.  To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority. 

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources. Queries over important data will be faster and resistant to the impact of queries over less important data.
- Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

## Syntax

`.alter` `materialized view` *MaterializedViewName* `policy` `caching`

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Example

### Set the cache policy of a materialized-view

This command sets the caching policy to include last 30 days.

```kusto
.alter materialized-view MyMaterializedView policy caching hot = 30d
```

### Set the cache policy of a materialized-view with additional hot-cache windows

This command sets the caching policy to include last 30 days and additional data from January and April 2021.

```kusto
.alter materialized-view MyMaterializedView policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```
