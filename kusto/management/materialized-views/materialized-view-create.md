---
title:  Create materialized view
description:  This article describes how to create materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/22/2023
---

# .create materialized-view

A [materialized view](materialized-view-overview.md) is an aggregation query over a source table. It represents a single `summarize` statement.

There are two possible ways to create a materialized view, as noted by the *backfill* option in the command:

**Create the materialized view from now onward:**

* The materialized view is created empty. It includes only records ingested after view creation. Creation of this kind returns immediately, and the view is immediately available for query.

**Create the materialized view based on existing records in the source table:**

* See [Backfill a materialized view](#backfill-a-materialized-view).
* Creation might take a long while to complete, depending on the number of records in the source table. The view won't be available for queries until backfill is complete.
* When you're using this option, the create command must be `async`. You can monitor execution by using the [`.show operations`](../show-operations.md) command.
* You can cancel the backfill process by using the [`.cancel operation`](#cancel-materialized-view-creation) command.

> [!IMPORTANT]
> On large source tables, the backfill option might take a long time to complete. If this process transiently fails while running, it won't be automatically retried. You must then re-execute the create command. For more information, see [Backfill a materialized view](#backfill-a-materialized-view).

## Permissions

This command requires [Database Admin](../../access-control/role-based-access-control.md) permissions. The creator of the materialized view becomes the admin of it.

## Syntax

`.create` [`async`] [`ifnotexists`] `materialized-view` [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] *MaterializedViewName* `on table` *SourceTableName* `{` *Query* `}`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                            | Type   | Required | Description                                                                                                                                                                                                                          |
|---------------------------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *PropertyName*, *PropertyValue* | `string` |          | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties).                                                                                                                        |
| *MaterializedViewName*          | `string` |  :heavy_check_mark:  | Name of the materialized view. The view name can't conflict with table or function names in the same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
| *SourceTableName*               | `string` |  :heavy_check_mark:  | Name of source table on which the view is defined.                                                                                                                                                                                   |
| *Query*                         | `string` |  :heavy_check_mark:  | Query definition of the materialized view. For more information and limitations, see [Query parameter](#query-parameter) section.                                                                                                                                                                                                      |

> [!NOTE]
> If the materialized view already exists:
>
> * If the `ifnotexists` flag is specified, the command is ignored. No change is applied, even if the new definition doesn't match the existing definition.
> * If the `ifnotexists` flag isn't specified, an error is returned.
> * To alter an existing materialized view, use the [.alter materialized-view](materialized-view-alter.md) command.

## Supported properties

The following properties are supported in the `with` `(`*PropertyName* `=` *PropertyValue*`)` clause. All properties are optional.

[!INCLUDE [materialized-view-create-properties](../../includes/materialized-view-create-properties.md)]

> [!WARNING]
>
> * The system will automatically disable a materialized view if changes to the source table of the materialized view, or changes in data, lead to incompatibility between the materialized view query and the expected materialized view schema.
> * To avoid this error, the materialized view query must be deterministic. For example, the [bag_unpack](../../query/bag-unpack-plugin.md) or [pivot](../../query/pivot-plugin.md) plugin results in a non-deterministic schema.
> * When you're using an `arg_max(Timestamp, *)` aggregation and when `autoUpdateSchema` is false, changes to the source table can also lead to schema mismatches. Avoid this failure by defining the view query as `arg_max(Timestamp, Column1, Column2, ...)`, or by using the `autoUpdateSchema` option.
> * Using `autoUpdateSchema` might lead to irreversible data loss when columns in the source table are dropped.
> * Monitor automatic disabling of materialized views by using the [MaterializedViewResult metric](materialized-views-monitoring.md#materializedviewresult-metric).
> * After you fix incompatibility issues, you should explicitly re-enable the view by using the [enable materialized view](materialized-view-enable-disable.md) command.

### Create materialized view over materialized view

You can create a materialized view over another materialized view only when the source materialized view is a `take_any(*)` aggregation (deduplication). For more information, see [Materialized view over materialized view](materialized-view-overview.md#materialized-view-over-materialized-view) and [Examples](#examples).

**Syntax:**

`.create` [`async`] [`ifnotexists`] `materialized-view` [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] *MaterializedViewName* `on materialized-view` *SourceMaterializedViewName* `{` *Query* `}`

**Parameters:**

| Name                            | Type   | Required | Description                                                                                                                                                                                                                          |
|---------------------------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *PropertyName*, *PropertyValue* | `string` |          | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties).                                                                                                                        |
| *MaterializedViewName*          | `string` |  :heavy_check_mark:  | Name of the materialized view. The view name can't conflict with table or function names in the same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
| *SourceMaterializedViewName*    | `string` |  :heavy_check_mark:  | Name of source materialized view on which the view is defined.                                                                                                                                                                       |
| *Query*                         | `string` |  :heavy_check_mark:  | Query definition of the materialized view.                                                                                                                                                                                           |

## Examples

* Create an empty `arg_max` view that will materialize only records ingested from now on:

    <!-- csl -->
    ```kusto
    .create materialized-view ArgMax on table T
    {
        T | summarize arg_max(Timestamp, *) by User
    }
    ```

* Create a materialized view for daily aggregates with the backfill option, by using `async`:

    <!-- csl -->
    ```kusto
    .create async materialized-view with (backfill=true, docString="Customer telemetry") CustomerUsage on table T
    {
        T 
        | extend Day = bin(Timestamp, 1d)
        | summarize count(), dcount(User), max(Duration) by Customer, Day 
    } 
    ```

* Create a materialized view with `backfill` and `effectiveDateTime`. The view is created based on records from the datetime only.

    <!-- csl -->
    ```kusto
    .create async materialized-view with (backfill=true, effectiveDateTime=datetime(2019-01-01)) CustomerUsage on table T 
    {
        T 
        | extend Day = bin(Timestamp, 1d)
        | summarize count(), dcount(User), max(Duration) by Customer, Day
    } 
    ```

* Create a materialized view that deduplicates the source table, based on the `EventId` column, by using a lookback of 6 hours. Records will be deduplicated against only records ingested 6 hours before current records.

    <!-- csl -->
    ```kusto
    .create materialized-view with(lookback=6h) DeduplicatedTable on table T
    {
        T
        | summarize take_any(*) by EventId
    }
    ```

* Create a downsampling materialized view that's based on the previous `DeduplicatedTable` materialized view:

    <!-- csl -->
    ```kusto
    .create materialized-view DailyUsage on materialized-view DeduplicatedTable
    {
        DeduplicatedTable
        | summarize count(), dcount(User) by Day=bin(Timestamp, 1d)
    }
    ```

* The definition can include additional operators before the `summarize` statement, as long as `summarize` is the last one:

    <!-- csl -->
    ```kusto
    .create materialized-view CustomerUsage on table T 
    {
        T 
        | where Customer in ("Customer1", "Customer2", "CustomerN")
        | parse Url with "https://contoso.com/" Api "/" *
        | extend Month = startofmonth(Timestamp)
        | summarize count(), dcount(User), max(Duration) by Customer, Api, Month
    }
    ```

* Here are materialized views that join with a dimension table:

    <!-- csl -->
    ```kusto
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

## Remarks

### Query parameter

The following rules limit the query used in the materialized view Query parameter:

* The query should reference a single fact table that is the source of the materialized view. It should include a single `summarize` operator, and one or more [aggregation functions](#supported-aggregation-functions) aggregated by one or more groups by expressions. The `summarize` operator must always be the last operator in the query.
  
  A materialized view that includes only a single `arg_max`/`arg_min`/`take_any` aggregation might perform better than a materialized view that includes these aggregations along with other aggregations (such as `count`/`dcount`/`avg`). This is because some optimizations are relevant only to these kinds of materialized views. They don't apply when the view includes mixed aggregation functions (where *mixed* means both `arg_max`/`arg_min`/`take_any` and other aggregations in the same view).

* The query shouldn't include any operators that depend on `now()`. For example, the query shouldn't have `where Timestamp > ago(5d)`. Use the retention policy on the materialized view to limit the period of time that the view covers.

* The following operators are not supported in the materialized view query: [`sort`](../../query/sort-operator.md), [`top-nested`](../../query/top-nested-operator.md), [`top`](../../query/top-operator.md), [`partition`](../../query/partition-operator.md), [`serialize`](../../query/serialize-operator.md).

* Composite aggregations are not supported in the definition of the materialized view. For instance, instead of using `SourceTableName | summarize Result=sum(Column1)/sum(Column2) by Id`, define the materialized view as: `SourceTableName | summarize a=sum(Column1), b=sum(Column2) by Id`. During view query time, run `MaterializedViewName | project Id, Result=a/b`. The required output of the view, including the calculated column (`a/b`), can be encapsulated in a [stored function](../../query/functions/user-defined-functions.md). Access the stored function instead of accessing the materialized view directly.

* Cross-cluster and cross-database queries aren't supported.

* References to [external_table()](../../query/external-table-function.md) and [externaldata](../../query/externaldata-operator.md) aren't supported.

* The materialized view query can't include any callouts that require impersonation. Specifically, all [query connectivity plugins](../../query/azure-digital-twins-query-request-plugin.md) that use impersonation aren't allowed.

* In addition to the source table of the view, the query is allowed to reference one or more [dimension tables](../../concepts/fact-and-dimension-tables.md). Dimension tables must be explicitly called out in the view properties. It's important to understand the following behavior when you're joining with dimension tables:

  * Records in the view's source table (the fact table) are materialized only once. Updates to the dimension tables don't have any impact on records that have already been processed from the fact table.
  * A different ingestion latency between the fact table and the dimension table might affect the view results.

    **Example**: A view definition includes an inner join with a dimension table. At the time of materialization, the dimension record was not fully ingested, but it was already ingested into the fact table. This record will be dropped from the view and never processed again.

    Similarly, if the join is an outer join, the record from fact table will be processed and added to view with a null value for the dimension table columns. Records that have already been added (with null values) to the view won't be processed again. Their values, in columns from the dimension table, will remain null.

### Supported aggregation functions

The following aggregation functions are supported:

* [`count`](../../query/count-aggregation-function.md)
* [`countif`](../../query/countif-aggregation-function.md)
* [`dcount`](../../query/dcount-aggfunction.md)
* [`dcountif`](../../query/dcountif-aggregation-function.md)
* [`min`](../../query/min-aggregation-function.md)
* [`max`](../../query/max-aggregation-function.md)
* [`avg`](../../query/avg-aggregation-function.md)
* [`avgif`](../../query/avgif-aggregation-function.md)
* [`sum`](../../query/sum-aggregation-function.md)
* [`sumif`](../../query/sumif-aggregation-function.md)
* [`arg_max`](../../query/arg-max-aggregation-function.md)
* [`arg_min`](../../query/arg-min-aggregation-function.md)
* [`take_any`](../../query/take-any-aggregation-function.md)
* [`take_anyif`](../../query/take-anyif-aggregation-function.md)
* [`hll`](../../query/hll-aggregation-function.md)
* [`make_set`](../../query/make-set-aggregation-function.md)
* [`make_list`](../../query/make-list-aggregation-function.md)
* [`make_bag`](../../query/make-bag-aggregation-function.md)
* [`percentile`, `percentiles`](../../query/percentiles-aggregation-function.md)
* [`tdigest`](../../query/tdigest-aggregation-function.md)

### Performance tips

* **Use a datetime group-by key**: Materialized views that have a datetime column as one of their group-by keys are more efficient than those that don't. The reason is that some optimizations can be applied only when there's a datetime group-by key. If adding a datetime group-by key doesn't change the semantics of your aggregation, we recommend that you add it. You can do this only if the datetime column is *immutable* for each unique entity.

  For example, in the following aggregation:

  ```kusto
      SourceTable | summarize take_any(*) by EventId
  ```

  If `EventId` always has the same `Timestamp` value, and therefore adding `Timestamp` doesn't change the semantics of the aggregation, it's better to define the view as:

  ```kusto
      SourceTable | summarize take_any(*) by EventId, Timestamp
  ```

  > [!TIP]
  > Late-arriving data in a datetime group-by key can have a negative impact on the materialized view's performance. For example, assume that a materialized view uses `bin(Timestamp, 1d)` as one of its group-by keys, and several outliers in the data have very old `Timestamp` values. These outliers might negatively affect the materialized view.
  >
  > We recommend that in the materialized view query, you either filter out the outlier records or normalize these records to the current time.

* **Define a lookback period**: If applicable to your scenario, adding a `lookback` property can significantly improve query performance. For details, see [Supported properties](#supported-properties).  

* **Add columns frequently used for filtering as group-by keys**: Materialized view queries are optimized when they're filtered by one of the materialized view's group-by keys. If you know that your query pattern will often filter by a column that's immutable according to a unique entity in the materialized view, include it in the materialized view's group-by keys.

    For example, a materialized view exposes `arg_max` by a `ResourceId` value that will often be filtered by `SubscriptionId`. Assuming that a `ResourceId` value always belongs to the same `SubscriptionId` value, define the materialized view query as:

    ```kusto
    .create materialized-view ArgMaxResourceId on table FactResources
    {
        FactResources | summarize arg_max(Timestamp, *) by SubscriptionId, ResourceId 
    }
    ```

    The preceding definition is preferable over the following:

    ```kusto
    .create materialized-view ArgMaxResourceId on table FactResources
    {
        FactResources | summarize arg_max(Timestamp, *) by ResourceId 
    }
    ```

* **Use update policies where appropriate**: The materialized view can include transformations, normalizations, and lookups in dimension tables. However, we recommend that you move these operations to an [update policy](../update-policy.md). Leave only the aggregation for the materialized view.

    For example, it's better to define the following update policy:

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

    And define the following materialized view:

    ```kusto
    .create materialized-view Usage on table Events
    {
        Target 
        | summarize count() by ResourceId 
    }
    ```

    The alternative, of including the update policy as part of the materialized view query, might perform worse and therefore not recommended:

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
> If you require the best query time performance, but you can tolerate some data latency, use the [materialized_view() function](../../query/materialized-view-function.md).

### Backfill a materialized view

When you're creating a materialized view by using the `backfill` property, the materialized view will be created based on the records available in the source table. Or it will be created based on a subset of those records, if you use `effectiveDateTime`.

Behind the scenes, the backfill process splits the data to backfill into multiple batches and executes several ingest operations to backfill the view. The process might take a long while to complete when the number of records in source table is large. The process duration depends on cluster size. Track the progress of the backfill by using the [`.show operations`](../show-operations.md) command.

Transient failures that occur as part of the backfill process are retried. If all retries are exhausted, the command will fail and require a manual re-execution of the create command.

We don't recommend that you use backfill when the number of records in the source table exceeds `number-of-nodes X 200 million` (sometimes even less, depending on the complexity of the query). An alternative is the [backfill by move extents](#backfill-by-move-extents) option.

Using the backfill option is not supported for data in a cold cache. Increase the hot cache period, if necessary, for the duration of the view creation. This might require scale-out.

If you experience failures in view creation, try changing these properties:

* `MaxSourceRecordsForSingleIngest`: By default, the number of source records in each ingest operation during backfill is 2 million per node. You can change this default by setting this property to the desired number of records. (The value is the *total* number of records in each ingest operation.)

  Decreasing this value can be helpful when creation fails on memory limits or query timeouts. Increasing this value can speed up view creation, assuming that the cluster can execute the aggregation function on more records than the default.

* `Concurrency`: The ingest operations, running as part of the backfill process, run concurrently. By default, concurrency is `min(number_of_nodes * 2, 5)`. You can set this property to increase or decrease concurrency. We recommend increasing this value only if the cluster's CPU is low, because the increase can significantly affect the cluster's CPU consumption.

For example, the following command will backfill the materialized view from `2020-01-01`. The maximum number of records in each ingest operation is 3 million. The command will execute the ingest operations with concurrency of `2`.

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

If the materialized view includes a datetime group-by key, the backfill process supports overriding the [extent creation time](../extents-overview.md#extent-creation-time) based on the datetime column. This can be useful, for example, if you want older records to be dropped before recent ones, because the [retention policy](../retention-policy.md) is based on the extent creation time. The `updateExtentsCreationTime` property is only supported if the view includes a datetime group-by key which uses the `bin()` function. For example, the following backfill will assign creation time based on the `Timestamp` group-by key:

<!-- csl -->
```kusto
.create async materialized-view with (
        backfill=true,
        updateExtentsCreationTime=true
    )
    CustomerUsage on table T
{
    T
    | summarize count() by Customer, bin(Timestamp, 1d)
} 
```

### Backfill by move extents

The option of backfilling by move extents backfills the materialized view based on an existing table, which isn't necessarily the source table of the materialized view. You achieve the backfill by [moving extents](../move-extents.md) from the specified table into the underlying materialized view table. This process implies that:

* The data in the specified table should have the same schema as the materialized view schema.
* Records in the specified table are moved to the view as is. They're assumed to be deduped based on the definition of the materialized view.
  
For example, if the materialized view has the following aggregation:

<!-- csl -->
```kusto
T | summarize arg_max(Timestamp, *) by EventId
```

Then the records in the source table for the move extents operation should already be deduped by `EventID`.

Because the operation uses [.move extents](../move-extents.md), the records will be *removed* from the specified table during the backfill (moved, not copied).

Backfill by move extents is not supported for all [aggregation functions supported in materialized views](#supported-aggregation-functions). It will fail for aggregations such as `avg()`, `dcount()`, in which the underlying data stored in the view is different than the aggregation itself.

The materialized view is backfilled *only* based on the specified table. Materialization of records in the source table of the view will start from view creation time, by default.

If the source table of the materialized view is continuously ingesting data, creating the view by using move extents might result in some data loss. This is because records ingested into the source table, in the short time between the time of preparing the table to backfill from and the time that the view is created, won't be included in the materialized view. To handle this scenario, you can set the `source_ingestion_time_from` property to the start time of the materialized view over the source table.

#### Use cases

The option of backfilling by move extents can be useful in two main scenarios:

* When you already have a table that includes the deduplicated source data for the materialized view, and you don't need these records in this table after view creation because you're using only the materialized view.

* When the source table of the materialized view is very large, and backfilling the view based on the source table doesn't work well because of the limitations mentioned earlier. In this case, you can orchestrate the backfill process yourself into a temporary table by using [ingest from query commands](../data-ingestion/ingest-from-query.md) and one of the [recommended orchestration tools](../../../tools-integrations-overview.md#orchestration). When the temporary table includes all records for the backfill, create the materialized view based on that table.

**Examples:**

* In the following example, table `DeduplicatedTable` includes a single record per `EventId` instance and will be used as the baseline for the materialized view. Only records in `T` that are ingested after the view creation time will be included in the materialized view.

    <!-- csl -->
    ```kusto
    .create async materialized-view with (move_extents_from=DeduplicatedTable) MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

* If the `effectiveDateTime` property is specified along with the `move_extents_from` property, only extents in `DeduplicatedTable` whose `MaxCreatedOn` value is greater than `effectiveDateTime` are included in the backfill (moved to the materialized view):

    <!-- csl -->
    ```kusto
    .create async materialized-view with 
        (move_extents_from=DeduplicatedTable, effectiveDateTime=datetime(2019-01-01)) 
        MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

* The following example demonstrates the use of the `source_ingestion_time_from` property in the option of backfilling by move extents. Using both `source_ingestion_time_from` and `move_extents_from` indicates that the materialized view is backfilled from two sources:

  * **The `move_extents_from` table**: `DeduplicatedTable` in the following example. This table should include all historical data to backfill. You can optionally use the `effectiveDateTime` property to include only extents in `DeduplicatedTable` whose `MaxCreatedOn` value is greater than `effectiveDateTime`.
  * **The source table of the materialized view**: `T` in the following example. Backfill from this table includes only records whose [ingestion_time()](../../query/ingestion-time-function.md) value is greater than `source_ingestion_time_from`.

     The `source_ingestion_time_from` property should be used only to handle the possible data loss in the short time between preparing the table to backfill from (`DeduplicatedTable`) and the time that the view is created. Don't set this property too far in the past. That would start the materialized view with a significant lag, which might be hard to catch up with.

   In the following example, assume that the current time is `2020-01-01 03:00`. Table `DeduplicatedTable` is a deduped table of `T`. It includes all historical data, deduplicated until `2020-01-01 00:00`. The `create` command uses `DeduplicatedTable` for backfilling the materialized view by using move extents. The `create` command also includes all records in `T` that were ingested since `2020-01-01`.

    <!-- csl -->
    ```kusto
    .create async materialized-view with (move_extents_from=DeduplicatedTable, source_ingestion_time_from=datetime(2020-01-01)) MV on table T
    {
        T
        | summarize arg_max(Timestamp, *) by EventId
    } 
    ```

### Cancel materialized view creation

You can cancel the process of materialized view creation when you're using the backfill option. This action is useful when creation is taking too long and you want to stop it while it's running.  

> [!WARNING]
> The materialized view can't be restored after you run this command.

The creation process can't be canceled immediately. The cancel command signals materialization to stop, and the creation periodically checks if a cancel was requested. The cancel command waits for a maximum period of 10 minutes until the materialized view creation process is canceled, and it reports back if cancellation was successful.

Even if the cancellation doesn't succeed within 10 minutes, and the cancel command reports failure, the materialized view will probably cancel itself later in the creation process. The [`.show operations`](../show-operations.md) command indicates if the operation was canceled.

If the operation is no longer in progress when the `.cancel operation` command is issued, the command will report an error saying so.

#### Syntax

`.cancel operation` *operationId*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Parameters

| Name          | Type | Required | Description                                                                   |
|---------------|------|----------|-------------------------------------------------------------------------------|
| `operationId` | `guid` |  :heavy_check_mark:  | The operation ID returned from the `.create async materialized-view` command. |

#### Output

| Name              | Type     | Description
|-------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OperationId       | `guid` |The operation ID of the `.create materialized-view` command.                                                                                                                                            |
| Operation         | `string` |The type of operation.                                                                                                                                                                                  |
| StartedOn         | `datetime` |The start time of the create operation.                                                                                                                                                                 |
| CancellationState | `string` |One of: `Canceled successfully` (creation was canceled), `Cancellation failed` (wait for cancellation timed out), `Unknown` (view creation is no longer running but wasn't canceled by this operation). |
| ReasonPhrase      | `string` |The reason why cancellation wasn't successful.                                                                                                                                                          |

#### Examples

<!-- csl -->
```kusto
.cancel operation c4b29441-4873-4e36-8310-c631c35c916e
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|`c4b29441-4873-4e36-8310-c631c35c916e`|`MaterializedViewCreateOrAlter`|`2020-05-08 19:45:03.9184142`|`Canceled successfully`||

If the cancellation hasn't finished within 10 minutes, `CancellationState` will indicate failure. Creation can then be canceled.
