---
title: Materialized views data purge - Azure Data Explorer
description: This article describes materialized views data purge in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---

# Materialized views data purge

The [data purge](../../concepts/data-purge.md) commands can be used to purge records from materialized views. The same guidelines for purging records from a table apply to materialized views purge as well.

In addition, when purging records from a materialized view, you should note:

* The purge command only deletes records from the *materialized part* of the view ([what is the materialized part](materialized-view-overview.md#how-materialized-views-work)?).

* Therefore, if the source table of the materialized view includes records to purge, these *may* be returned from the materialized view query, even after purge completed successfully.

* The recommended process for purging records from a materialized view is:
  * Purge the source table of the materialized view.
  * Only after source table purge is completed successfully, purge the materialized view.

* The purge predicate of a materialized view purge can only reference the group by keys of the aggregation, or any column in a [arg_max()](../../query/arg-max-aggfunction.md)/[arg_min() ](../../query/arg-min-aggfunction.md)/[any()](../../query/any-aggfunction.md) view. It **cannot** reference other aggregation functions result columns.

For example, for a materialized view `MV` which is defined with the following aggregation function:

```kusto
T | summarize count(), avg(Duration) by UserId
```

The following purge predicate is not valid, since it references the result of the avg() aggregation:

```kusto
MV | where avg_Duration > 1h
```

## See Also
* [Materialized views overview](materialized-view-overview.md)

