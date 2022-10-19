---
title: Materialized views limitations - Azure Data Explorer
description: This article describes materialized views limitations.
ms.reviewer: yifats
ms.topic: reference
ms.date: 10/15/2026
---

# Materialized views limitations and known issues

* A materialized view can't be created:
  * On top of another materialized view, unless the first materialized view is of type `take_any(*)` aggregation. See [materialized view over materialized view](materialized-view-overview.md#materialized-view-over-materialized-view).
  * On [follower databases](../../../follower.md). Follower databases are read-only and materialized views require write operations.  Materialized views that are defined on leader databases can be queried from their followers, like any other table in the leader.
  * On [external tables](../../query/schema-entities/externaltables.md).

* The source table of a materialized view:
  * Must be a table into which data is directly ingested, either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools), using an [update policy](../updatepolicy.md), or [from query commands](../data-ingestion/ingest-from-query.md).
    * Using [move extents](../move-extents.md) from other tables to the source table of the materialized view is only supported if using `setNewIngestionTime` property as part of the move extents command (refer to [.move extents](../move-extents.md) command for more details).
    * Moving extents to the source table of a materialized view, while *not* using `setNewIngestionTime` may fail with one of the following errors:
      * `Cannot drop/move extents from/to table 'TableName' since Materialized View 'ViewName' is currently processing some of these extents`.
      * `Cannot move extents to 'TableName' since materialized view 'ViewName' will not process these extents (can lead to data loss in the materialized view)`.
    * Must have [IngestionTime policy](../ingestiontimepolicy.md) enabled (it is enabled by default).
    * Can't be a table with [restricted view access policy](../restrictedviewaccesspolicy.md).

* A materialized view only processes new records ingested into the source table. Records which are removed from the source table, either by running [data purge](../../concepts/data-purge.md)/[soft delete](../../concepts/data-soft-delete.md)/[drop extents](../drop-extents.md), or due to [retention policy](../retentionpolicy.md) or any other reason, have no impact on the materialized view. The materialized view has its own [retention policy](materialized-view-policies.md#retention-and-caching-policy), which is independent of the retention policy of the source table. The materialized view might include records which are not present in the source table.

* [Cursor functions](../databasecursor.md#cursor-functions) can't be used on top of materialized views.

* Continuous export from a materialized view isn't supported.
