---
title: Create materialized view - Azure Data Explorer
description: This article describes how to create materialized views in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# .create materialized-view

A [materialized view](materialized-view-overview.md) is an aggregation query over a source table, representing a single summarize statement.
For general information and guidelines about creating a materialized view, see [create a materialized view](materialized-view-overview.md#create-a-materialized-view).

Requires [Database Admin](../access-control/role-based-authorization.md) permissions.

## .create materialized-view

The materialized view is always based on a single `fact table`, and may also reference one or more [`dimension tables`](../../concepts/fact-and-dimension-tables.md). The source table for the materialized view must be in the same database where the materialized view is defined. The source table must have [IngestionTime policy](../ingestiontimepolicy.md) enabled (the default is enabled) and can't be enabled for [streaming ingestion](../../../ingest-data-streaming.md).

> [!NOTE]
> Cross-cluster/cross-database queries aren't supported.

### Syntax

`.create` [`async`] `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*ViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

### Arguments

|Argument|Type|Description
|----------------|-------|---|
|ViewName|String|Materialized View name. The view name can't conflict with table or function names in same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
|SourceTableName|String|Name of source table that the view is defined on.|
|Query|String|The materialized view query. For more information, see [query considerations](#query-considerations)).|

### Query considerations

The query used in the materialized view argument is limited by the following rules:

The query argument should reference a single fact table that is the source of the materialized view, include a single summarize operator, and one or more aggregation functions aggregated by one or more groups by expressions. The summarize operator must always be the last operator in the query.

The query shouldn't include any operators that depend on `now()` or on `ingestion_time()`. For example, the query shouldn't have `where Timestamp > ago(5d)`. A materialized view with an `arg_max`/`arg_min`/`any` aggregation can't include any of the other supported aggregation functions. A view is either an `arg_max`/`arg_min`/`any` view (those functions can be used together in same view) or any of the other supported functions, but not both in same materialized view. 
    For example, `SourceTable | summarize arg_max(Timestamp, *), count() by Id` isn't supported. 

Composite aggregations are not supported in the materialized view definition. For instance, instead of the following view: `SourceTable | summarize Result=sum(Column1)/sum(Column2) by Id`, define the materialized view as: `SourceTable | summarize a=sum(Column1), b=sum(Column2) by Id`. During view query time, run - `ViewName | project Id, Result=a/b`. The required output of the view, including the calculated column (`a/b`), can be encapsulated in a [stored function](../../query/functions/user-defined-functions.md). Access the stored function instead of accessing the materialized view directly. 


### Properties

The following are supported in the `with(propertyName=propertyValue)` clause. All properties are optional.

|Property|Type|Description
|----------------|-------|---|
|[backfill](#backfill)|bool|Whether to create the view based on all records currently in *SourceTable* (`true`), or to create it "from-now-on" (`false`). Default is `false`.|
|effectiveDateTime|datetime| If specified along with `backfill=true`, creation only backfills with records ingested after the datetime. Backfill must be set to true as well. Expects a datetime literal, for example, `effectiveDateTime=datetime(2019-05-01)`|
|[dimensionTables](#dimension-tables|Array|A comma-separated list of dimension tables in the view.|
|[autoUpdateSchema](auto-update-schema|bool|Whether to auto-update the view on source table changes. Default is `false`.|
|folder|string|The materialized view's folder.|
|docString|string|A string documenting the materialized view|

#### Backfill

When using the `backfill` option, the command must be `async`, and the view won't be available for queries until the creation completes. Depending on the amount of data to backfill, creation with backfill may take a long time. It's intentionally "slow" to make sure it doesn't consume too much of the cluster's resources.

* Track the creation process with the [.show operations](../operations.md#show-operations) command.
* Cancel the creation process with the [.cancel operation](#cancel-materialized-view-creation) command.

#### Dimension tables

 Dimension tables must be explicitly called out in the view properties. 
   * The joins/lookups with dimension tables should be written according to the [query best practices](../../query/best-practices.md). For example, dimension tables should be on the left side of the join (or using lookup).
   * Records in the view's source table (fact table) are materialized once only. A different ingestion latency between the fact table and the dimension table may have an impact on the view results. 
      * For example: Given a view definition that includes an inner join with a dimension table, if at the time of materialization the dimension record for a specific entity was not ingested yet, but it was already ingested to the fact table. This record will be dropped from the view and never reprocessed again. To remedy, assume the join is an outer join. The record from fact table will be processed and added to view with a null value for the dimension table columns. Even if the relevant record is later ingested to the dimension table, those records that have already been added (with null values) to the view won't be processed again. As such their values, in columns from the dimension table, will remain null.

#### Auto update schema
  
The `autoUpdateSchema` option is valid only for views of type `arg_max(Timestamp, *)` / `arg_min(Timestamp, *)` / `any(*)` (only when columns argument is `*`). If this option is set to true, changes to source table will be automatically reflected in the materialized view. Not all changes to source table are supported when using this option. For more information, see [.alter materialized-view](materialized-view-alter.md).

Using `autoUpdateSchema` may lead to data loss when columns in the source table are dropped. There's no way to restore the materialized view's dropped columns. If the view isn't set to `autoUpdateSchema`, and a change is made to the source table which results in a schema change to the materialized view, the view will be automatically disabled. If the issue is fixed, for example by restoring the schema of the source table, the materialized view can be enabled using the [enable materialized view](materialized-view-enable-disable.md) command. This process is common when using an `arg_max(Timestamp, *)` and adding columns to the source table. Avoid the failure by defining the view query as `arg_max(Timestamp, Column1, Column2, ...)` or by using the `autoUpdateSchema` option.  

### Examples

1. Create an empty view that will only materialize records ingested from now on: 

    <!-- csl -->
    ```
    .create materialized-view ArgMax on table T
    {
        T | summarize arg_max(Timestamp, *) by User
    }
    ```
    
1. Create a materialized view with backfill option, using `async`:

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
    

### Supported aggregation functions

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

* Materialized view query filters are optimized when filtered by one of the Materialized View dimensions (aggregation by-clause). If you know your query pattern will often filter by some column, which can be a dimension in the materialized view, include it in the view. For example: For a materialized view exposing an `arg_max` by `ResourceId` that will often be filtered by `SubscriptionId`, the recommendation is as follows:

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

* Don't include transformations, normalizations, and other heavy computations that can be moved to an [update policy](../updatepolicy.md) as part of the materialized view definition. Instead, do all those processes in an update policy, and perform the aggregation only in the materialized view. Use this process for lookup in dimension tables, when applicable.

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

## Cancel materialized-view creation

Cancel the process of materialized view creation when using the `backfill` option. This action is useful when creation is taking too long and you want to abort it while running.  

> [!WARNING]
> The materialized view can't be restored after running this command.

The creation process can't be aborted immediately. The cancel command signals materialization to stop, and the creation periodically checks if cancel was requested. The cancel command waits for a max period of 10 minutes until the materialized view creation process is canceled and reports back if cancellation was successful. Even if cancellation didn't succeed within 10 minutes, and the cancel command reports failure, the materialized view will most probably abort itself later in the creation process. The [.show operations](../operations.md#show-operations) command will indicate if operation was canceled. The `cancel operation` command is only supported for materialized views creation cancellation. and not for canceling any other operations.

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
|ReasonPhrase|string|A reason, if cancellation wasn't successful.

### Example

<!-- csl -->
```
.cancel operation c4b29441-4873-4e36-8310-c631c35c916e
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c4b29441-4873-4e36-8310-c631c35c916e|MaterializedViewCreateOrAlter|2020-05-08 19:45:03.9184142|Canceled successfully||

If the cancellation hasn't completed within 10 minutes, `CancellationState` will indicate failure. Creation may be aborted afterward.
