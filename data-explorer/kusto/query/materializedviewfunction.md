---
title: materialized_view() (scope function) - Azure Data Explorer
description: This article describes materialized_view() function in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# materialized_view() function

References the `materialized part` of a [materialized view](../management/materialized-views/index.md). 
Refer to the [Materialized views queries](../management/materialized-views/materialized-view-query.md) article for details.

<!--- csl --->
```
materialized_view('ViewName')
```

**Syntax:** 

`materialized_view(`*ViewName*`,` [*max_age*]`)`

**Arguments**

* *ViewName*: The name of the `materialized view`.
* *max_age*: Optional. If not provided, only the *materialized* part of the view is returned. If provided, function will return the 
_materialized_ part of the view if last materialization time is greater than [@now -  max_age]. Otherwise, the entire view is returned (identical 
to querying *ViewName* directly. 

## Examples

Query the *materialized* part of the view only, regardless of when it was last materialized.

<!-- csl -->
```
materialized_view("ViewName")
```

Query the *materialized* part only if it was materialized in the last ten minutes. If the materialized part is older than ten minutes, 
return the full view (expected to be less performant than querying the materialized part).

<!-- csl -->
```
materialized_view("ViewName", 10m)
```
