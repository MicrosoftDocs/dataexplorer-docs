---
title: Create materialized view - Azure Data Explorer
description: This article describes how to create materialized views in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 06/16/2021
---

# .create materialized-view

A [materialized view](materialized-view-overview.md) is an aggregation query over a source table, representing a single summarize statement.

There are two possible ways to create a materialized view, noted by the *backfill* option in the command:

**Create the materialized view from now onwards:**

* The materialized view is created empty, and will only include records ingested after view creation. Creation of this kind returns immediately, and the view will be immediately available for query.

**Create the materialized view based on existing records in the source table:**

* See [backfill a materialized view](#backfill-a-materialized-view).
* Creation may take a long while to complete, depending on the number of records in the source table. The view won't be available for queries until backfill is complete.
* When using this option, the create command must be `async`. You can monitor execution with the [`.show operations`](../operations.md#show-operations) command.
* You can cancel the backfill process with the [`.cancel operation`](#cancel-materialized-view-creation) command.

> [!IMPORTANT]
> On large source tables, the backfill option may take a long time to complete. If this process transiently fails while running, it will not be automatically retried. You must then re-execute the create command. For more information, see [backfill a materialized view](#backfill-a-materialized-view).

The create operation requires [Database Admin](../access-control/role-based-authorization.md) permissions. The creator of the materialized view becomes the Admin of it.

## Syntax

`.create` [`async`] [`ifnotexists`] `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

## Arguments

|Argument|Type|Description
|----------------|-------|---|
|ViewName|String|Materialized View name. The view name can't conflict with table or function names in same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
|SourceTableName|String|Name of source table that the view is defined on.|
|Query|String|The materialized view query. For more information, see [query](#query-argument).|

> [!NOTE]
> * If the materialized view already exists:
>    * If `ifnotexists` flag is specified, the command is ignored. No change applied, even if the new definition doesn't match the existing definition.
>    * If `ifnotexists` flag isn't specified, an error is returned.
>    * To alter an existing materialized view, see [.alter materialized-view](materialized-view-alter.md) command.

### Query argument

The query used in the materialized view argument is limited by the following rules:

* The query argument should reference a single fact table that is the source of the materialized view, include a single summarize operator, and one or more [aggregation functions](#supported-aggregation-functions) aggregated by one or more groups by expressions. The summarize operator must always be the last operator in the query.
  * A materialized view that only includes a single `arg_max`/`arg_min`/`take_any` aggregation might perform better than a materialized view that includes these aggregations along with other aggregations (such as `count`/`dcount`/`avg`). This is because some optimizations are only relevant to these kinds of materialized views, and won't apply when the view includes "mixed" aggregation functions (where *mixed* means both `arg_max`/`arg_min`/`take_any` and other aggregations in the same view).

* The query shouldn't include any operators that depend on `now()`. For example, the query shouldn't have `where Timestamp > ago(5d)`. Limit the period of time covered by the view using the retention policy on the materialized view.

* The following operators are not supported in the materialized view query: [`sort`](../../query/sort-operator.md), [`top-nested`](../../query/topnestedoperator.md), [`top`](../../query/topoperator.md), [`partition`](../../query/partitionoperator.md), [`serialize`](../../query/serializeoperator.md).

* Composite aggregations are not supported in the materialized view definition. For instance, instead of the following view: `SourceTable | summarize Result=sum(Column1)/sum(Column2) by Id`, define the materialized view as: `SourceTable | summarize a=sum(Column1), b=sum(Column2) by Id`. During view query time, run - `ViewName | project Id, Result=a/b`. The required output of the view, including the calculated column (`a/b`), can be encapsulated in a [stored function](../../query/functions/user-defined-functions.md). Access the stored function instead of accessing the materialized view directly.

* Cross-cluster/cross-database queries aren't supported.

* References to [external_table()](../../query/externaltablefunction.md) and [externaldata](../../query/externaldata-operator.md) aren't supported.

* The materialized view query cannot include any callouts that require impersonation. Specifically, all [query connectivity plugins](../../query/azure-digital-twins-query-request-plugin.md) that use impersonation aren't allowed.

* In addition to the source table of the view, it may also reference one or more [`dimension tables`](../../concepts/fact-and-dimension-tables.md). Dimension tables must be explicitly called out in the view properties. It is important to understand the behavior when joining with dimension tables:

    * Records in the view's source table (the fact table) are materialized once only. Updates to the dimension tables do not have any impact on records that have already been processed from the fact table.
    * A different ingestion latency between the fact table and the dimension table may impact the view results.
    * **Example**: A view definition includes an inner join with a dimension table. At the time of materialization, the dimension record was not fully ingested, but was already ingested to the fact table. This record will be dropped from the view and never reprocessed again.

        Similarly, if the join is an outer join, the record from fact table will be processed and added to view with a null value for the dimension table columns. Records that have already been added (with null values) to the view won't be processed again. Their values, in columns from the dimension table, will remain null.

## Properties

The following are supported in the `with(propertyName=propertyValue)` clause. All properties are optional.

|Property|Type|Description |
|----------------|-------|---|
|backfill|bool|Whether to create the view based on all records currently in *SourceTable* (`true`), or to create it "from-now-on" (`false`). Default is `false`. For more information, see [backfill a materialized view](#backfill-a-materialized-view).|
|effectiveDateTime|datetime|Relevant only when using `backfill`. If set, creation only backfills with records ingested after the datetime. Backfill must also be set to true. Expects a datetime literal, for example, `effectiveDateTime=datetime(2019-05-01)`|
|UpdateExtentsCreationTime|bool|Relevant only when using `backfill`. If true, [extent creation time](../extents-overview.md#extent-creation-time) is assigned based on datetime group-by key during the backfill process. For more information, see [backfill a materialized view](#backfill-a-materialized-view).
|lookback|timespan| Valid only for `arg_max`/`arg_min`/`take_any` materialized views, and only if the engine is [EngineV3](../../../engine-v3.md). Limits the period of time in which duplicates are expected. For example, if a look-back of 6 hours is specified on an `arg_max` view, the de-duplication between newly ingested records and existing ones will only take into consideration records that were ingested up to 6 hours ago. Look-back is relative to `ingestion_time`. Defining the look-back period incorrectly may lead to duplicates in the materialized view. For example, if a record for a specific key is ingested 10 hours after a record for the same key was ingested, and the look-back is set to 6h, that key will be a duplicate in the view. The look-back period is applied both during [materialization time](materialized-view-overview.md#how-materialized-views-work) as well as during [query time](materialized-view-overview.md#materialized-views-queries).|
|autoUpdateSchema|bool|Whether to auto-update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)` / `arg_min(Timestamp, *)` / `take_any(*)` (only when columns argument is `*`). If this option is set to true, changes to source table will be automatically reflected in the materialized view.
|dimensionTables|Array|A dynamic argument that includes an array of dimension tables in the view. See [Query argument](#query-argument)
|folder|string|The materialized view's folder.|
|docString|string|A string documenting the materialized view|

> [!WARNING]
> * A materialized view will be automatically disabled by the system if changes to the source table of the materialized view, or changes in data lead to incompatibility between the materialized view query and the expected materialized view's schema.
>   * To avoid this error, the materialized view query must be deterministic. For example, the [bag_unpack](../../query/bag-unpackplugin.md) or [pivot](../../query/pivotplugin.md) plugins result in a non-deterministic schema.
>   * When using an `arg_max(Timestamp, *)` aggregation and when `autoUpdateSchema` is false, changes to the source table can also lead to schema mismatches.
>     * Avoid this failure by defining the view query as `arg_max(Timestamp, Column1, Column2, ...)`, or by using the `autoUpdateSchema` option.
> * Using `autoUpdateSchema` may lead to irreversible data loss when columns in the source table are dropped.
> Monitor automatic disable of materialized views using the [MaterializedViewResult metric](materialized-view-overview.md#materializedviewresult-metric).  After fixing incompatibility issues, re-enable the view with the [enable materialized view](materialized-view-enable-disable.md) command.

### Create materialized view over materialized view

A materialized view over another materialized view can only be created when the source materialized view is of kind `take_any(*)` aggregation (deduplication). See [materialized view over materialized view](materialized-view-overview.md#materialized-view-over-materialized-view) and [examples](#examples) below.

**Syntax":**
`.create` [`async`] [`ifnotexists`] `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on materialized-view` *SourceMaterializedViewName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

## Examples

1. Create an empty arg_max view that will only materialize records ingested from now on:

    <!-- csl -->
    ```
    .create materialized-view ArgMax on table T
    {
        T | summarize arg_max(Timestamp, *) by User
    }
    ```
    
1. Create a materialized view for daily aggregates with backfill option, using `async`:

    <!-- csl -->
    ```
    .create async materialized-view with (backfill=true, docString="Customer telemetry") CustomerUsage on table T
    {
        T 
        | extend Day = bin(Timestamp, 1d)
        | summarize count(), dcount(User), max(Duration) by Customer, Day 
    } 
    ```
    
1. Create a materialized view with backfill and `effectiveDateTime`. The view is created based on records from the datetime only:

    <!-- csl -->
    ```
    .create async materialized-view with (backfill=true, effectiveDateTime=datetime(2019-01-01)) CustomerUsage on table T 
    {
        T 
        | extend Day = bin(Timestamp, 1d)
        | summarize count(), dcount(User), max(Duration) by Customer, Day
    } 
    ```

1. A materialized view that de-duplicates the source table, based on EventId column, using a look-back of 6h. Records will only be de-duped against records ingested 6 hours prior to current records:

    <!-- csl -->
    ```
    .create materialized-view with(lookback=6h) DedupedT on table T
    {
        T
        | summarize take_any(*) by EventId
    }
    ```

1. Create a down-sampling materialized view which is based on the previous `DedupedT` materialized view:

    <!-- csl -->
    ```
    .create materialized-view DailyUsage on materialized-view DedupedT
    {
        DedupedT
        | summarize count(), dcount(User) by Day=bin(Timestamp, 1d)
    }
    ```

1. The definition can include additional operators before the `summarize` statement, as long as the `summarize` is the last one:

    <!-- csl -->
    ```
    .create materialized-view CustomerUsage on table T 
    {
        T 
        | where Customer in ("Customer1", "Customer2", "CustomerN")
        | parse Url with "https://contoso.com/" Api "/" *
        | extend Month = startofmonth(Timestamp)
        | summarize count(), dcount(User), max(Duration) by Customer, Api, Month
    }
    ```

1. Materialized views that join with a dimension table:

    <!-- csl -->
    ```
    .create materialized-view with (dimensionTables = dynamic(["DimUsers"])) EnrichedArgMax on table T
    {
        T
        | lookup DimUsers on User  
        | summarize arg_max(Timestamp, *) by User 
    }
    
    .create materialized-view with (dimensionTables = dynamic(["DimUsers"])) EnrichedArgMax on table T 
    {
        DimUsers | project User, Age, Address
        | join kind=rightouter hint.strategy=broadcast T on User
        | summarize arg_max(Timestamp, *) by User 
    }
    ```

## Supported aggregation functions

The following aggregation functions are supported:

* [`count`](../../query/count-aggfunction.md)
* [`countif`](../../query/countif-aggfunction.md)
* [`dcount`](../../query/dcount-aggfunction.md)
* [`dcountif`](../../query/dcountif-aggfunction.md)
* [`min`](../../query/min-aggfunction.md)
* [`max`](../../query/max-aggfunction.md)
* [`avg`](../../query/avg-aggfunction.md)
* [`avgif`](../../query/avgif-aggfunction.md)
* [`sum`](../../query/sum-aggfunction.md)
* [`sumif`](../../query/sumif-aggfunction.md)
* [`arg_max`](../../query/arg-max-aggfunction.md)
* [`arg_min`](../../query/arg-min-aggfunction.md)
* [`take_any`](../../query/take-any-aggfunction.md)
* [`take_anyif`](../../query/take-anyif-aggfunction.md)
* [`hll`](../../query/hll-aggfunction.md)
* [`make_set`](../../query/makeset-aggfunction.md)
* [`make_list`](../../query/makelist-aggfunction.md)
* [`make_bag`](../../query/make-bag-aggfunction.md)
* [`percentile`, `percentiles`](../../query/percentiles-aggfunction.md)
* [`tdigest`](../../query/tdigest-aggfunction.md)

## Performance tips

* **Datetime group-by key:** materialized views which have a datetime column as one of their group-by keys are more efficient than those that don't, due to some optimizations that can only be applied when there is a datetime group-by key. If adding a datetime group-by key does not change the semantics of your aggregation, it's recommended to add it. This can be done only if the datetime column is *immutable* for each unique entity.

    For example, in the following aggregation:

    ```kusto
        SourceTable | summarize take_any(*) by EventId
    ``` 
    
    If an EventId always has the same Timestamp value, and therefore adding Timestamp does not change the semantics of the aggregation, it's better to define the view as:
    
    ```kusto
        SourceTable | summarize take_any(*) by EventId, Timestamp
    ```

> [!TIP]
> Late arriving data in a datetime group-by key can have a negative impact on the materialized view's performance. For example, if your materialized view uses `bin(Timestamp, 1d)` as one of its group-by keys, and there are several outliers in the data with very old `Timestamp` values. These outliers may negatively impact the materialized view. We recommend that in the materialized view query you either filter out the outlier records, or normalize these records to the current time.

* **Define a lookback period**: if applicable to your scenario, adding a `lookback` property can significantly improve query performance. For details, see [properties](#properties).  

* **Add columns frequently used for filtering as group-by keys:** materialized view query filters are optimized when filtered by one of the materialized view group-by keys. If you know your query pattern will often filter by a column, which is *immutable* per a unique entity in the materialized view, include it in the materialized view group by keys.

    For example, for a materialized view exposing an `arg_max` by `ResourceId` that will often be filtered by `SubscriptionId`, and assuming a `ResourceId` always belongs to the same `SubscriptionId`.
     Define the materialized view query as:

    ```kusto
    .create materialized-view ArgMaxResourceId on table FactResources
    {
        FactResources | summarize arg_max(Timestamp, *) by SubscriptionId, ResourceId 
    }
    ```

    The definition above is preferable over the following:

    ```kusto
    .create materialized-view ArgMaxResourceId on table FactResources
    {
        FactResources | summarize arg_max(Timestamp, *) by ResourceId 
    }
    ```

* **Use update policies where appropriate:** the materialized view can include transformations, normalizations, and lookups in dimension tables. However, we recommend moving these operations to an [update policy](../updatepolicy.md), and leaving only the aggregation for the materialized view.

    For example, it's better to define the following:
    * **Update policy:**
    
    ```kusto
    .alter-merge table Target policy update 
    @'[{"IsEnabled": true, 
        "Source": "SourceTable", 
        "Query": 
            "SourceTable 
            | extend ResourceId = strcat('subscriptions/', toupper(SubscriptionId), '/', resourceId)", 
            | lookup DimResources on ResourceId
            | mv-expand Events
        "IsTransactional": false}]'  
    ```
    * **Materialized view:**
    
    ```kusto
    .create materialized-view Usage on table Events
    {
        Target 
        | summarize count() by ResourceId 
    }
    ```
    
    Don't include the update policy query as part of the materialized view:
    
    ```kusto
    .create materialized-view Usage on table SourceTable
    {
        SourceTable
        | extend ResourceId = strcat('subscriptions/', toupper(SubscriptionId), '/', resourceId)
        | lookup DimResources on ResourceId
        | mv-expand Events
        | summarize count() by ResourceId
    }
    ```

> [!TIP]
> If you require the best query time performance, but can tolerate some data latency, use the [materialized_view() function](../../query/materialized-view-function.md).

## Backfill a materialized view

When creating a materialized view with the `backfill` property, the materialized view will be created based on the records available in the source table (or a subset of those records, if `effectiveDateTime` is used).

* Behind the scenes, the backfill process splits the data to backfill into multiple batches and executes several ingest operations to backfill the view.
* The process might take a very long while to complete when the number of records in source table is large. The process duration depends on cluster size. Track the progress of the backfill using the [`.show operations`](../operations.md#show-operations) command.
* Transient failures that occur as part of the backfill process are retried. If all retries are exhausted, the command will fail and a manual re-execution of the create command is required.
* Considering the above, it is not recommended to use backfill when number of records in source table exceeds `number-of-nodes X 200 million` (sometimes even less, depending on the complexity of the query). As an alternative, see the [backfill by move extents](#backfill-by-move-extents) option.

* Using the backfill option is not supported for data in cold cache. Increase the hot cache period, if necessary, for the duration of the view creation. This may require scale-out.

* There are a few properties that you can try changing, if you experience failures in view creation:

  * `MaxSourceRecordsForSingleIngest` - by default, the number of source records in each ingest operation, during backfill, is 2 million records per node. You can change this default by setting this property to the desired number of records (the value is the _total_ number of records in each ingest operation). Decreasing this value can be helpful when creation fails on memory limits / query timeouts. Increasing this value can speed up view creation, assuming the cluster is able to execute the aggregation function on more records than the default.

  * `Concurrency` - the ingest operations, running as part of backfill process, run concurrently. By default, concurrency is `min(number_of_nodes * 2, 5)`. You can set this property to increase/decrease concurrency. Increasing this value is advisable only if cluster's CPU is low, as this can have significant impact on cluster's CPU consumption.

  For example, the following command will backfill the materialized view from `2020-01-01`, with max number of records in each ingest operation of `3 million` records, and will execute the ingest operations with concurrency of `2`:
    <!-- csl -->
    ```kusto
    .create async materialized-view with (
            backfill=true,
            effectiveDateTime=datetime(2020-01-01),
            MaxSourceRecordsForSingleIngest=3000000,
            Concurrency=2
        )
        CustomerUsage on table T
    {
        T
        | summarize count(), dcount(User), max(Duration) by Customer, bin(Timestamp, 1d)
    } 
    ```

* If the materialized view includes a *datetime* group-by key, the backfill process supports overriding the [extent creation time](../extents-overview.md#extent-creation-time) based on the *datetime* column. This can be useful, for example, if you would like "older" records to be dropped before recent ones, since the [retention policy](../retentionpolicy.md) is based on the extents creation time. For example, the following backfill will assign creation time based on the `Timestamp` group-by key:

   <!-- csl -->
    ```kusto
    .create async materialized-view with (
            backfill=true,
            UpdateExtentsCreationTime=true
        )
        CustomerUsage on table T
    {
        T
        | summarize count() by Customer, bin(Timestamp, 1d)
    } 
    ```

### Backfill by move extents

This option backfills the materialized view based on an existing table, which isn't necessarily the source table of the materialized view. The backfill is achieved by [moving extents](../move-extents.md) from the specified table into the underlying materialized view table. This implies that:

* The data in the specified table should have same schema as the materialized view schema.
* Records in the specified table are moved to the view as-is and are therefore assumed to be deduped based on the definition of the materialized view.
  * For example, if the materialized view has the following aggregation:

    <!-- csl -->
    ```kusto
    T | summarize arg_max(Timestamp, *) by EventId
    ```
    Then the records in the source table for the move extents operation should already be deduped by EventId.

* Since the operation uses [.move extents](../move-extents.md), the records will be **removed** from specified table during the backfill (moved, not copied).

* The materialized view is backfilled *only* based on the specified table. Materialization of records in the source table of the view will start from view creation time, by default.

* If the source table of the materialized view is continuously ingesting data, creating the view by the *move extents* method might result in some data loss. This is because records ingested into the source table, in the short time between the time of preparing the table to backfill from and the time the view is created, will not be included in the materialized view. To handle this scenario, you can set the `source_ingestion_time_from` property to the start time of the materialized view over the source table. See the last example.

#### Use cases

The backfill-by-move-extents option can be useful in two main scenarios:

* When you already have a table that includes the deduplicated source data for the materialized view, and these records are not needed in this table after view creation, since only the materialized view will be used.

* When the source table of the materialized view is very large and backfilling the view based on the source table doesn't work well due to limitations mentioned above. In this case, you can orchestrate the backfill process yourself into a temp table using [ingest from query commands](../data-ingestion/ingest-from-query.md) and one of the [recommended orchestration tools](../../../tools-integrations-overview.md#orchestration). When the temp table includes all records for the backfill, create the materialized view based on the temp table.

**Examples:**

- In the following example, table `DedupedT` includes a single record per `EventId`, and will be used as the baseline for the materialized view. Only records in `T` that are ingested after the view creation time will be included in the materialized view:
    <!-- csl -->
    ```kusto
    .create async materialized-view with (move_extents_from=DedupedT) MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

- If the `effectiveDateTime` property is specified along with the `move_extents_from` property, only extents in `DedupedT` whose `MaxCreatedOn` is greater than `effectiveDateTime` are included in the backfill (moved to the materialized view).

    <!-- csl -->
    ```kusto
    .create async materialized-view with 
        (move_extents_from=DedupedT, effectiveDateTime=datetime(2019-01-01)) 
        MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

- The following example demonstrates the use of the `source_ingestion_time_from` property in the backfill-by-move-extents option. Using both `source_ingestion_time_from` and `move_extents_from` indicates the materialized view is backfilled from 2 different sources:
   * **The `move_extents_from` table:** `DedupedT` in the example below. This table should include all historical data to backfill. You can optionally use `effectiveDateTime` property to include only extents in `DedupedT` whose `MaxCreatedOn` is greater than `effectiveDateTime`.
   * **The source table of the materialized view:** `T` in the example below. Backfill from this table only includes records whose [ingestion_time()](../../query/ingestiontimefunction.md) is greater than `source_ingestion_time_from`. The `source_ingestion_time_from` property should only be used to handle the possible data loss in the short time between preparing the table to backfill from (`DedupedT`) and the time the view is created. Don't set this property too far in the past as this will start the materialized view with a significant lag, which might be hard to catch up with.

   In the following example, let's assume the current time is `2020-01-01 03:00`. Table `DedupedT` is a deduped table of `T`. It includes all historical data, deduplicated until `2020-01-01 00:00`. The following `create` command uses `DedupedT` for backfilling the materialized view using the *move extents* method and will also include all records in `T` that were ingested since `2020-01-01`:
    
    <!-- csl -->
    ```kusto
    .create async materialized-view with (move_extents_from=DedupedT, source_ingestion_time_from=datetime(2020-01-01)) MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

## Cancel materialized-view creation

Cancel the process of materialized view creation when using the `backfill` option. This action is useful when creation is taking too long and you want to abort it while running.  

> [!WARNING]
> The materialized view can't be restored after running this command.

The creation process can't be aborted immediately. The cancel command signals materialization to stop, and the creation periodically checks if a cancel was requested. The cancel command waits for a maximum period of 10 minutes until the materialized view creation process is canceled, and reports back if cancellation was successful. Even if the cancellation didn't succeed within 10 minutes, and the cancel command reports failure, the materialized view will probably abort itself later in the creation process. The [`.show operations`](../operations.md#show-operations) command indicates if the operation was canceled.

### Syntax

`.cancel` `operation` *operationId*

### Properties

|Property|Type|Description
|----------------|-------|---|
|operationId|Guid|The operation ID returned from the create materialized-view command.|

### Output

|Output parameter |Type |Description
|---|---|---
|OperationId|Guid|The operation ID of the create materialized view command.
|Operation|String|Operation kind.
|StartedOn|datetime|The start time of the create operation.
|CancellationState|string|One of - `Cancelled successfully` (creation was canceled), `Cancellation failed` (wait for cancellation timed out), `Unknown` (view creation is no longer running, but wasn't canceled by this operation).
|ReasonPhrase|string|Reason why cancellation wasn't successful.

### Example

<!-- csl -->
```
.cancel operation c4b29441-4873-4e36-8310-c631c35c916e
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c4b29441-4873-4e36-8310-c631c35c916e|MaterializedViewCreateOrAlter|2020-05-08 19:45:03.9184142|Canceled successfully||

If the cancellation hasn't completed within 10 minutes, `CancellationState` will indicate failure. Creation may then be aborted.
