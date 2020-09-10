---
title: Create or alter materialized view - Azure Data Explorer
description: This article describes how to create or alter materialized views in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Create or alter materialized view

A materialized view definition is an aggregation query over a source table (*single* summarize statement).

There are several limitations for what can be defined in the query. See remarks in the [create materialized-view section](#create-materialized-view) for details.

* The materialized view is always based on a single `fact table`, and may also reference one or more `dimension tables`.
See [this article](../../concepts/fact-and-dimension-tables.md) for information about the differences between the two,
 and why it is important in the context of the materialized view.
 If the materialized view includes joins, make sure you understand the related limitations documented in the [create materialized view section](#create-materialized-view).

* There are two possible ways to create a materialized view (noted by the *backfill* option in the create command):
    * **Create based on the existing records in the source table:** in this case,
      creation may take a long while to complete (depending on the number of records in the source table),
    and view will not be available for queries until completion.
    When using this option, create command must be `async` and execution can be monitored using the [.show operations](../operations.md#show-operations) command.
    
    > [!WARNING]
    > * Using the backfill option is not supported for data in cold cache. Increase the hot cache period,
        if necessary, for the creation of the view (may require scale-out).
    > * Using the backfill option may take a very long while to complete, for large source tables. If it
    >   transiently fails while running, it will **not** be automatically retried (a re-execution of the
    >   create command is required).
    
    * **Create the materialized view from now onwards:** in this case, the materialized view is created empty,
    and will only include records ingested after view creation. Creation of this kind returns immediately
 (does not require `async`), and view will be immediately available for query.

* Once created, the materialized views can be altered using the [alter materialized-view](#alter-materialized-view)
command. Not all changes are supported, the [section below](#alter-materialized-view) describes the supported changes.

* The materialized view derives the database retention policy, by default. The policy can be changed, using commands documented in the [Materialized view policies control commands](materialized-view-policies.md#control-commands) article.

## .create materialized-view

### Syntax

`.create` [`async`] `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

### Arguments

|Argument|Type|Description
|----------------|-------|---|
|ViewName|String|Materialized View name. See restrictions in notes below.|
|SourceTableName|String|Name of source table which the view is defined on.|
|Query|String|The Materialized View query.|

### Properties

The following are supported in the `with(propertyName=propertyValue)` clause (all are optional). 

|Property|Type|Description
|----------------|-------|---|
|backfill|bool|Whether to create the view based on all records currently in *SourceTable* (true), or to create it "from-now-on" (false). See above for further details. Default is false.|
|effectiveDateTime|datetime|If specified along with backfill=true, creation will only backfill with records ingested after this datetime. Backfill must be set to true as well. Expects a datetime literal, for example, `effectiveDateTime=datetime(2019-05-01)`|
|dimensionTables|Array|A comma-separated list of dimension tables in the view (see below).|
|autoUpdateSchema|bool|Whether to auto-update the view on source table changes (see below). Default is false.|
|folder|string|The materialized view's folder.|
|docString|string|A string documenting the materialized view|

### Examples

To create an empty view, which will only materialize records ingested from now on: 

<!-- csl -->
```
.create materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```

A Materialized View with backfill option, using `async`:

<!-- csl -->
```
.create async materialized-view with (backfill=true, docString="Customer telemetry") CustomerUsage on table T
{
    T 
    | extend Day = bin(Timestamp, 1d)
    | summarize count(), dcount(User), max(Duration) by Customer, Day 
} 
```

Materialized view with backfill and effectiveDateTime - view is created based on records from this datetime only:

<!-- csl -->
```
.create async materialized-view with (backfill=true, effectiveDateTime=datetime(2019-01-01)) CustomerUsage on table T 
{
    T 
    | extend Day = bin(Timestamp, 1d)
    | summarize count(), dcount(User), max(Duration) by Customer, Day
} 
```

Definition can include additional operators *before* the `summarize` statement (as long as the `summarize` is the last one):

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

Materialized views that join with a dimension table (carefully read limitations below):

<!-- csl -->
```
.create materialized-view EnrichedArgMax on table T with (dimensionTable = ['DimUsers'])
{
    T
    | lookup DimUsers on User  
    | summarize arg_max(Timestamp, *) by User 
}

.create materialized-view EnrichedArgMax on table T with (dimensionTable = ['DimUsers'])
{
    DimUsers | project User, Age, Address
    | join kind=rightouter hint.strategy=broadcast T on User
    | summarize arg_max(Timestamp, *) by User 
}
```

## Remarks

* Requires [Database Admin](../access-control/role-based-authorization.md)
permissions. The principal creating the view automatically becomes the admin of the view (see
[materialized view principals](materialized-view-principals.md)).
* View name cannot conflict with table / function names in same database.
* View name must adhere to the [Identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules).
* See the [table below](#supported-aggregation-functions) for the supported aggregation functions.
* The query should reference a *single* *fact* table which is the
source of the materialized view, and include a *single*
summarize operator and one or more aggregation functions aggregated by one or more group by expressions.
The summarize operator must always be the *last* operator in the query.
   * The source table must be in the same database where the materialized view is defined. 
    Cross-cluster/cross-database queries are not supported.
   * The source table *must* have [IngestionTime policy](../ingestiontimepolicy.md) enabled
    (the default is enabled) and *cannot* be enabled for [streaming ingestion](../../../ingest-data-streaming.md).
* A materialized view with an `arg_max`/`arg_min`/`any` aggregation cannot include
neither of the other supported aggregation functions. A view is either an `arg_max`/`arg_min`/`any` view (those functions can be used together in same view) or any of the other supported functions, but not both in same materialized view (for example,
     `SourceTable | summarize arg_max(Timestamp, *), count() by Id` is not supported).
* *Composite* aggregations are currently not supported in the materialized view definition. For instance, instead of the following view:
`SourceTable | summarize Result=sum(Column1)/sum(Column2) by Id`, you must define
the Materialized View as: `SourceTable | summarize a=sum(Column1), b=sum(Column2) by Id`,
 and during view query time, run - `ViewName | project Id, Result=a/b`. 
The required output of the view, including the calculated column (`a/b`), 
can be encapsulated in a [stored function](../../query/functions/user-defined-functions.md),
 which users will access instead of accessing the materialized view directly.
* The query should *not* include any operators that depend on `now()` or on `ingestion_time()`. 
For instance, query should not have `where Timestamp > ago(5d)`.
Limiting the period of time covered by the view should be done using the retention policy on the materialized view. 
* **Join / lookups with dimension tables:**
    * Dimension tables *must* be explicitly called out in the view properties. 
    * The joins/lookups with dimension tables should be written according to the [Query best practices](../../query/best-practices.md) - for example, dimension tables should be on the left side of the join (or using lookup).
    * Records in the view's source table (fact table) are materialized once only - a different ingestion latency between
      the fact table and the dimension table may have an impact on the view results. 
      For instance, given a view definition that includes an *inner* join with a dimension table - if at the time of
      materialization, the dimension record for a specific entity was not ingested yet (whereas it
      was already ingested to the fact table), that record will be dropped from the view and never reprocessed again. Alternatively, assume the join is an *outer* join - the record from fact table will be processed and added to view with a null value for the dimension table columns.
      Even if the relevant record is later ingested to the dimension table, those records that have already been 
      added (with null values) to the view will not be processed again, and therefore their values
     (in columns from dimension table) will remain null.

* **Backfill:** when using the `backfill` option, command *must* be `async` and view will not be available for queries until the creation completes.
    * Depending on the amount of data to backfill, creation with backfill may take a long time.
    It's intentionally "slow" to make sure it doesn't consume too much of the cluster's resources.
    * You can track the creation process using the [.show operations](../operations.md#show-operations) command.
    * Canceling the creation process is possible using the [.cancel operation](#cancel-materialized-view-creation) command.

* **Auto update:** the `autoUpdateSchema` option is valid only for views of type `arg_max(Timestamp, *)` / `arg_min(Timestamp, *)` / 
`any(*)` (only when columns argument is `*`). In case this option is set to true, changes to source table will be
automatically reflected in the materialized view. Not all changes to source table are supported when using
this option, see the [.alter materialized-view command](#alter-materialized-view) for details.

 > [!WARNING] 
 > * Using `autoUpdateSchema` may lead to data loss, when columns in the source table are dropped. There is no 
 > way to restore the materialized view's dropped columns in case this occurs.
 > * If the view is _not_ set to `autoUpdateSchema` and a change is made to the source table, which results in a
 > schema change to the materialized view, the view will be automatically disabled. If the issue is fixed (e.g.,
 > by restoring the schema of the source table), the materialized view can be enabled using the
 > [enable materialized view](materialized-view-enable-disable.md) command.
 > This can be common when using an `arg_max(Timestamp, *)` and adding columns to the source table. Defining the
 > view query as `arg_max(Timestamp, Column1, Column2, ...)` (or using the `autoUpdateSchema` option) will avoid the failure.  

* Once the view is created, materialization constantly happens in the background, as needed. Use the [Show materialized-view](materialized-view-show-commands.md#show-materialized-view)command to retrieve information about the health of the view.

### Supported aggregation functions:

The following aggregation functions are supported:
* `count`
* `countif`
* `dcount`
* `dcountif`
* `min`
* `max`
* `avg`
* `avgif`
* `sum`
* `arg_max`
* `arg_min`
* `any`
* `hll`
* `make_set`
* `make_list`
* `percentile`
* `percentiles`

### Performance tips

* Materialized view query filters are optimized when filtered by one of the Materialized View dimensions (aggregation by-clause). 
If you know your query pattern will often filter by some column, which can be a dimension in the materialized view,
 include it in the view. For instance, for a materialized view exposing an arg_max by ResourceId that will often be
 filtered by `SubscriptionId`, the recommendation is as follows:

 <table>
    <th>Do
    <th>Don't do
        <tr style="vertical-align: top;">
            <td>
                <pre>
.create materialized-view ArgMaxResourceId on table FactResources
{
    FactResources | summarize arg_max(Timestamp, *) by SubscriptionId, ResouceId 
}
</pre>
            </td>
            <td>
                <pre>
.create materialized-view ArgMaxResourceId on table FactResources
{
    FactResources | summarize arg_max(Timestamp, *) by ResouceId 
}
</pre>
</table>

* Don't include transformations, normalizations, and other heavy computations that can be moved to an [update policy](../updatepolicy.md)
as part of the materialized view definition. Instead, do all those in an update policy, and perform the aggregation only in the 
materialized view (same goes for lookup in dimension tables, when applicable).

<table>
    <th>Do
    <th>Don't do
        <tr style="vertical-align: top;">
            <td>
                <pre>
// Update policy                   
.alter-merge table Target policy update 
@'[{"IsEnabled": true, 
    "Source": "SourceTable", 
    "Query": 
        "SourceTable 
        | extend ResourceId = strcat('subscriptions/', toupper(SubscriptionId), '/', resourceId)", 
    "IsTransactional": false}]'  
    
// Materialized View
.create materialized-view Usage on table Events
{
&nbsp;     Target 
&nbsp;     | summarize count() by ResourceId 
}
            </pre>
        </td>
        <td>
            <pre>
.create materialized-view Usage on table SourceTable
{
&nbsp;     SourceTable 
&nbsp;     | extend ResourceId = strcat('subscriptions/', toupper(SubscriptionId), '/', resourceId)
&nbsp;     | summarize count() by ResourceId
}
</pre>
</table>

* If you require the best query time performance, but can sacrifice some data freshness, use the [materialized_view() function](../../query/materializedviewfunction.md).

## .alter materialized-view

### Syntax

`.alter` `materialized-view`  
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]  
*ViewName* `on table` *SourceTableName*  
`{`  
    &nbsp;&nbsp;&nbsp;&nbsp;*Query*  
`}`

### Arguments

|Argument|Type|Description
|----------------|-------|---|
|ViewName|String|Materialized View name. See restrictions in notes below.|
|SourceTableName|String|Name of source table which the view is defined on.|
|Query|String|The Materialized View query.|

### Properties

The `dimensionTables` is the only supported property in materialized-view alter command. Property should
be used in case query references dimension tables (see definition in the [.create materialized-view](#create-materialized-view) command).

### Notes

* Requires [Database Admin](../access-control/role-based-authorization.md)
permissions, or an admin of the materialized view (see
[Materialized view principals](materialized-view-principals.md)).
* Altering the materialized view can be used for changing the query of the materialized view,
while still preserving the existing data in the view. Applicable use cases include:
    * Adding aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by
altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
    * Changing operators other than the summarize operator - e.g., filtering out some records by altering 
`T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`. 
    * Altering with no change to the query, due to a change in source table - for example, assume a view of
`T | summarize arg_max(Timestamp, *) by Id`, which is not set to `autoUpdateSchema` (see[.create materialized-view](#create-materialized-view) command).
    If a column is added/removed to the source table of the view, view will be automatically disabled.
    Executing the alter command, with the exact same query, will change the materialized view's schema to 
    align with new table schema. The view still needs to be explicitly enabled following the change,
    using the [enable materialized view](materialized-view-enable-disable.md) command.

* Altering the materialized view has *no* impact on existing data.
    * New columns will receive nulls for all existing records (until records ingested post the alter command modify the null values).
        * For example: if a view of `T | summarize count() by bin(Timestamp, 1d)` is altered to
        `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`, then for a particular `Timestamp=T` for which records
        have already been processed prior to altering the view, the `sum` column will contain partial data (including
        only records processed after the alter execution).

    * Adding filters to the query (example #2 above) does not change records which have already been materialized.
    The filter will only apply to newly ingested records.
        * For example, per example #2 above, `User == 'someone'` will still be part of the view, until
          dropped by retention policy or other.

* *Only* adding/removing columns to/from the view is supported as part of materialized view alter. Specifically:
    * Changing column type is *not* supported.
    * Renaming columns is *not* supported (altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id`
    will drop column `count_` and create a new column `Count`, which will initially contain nulls only).

* **Changes to the materialized view group by expressions are not supported.**

 > [!WARNING]
 > Be extra cautious when altering a materialized view. Using it incorrectly may lead to data loss.

## Cancel materialized-view creation

This command can be used to cancel the process of Materialized View creation, when using  the `backfill` option, 
since creation may take a long while, and user may want to abort it while running.  

* **The materialized view cannot be restored after running the command.**
* The creation process cannot be aborted *immediately*. The cancel command signals it to stop, and the creation periodically 
checks if cancel was requested. The cancel command waits for a max period of 10 minutes until the materialized view creation process is
 canceled and reports back if cancellation was successful. Even if cancellation did not succeed within 10 minutes, and the cancel 
 command reports failure, the materialized view will most probably abort itself later in the creation process. The [.show operations](../operations.md#show-operations) command will indicate if operation was canceled.
* The `cancel operation` command is only supported for materialized views creation cancellation (not for canceling any
other operations).

### Syntax

`.cancel` `operation` *operationId*

### Properties

|Property|Type|Description
|----------------|-------|---|
|operationId|Guid|The operation id returned from the create materialized-view command.|

### Output

|Output parameter |Type |Description
|---|---|---
|OperationId|Guid|The operation id of the create materialized view command.
|Operation|String|Operation kind.
|StartedOn|datetime|The start time of the create operation.
|CancellationState|string|One of - `Cancelled successfully` (creation was canceled), `Cancellation failed` (wait for cancelation timed out), `Unknown` (view creation is no longer running, but wasn't canceled by this operation).
|ReasonPhrase|string|A reason, if cancellation was not successful.

### Example

<!-- csl -->
```
.cancel operation c4b29441-4873-4e36-8310-c631c35c916e
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c4b29441-4873-4e36-8310-c631c35c916e|MaterializedViewCreateOrAlter|2020-05-08 19:45:03.9184142|Cancelled successfully||

If cancellation didn't complete within 10 minutes, CancellationState would indicate failure (and creation may still be aborted afterwards).