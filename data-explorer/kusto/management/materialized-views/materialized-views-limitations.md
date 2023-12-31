---
title:  Materialized views limitations
description: This article describes materialized views limitations.
ms.reviewer: yifats
ms.topic: reference
ms.date: 10/15/2022
---

# Materialized views limitations and known issues

## The materialized view source

* The source table of a materialized view:
  * Must be a table into which data is directly ingested, either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools), using an [update policy](../updatepolicy.md), or [ingest from query commands](../data-ingestion/ingest-from-query.md).
    * Using [move extents](../move-extents.md) from other tables to the source table of the materialized view is only supported if using `setNewIngestionTime` property as part of the move extents command (refer to [.move extents](../move-extents.md) command for more details).
    * Moving extents to the source table of a materialized view, while *not* using `setNewIngestionTime` may fail with one of the following errors:
      * `Cannot drop/move extents from/to table 'TableName' since Materialized View 'ViewName' is currently processing some of these extents`.
      * `Cannot move extents to 'TableName' since materialized view 'ViewName' will not process these extents (can lead to data loss in the materialized view)`.
* The source table of a materialized view must have [IngestionTime policy](../ingestiontimepolicy.md) enabled (it is enabled by default).
* The source table of a materialized view can't be a table with [restricted view access policy](../restrictedviewaccesspolicy.md).
* A materialized view can't be created on top of another materialized view, unless the first materialized view is of type `take_any(*)` aggregation. See [materialized view over materialized view](materialized-view-overview.md#materialized-view-over-materialized-view).
* Materialized views cannot be defined over [external tables](../../query/schema-entities/externaltables.md).

> [!WARNING]
>
> * A materialized view will be automatically disabled by the system if changes to the source table of the materialized view, or changes in data lead to incompatibility between the materialized view query and the expected materialized view's schema.
>   * To avoid this error, the materialized view query must be deterministic. For example, the [bag_unpack](../../query/bag-unpackplugin.md) or [pivot](../../query/pivotplugin.md) plugins result in a non-deterministic schema.
>   * When using an `arg_max(Timestamp, *)` aggregation and when `autoUpdateSchema` is false, changes to the source table can also lead to schema mismatches.
>     * Avoid this failure by defining the view query as `arg_max(Timestamp, Column1, Column2, ...)`, or by using the `autoUpdateSchema` option.
> * Using `autoUpdateSchema` may lead to irreversible data loss when columns in the source table are dropped.
> * Monitor automatic disable of materialized views using the [MaterializedViewResult metric](materialized-views-monitoring.md#materializedviewresult-metric).
> * After fixing incompatibility issues, the view should be explicitly re-enabled using the [enable materialized view](materialized-view-enable-disable.md) command.

## Impact of records ingested to or dropped from the source table

* A materialized view only processes new records ingested into the source table. Records that are removed from the source table, either by running [data purge](../../concepts/data-purge.md)/[soft delete](../../concepts/data-soft-delete.md)/[drop extents](../drop-extents.md), or due to [retention policy](../retentionpolicy.md) or any other reason, have no impact on the materialized view.
* The materialized view has its own [retention policy](materialized-view-policies.md#retention-and-caching-policy), which is independent of the retention policy of the source table. The materialized view might include records that are not present in the source table.

## Follower databases

* Materialized views cannot be created in [follower databases](../../../follower.md). Follower databases are read-only and materialized views require write operations.  
* Materialized views that are defined on leader databases can be queried from their followers, like any other table in the leader.
* Use the leader cluster to monitor follower database materialized views. For more details, see [Materialized views in follower databases](materialized-views-monitoring.md#materialized-views-in-follower-databases).

## Other

* [Cursor functions](../database-cursor.md#cursor-functions) can't be used on top of materialized views.
* Continuous export from a materialized view isn't supported.
