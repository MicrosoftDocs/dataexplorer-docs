---
title: Kusto update policy - Azure Data Explorer
description: This article describes Update policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 08/04/2020
---
# Update policy overview

The [update policy](./show-table-update-policy-command.md) instructs Azure Data Explorer to automatically append data to a target table whenever new data is inserted into the source table, based on a transformation query that runs on the data inserted into the source table.

:::image type="content" source="images/updatepolicy/update-policy-overview.png" alt-text="Overview of the update policy in Azure Data Explorer.":::

An update policy is useful when one table is the filtered view of another table. For example, the source table can be a high-rate trace table with interesting data formatted as a free-text column. The target table can include only specific kind of trace lines, with a well-structured schema that is a transformation of the
original free-text data by using the [parse operator](../query/parseoperator.md). The target table can have a different schema, retention policy, and so on.

The update policy is subject to the same restrictions and best practices as regular ingestion. The policy scales-out with the size of the cluster, and works more efficiently if ingestions are done in large bulks.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Update policy's query

The update policy query is run in a special mode, in which it's automatically scoped to cover only the newly ingested records, and you can't query the source table's already-ingested data as part of this query. However, data ingested in the "boundary" of transactional update policies does become available for a query in a single transaction. Because the update policy is defined on the destination table, ingesting data into one source table may result in multiple queries being run on that data. The order of execution of multiple update policies is undefined. 

### Query limitations 

* The query can invoke stored functions, but can't include cross-database or cross-cluster queries. 
* A query that is run as part of an update policy doesn't have read access to tables that have the [RestrictedViewAccess policy](restrictedviewaccesspolicy.md) enabled or with a [Row Level Security policy](rowlevelsecuritypolicy.md) enabled.
* When referencing the `Source` table in the `Query` part of the policy, or in functions referenced by the `Query` part:
   * Don't use the qualified name of the table. Instead, use `TableName`. 
   * Don't use `database("DatabaseName").TableName` or `cluster("ClusterName").database("DatabaseName").TableName`.
* For update policy limitations in streaming ingestion, see [streaming ingestion limitations](../../ingest-data-streaming.md#limitations). 

> [!WARNING]
> Defining an incorrect query in the update policy can prevent any data from being ingested into the source table.

## The update policy object

A table may have zero, one, or more update policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined.

|Property |Type |Description  |
|---------|---------|----------------|
|IsEnabled                     |`bool`  |States if update policy is enabled (true) or disabled (false)                                                                                                                               |
|Source                        |`string`|Name of the table that triggers update policy to be invoked                                                                                                                                 |
|Query                         |`string`|A Kusto CSL query that is used to produce the data for the update                                                                                                                           |
|IsTransactional               |`bool`  |States if the update policy is transactional or not (defaults to false). Failure to run a transactional update policy results in the source table not being updated with new data   |
|PropagateIngestionProperties  |`bool`  |States if ingestion properties (extent tags and creation time) specified during the ingestion into the source table, should also apply to the ones in the derived table. This property is ignored in Streaming Ingestion.                |

> [!NOTE]
> In production systems, set the *IsTransactional* property to *true* to ensure that the target table doesn't lose data in transient failures.  

> [!NOTE]
> Cascading updates are allowed (`TableA` → `TableB` → `TableC` → ...).
>
> However, if update policies are defined over multiple tables in a circular manner, the chain of updates is cut. This issue is detected at runtime. Data will be ingested only once to each table in the chain of affected tables.

## Update policy commands

Commands to control the update policy include:

* [`.show table *TableName* policy update`](./show-table-update-policy-command.md#show-update-policy) shows the current update policy of a table.
* [`.alter table *TableName* policy update`](./show-table-update-policy-command.md#alter-update-policy) sets the current update policy of a table.
* [`.alter-merge table *TableName* policy update`](./show-table-update-policy-command.md#alter-merge-table-tablename-policy-update) appends to the current update policy of a table.
* [`.delete table *TableName* policy update`](./show-table-update-policy-command.md#delete-table-tablename-policy-update) deletes the current update policy of a table.

## Update policy is initiated following ingestion

Update policies take effect when data is ingested or moved to (extents are created in) a defined source table using any of the following commands:

* [.ingest (pull)](../management/data-ingestion/ingest-from-storage.md)
* [.ingest (inline)](../management/data-ingestion/ingest-inline.md)
* [.set | .append | .set-or-append | .set-or-replace](../management/data-ingestion/ingest-from-query.md)
* [.move extents](./move-extents.md)
* [.replace extents](./replace-extents.md)
  * The `PropagateIngestionProperties` command only takes effect in ingestion operations. When the update policy is triggered as part of a `.move extents` or `.replace extents` command, this option has no effect.

> [!WARNING]
> * When the update policy is invoked as part of a  `.set-or-replace` command, the default behavior is that data in derived table(s) is replaced in the same way as in the source table. 
>   * This might lead to loss of data in all tables that have an update policy relationship to that table, if the `replace` part takes place.
>   * Consider using `.set-or-append` instead, if this behavior isn't desired.

## Zero retention on source table

Sometimes data is ingested to a source table only as a stepping stone to the target table, and you don't want to keep the raw data in the source table. Set a soft-delete period of `0sec` (or `00:00:00`) in the source table's [retention policy](retentionpolicy.md), and set the update policy as transactional. In this situation: 

* The source data isn't queryable from the source table. 
* The source data isn't persisted to durable storage as part of the ingestion operation. 
* Operational performance will improve. 
* Post-ingestion resources for background grooming operations will be reduced. These operations are done on [extents](../management/extents-overview.md) in the source table.

## Performance impact

Update policies can affect the performance of a Kusto cluster. The update policy affects any ingestion into the source table. Ingestion of a number of data extents is multiplied by the number of target tables. As such, it's important that the `Query` part of the update policy is optimized to work well. You can test an update policy's additional performance impact on an ingestion operation. Invoke the policy on specific and already-existing extents, before creating or altering the policy or function it uses in its `Query` part.

### Evaluate resource usage

Use [`.show queries`](../management/queries.md), to evaluate resource usage (CPU, memory, and so on) in the following scenario:
* The source table name (the `Source` property of the update policy) is `MySourceTable`.
* The `Query` property of the update policy calls a function named `MyFunction()`.

```kusto
// '_extentId' is the ID of a recently created extent, that likely hasn't been merged yet.
let _extentId = toscalar(
    MySourceTable
    | project ExtentId = extent_id(), IngestionTime = ingestion_time()
    | where IngestionTime > ago(10m)
    | top 1 by IngestionTime desc
    | project ExtentId
);
let MySourceTable = 
    MySourceTable
    | where ingestion_time() > ago(10m) and extent_id() == _extentId;
MyFunction
```

## Using the update policy for ETL

We can set an update policy in conjunction with ingestion to help perform ETL efficiently. To speed up ingestion, it is usually recommended that your data be formatted to begin with, with CSV being the preferred choice because of the well defined format and for performance at ingestion time. 

In some cases, however, you have no control over the format of the data, but you still want to store it an efficient manner. In other cases, you may want to enrich the data as it gets ingested into Azure Data Explorer (e.g. by joining the new records with a static dimension table which is already in your database). In such cases, using an update policy to handle ingestion is a very common and useful practice.

We use an update policy in conjunction with a simple function to perform ETL in this example. First, we create two tables:
 
* The source table - This table will have a single string-typed column, into which I will ingest source data, as-is.
* The target table - This table will have my desired schema. This is the table I define the update policy on.

Let's create the source table:

```kusto
.create table MySourceTable (OriginalRecord:string) 
```

Next, create the target table:

```kusto
.create table MyTargetTable (Timestamp:datetime, ThreadId:int, ProcessId:int, TimeSinceStartup:timespan, Message:string)
```

Then create a function to extract data:

```kusto
.create function
 with (docstring = 'Used in the update policy blog post', folder = 'UpdatePolicyFunctions')
 ExtractMyLogs()  
{
    MySourceTable
    | parse OriginalRecord with "[" Timestamp:datetime "] [ThreadId:" ThreadId:int "] [ProcessId:" ProcessId:int "] TimeSinceStartup: " TimeSinceStartup:timespan " Message: " Message:string
    | project-away OriginalRecord
}
```

Now, we will set the update policy to use the source table that we created and move data using the function that we created:

```kusto
.alter table MyTargetTable policy update 
@'[{ "IsEnabled": true, "Source": "MySourceTable", "Query": "ExtractMyLogs()", "IsTransactional": true, "PropagateIngestionProperties": false}]'
```

We defined the update policy as non-trasactional. Defining your update policy as transactional (by having IsTransactional set to true) will help in guaranteeing consistency between the data in the source table and in the target table. Doing so, however, comes with a risk that if your policy is defined incorrectly, data will not be ingested neither to the source table nor to the target table. An example for such a case can be a mismatch between the output schema of your query and the target table, caused, for example, by dropping (accidentally, or not) a column from the target table, or by altering the function so that its output schema is altered as well.

In some cases, depending on which purpose your update policy serves, you may want to retain the data in its original format for other use cases. If you have different flows with different requirements consuming the data in both tables, you may want to consider setting retention policies and/or caching policies on both the source and target tables, and define them according to your use case.

We can define the retention policy on the source table to have 0s as its `SoftDeletePeriod`. This can be achieved by running the following command:

```kusto
 .alter-merge table MySourceTable policy retention softdelete = 0s
```

## Failures

By default, failure to run the update policy doesn't affect the ingestion of data to the source table. However, if the update policy is defined as `IsTransactional`:true, failure to run the policy forces the ingestion of data into the source table to fail. In some cases, ingestion of data into the source table succeeds, but the update policy fails during ingestion to the target table.

Failures that occur while the policies are being updated can be retrieved using the [`.show ingestion failures` command](../management/ingestionfailures.md).
 
```kusto
.show ingestion failures 
| where FailedOn > ago(1hr) and OriginatesFromUpdatePolicy == true
```

### Treatment of failures

#### Non-transactional policy 

The failure is ignored by Kusto. Any retry is the responsibility of the data ingestion process owner.  

#### Transactional policy

The original ingestion operation that triggered the update will also fail. The source table and the database won't be modified with new data.
If the ingestion method is `pull` (Kusto's Data Management service is involved in the ingestion process), there's an automated retry on the entire ingestion operation, orchestrated by Kusto's Data Management service, according to the following logic:
* Retries are done until the earliest between `DataImporterMaximumRetryPeriod` (default = 2 days) and `DataImporterMaximumRetryAttempts` (default = 10) is reached.
* Both of the above settings can be altered in the Data Management service's configuration.
* The backoff period starts at 2 minutes, and grows exponentially (2 -> 4 -> 8 -> 16 ... minutes)

In any other case, any retry is the responsibility of the data owner.