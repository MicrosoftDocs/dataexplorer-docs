---
ms.service: azure
ms.topic: include
ms.date: 05/23/2024
---

| Name | Type | Description |
|--|--|--|
| backfill | `bool` | Whether to create the view based on all records currently in `SourceTable` (`true`), or to create it from now on (`false`). Default is `false`. For more information, see [Backfill a materialized view](../management/materialized-views/materialized-view-create.md#backfill-a-materialized-view). |
| effectiveDateTime | `datetime` | Relevant only when you're using `backfill`. If it's set, creation backfills only with records ingested after the datetime. `backfill` must also be set to `true`. This property expects a datetime literal; for example, `effectiveDateTime=datetime(2019-05-01)`. |
| updateExtentsCreationTime | `bool` | Relevant only when you're using `backfill`. If it's set to `true`, [Extent Creation time](../management/extents-overview.md#extent-creation-time) is assigned based on the datetime group-by key during the backfill process. For more information, see [Backfill a materialized view](../management/materialized-views/materialized-view-create.md#backfill-a-materialized-view). |
| lookback | `timespan` | Valid only for `arg_max`/`arg_min`/`take_any` materialized views. It limits the period of time in which duplicates are expected. For example, if a lookback of 6 hours is specified on an `arg_max` view, the deduplication between newly ingested records and existing ones will take into consideration only records that were ingested up to 6 hours ago. <br><br>Lookback is relative to `ingestion_time`. Defining the lookback period incorrectly might lead to duplicates in the materialized view. For example, if a record for a specific key is ingested 10 hours after a record for the same key was ingested, and the lookback is set to 6 hours, that key will be a duplicate in the view. The lookback period is applied during both [materialization time](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work) and [query time](../management/materialized-views/materialized-view-overview.md#materialized-views-queries). |
| autoUpdateSchema | `bool` | Whether to automatically update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)`/`arg_min(Timestamp, *)`/`take_any(*)` (only when the column's argument is `*`). If this option is set to `true`, changes to the source table will be automatically reflected in the materialized view. |
| dimensionTables | array | A dynamic argument that includes an array of dimension tables in the view. See [Query parameter](../management/materialized-views/materialized-view-create.md#query-parameter). |
| folder | `string` | The materialized view's folder. |
| docString | `string` | A string that documents the materialized view. |
| allowMaterializedViewsWithoutRowLevelSecurity | `bool` | Allows creating a materialized view over a table with row level security policy enabled. |
