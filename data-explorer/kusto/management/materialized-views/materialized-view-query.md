---
title: Query a materialized view - Azure Data Explorer
description: This article describes how to query materialized views in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Materialized views queries

* Once a view is created, it can be queried just as any other table in the database, including participate in cross-cluster / cross-database queries.
* Materialized views are not included in wildcard unions or searches.
* Syntax for querying the view is the view name (like a table reference).
* Querying the materialized view will always return the most up-to-date results, based on all records ingested to the source table. 
The query _combines_ the _materialized_ part of the view with all records in the source table which haven't been materialized yet (see [Materialized views: behind the scenes](materialized-view-behind-the-scenes.md) for details).

## materialized_view() function

A special 
[materialized_view() function](../../query/materializedviewfunction.md)
supports a way of querying the _materialized_ part only of the view, while specifying the max latency the user is willing
to tolerate. This option is *not* guaranteed to return the most up-to-date records, but it should always be more performant than querying the entire view.
It is useful for scenarios in which you are willing to sacrifice some _freshness_ in favor of _performance_
 (usually useful for telemetry dashboards).

**Syntax:**

`materialized_view(`*ViewName*`,` [*max_age*]`)`

**Arguments**

* *ViewName*: The name of the view.
* *max_age*: Optional. If not provided, only the _materialized_ part of the view is returned. If provided, the function will return the 
_materialized_ part of the view if last materialization time is greater than [@now -  max_age]. Otherwise, the entire view is returned (identical 
to querying *ViewName* directly). 

**Examples** 

1. Query the entire view (most recent records in source table are included):

<!-- csl -->
```
ViewName
```

1. Query the _materialized_ part of the view only, regardless of when it was last materialized (latest materialization 
time can be checked using the [.show materialized-view](materialized-view-show-commands.md#show-materialized-view) command).

<!-- csl -->
```
materialized_view("ViewName")
```

1. Query the _materialized_ part only if it was materialized in the last ten minutes. Otherwise, return the full view (to limit the latency permitted).

<!-- csl -->
```
materialized_view("ViewName", 10m)
```

## Materialized views in Kusto.Explorer and web explorer

* Materialized Views are displayed under a Materialized Views folder in Kusto.Explorer and Kusto web explorer.