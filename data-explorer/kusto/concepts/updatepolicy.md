---
title: Update policy - Azure Data Explorer | Microsoft Docs
description: This article describes Update policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/10/2020
---
# Update policy

Update policy is set on a **target table** that instructs Kusto to automatically
append data to it whenever new data is inserted into the **source table**. The update policy's **query** runs on the
data inserted into the source table. This allows, for example, the creation
of one table as the filtered view of another table, possibly with a different
schema, retention policy, and so on.

By default, failure to run the update policy doesn't affect the ingestion of
data to the source table. If the update policy is defined as **transactional**, failure to run the update policy forces the ingestion of data
into the source table to fail as well. (Care must be used when this is done because some user errors, such as defining an incorrect query in the update
policy, might prevent **any** data from being ingested into the source table.)
Data ingested in the "boundary"
of transactional update policies becomes available for a query in a single transaction.

The update policy's query is run in a special mode, in which it "sees" only the
newly ingested data to the source table. It isn't possible to query the source
table's already-ingested data as part of this query. Doing so quickly results in
quadratic-time ingestions.

Because the update policy is defined on the destination table, ingesting data into one
source table might result in multiple queries being run on that data. The order
of execution of update policies is undefined.

For example, assume that the source table is a high-rate
trace table with interesting data formatted as a free-text column. Also suppose that the target
table (on which the update policy is defined) accepts only specific trace lines, and
with a well-structured schema that is a transformation of the original free-text data
by using Kusto's [parse operator](../query/parseoperator.md).

Update policy behaves similarly to regular ingestion and is subject to the same
restrictions and best practices. For example, it scales-out with the size of
the cluster, and works more efficiently if ingestions are done in large bulks.

## Commands that trigger the update policy

Update policies take effect when data is ingested or moved to (extents are created in) a table using
any of the following commands:

* [.ingest (pull)](../management/data-ingestion/ingest-from-storage.md)
* [.ingest (inline)](../management/data-ingestion/ingest-inline.md)
* [.set | .append | .set-or-append | .set-or-replace](../management/data-ingestion/ingest-from-query.md)
* [.move extents](../management/extents-commands.md#move-extents)
* [.replace extents](../management/extents-commands.md#replace-extents)

## The update policy object

A table may have zero, one, or more update policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined:

|Property                      |Type    |Description                                                                                                                                                                                 |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|IsEnabled                     |`bool`  |States if update policy is enabled (true) or disabled (false)                                                                                                                               |
|Source                        |`string`|Name of the table that triggers update policy to be invoked                                                                                                                                 |
|Query                         |`string`|A Kusto CSL query that is used to produce the data for the update                                                                                                                           |
|IsTransactional               |`bool`  |States if the update policy is transactional or not (defaults to false). Failure to run a transactional update policy result in the source table not being updated with new data as well.   |
|PropagateIngestionProperties  |`bool`  |States if ingestion properties (extent tags and creation time) specified during the ingestion into the  source table should apply to the ones in the derived table as well.                 |

> [!NOTE]
>
> * The source table and the table for which the update policy is defined **must be in the same database**.
> * The query may **not** include cross-database nor cross-cluster queries.
> * The query can invoke stored functions.
> * The query is automatically scoped to cover the newly-ingested records only.
> * Cascading updates are allowed (TableA --`[update]`--> TableB --`[update]`-->  TableC --`[update]`--> ...)
> * In case update policies are defined over multiple tables in a circular manner, this is detected at runtime and the chain of updates is cut
   (meaning, data will be ingested only once to each table in the chain of affected tables).
> * When referencing the `Source` table in the `Query` part of the policy (or in Functions referenced by the latter), make sure you **don't** use the qualified name of the table
   (meaning, use `TableName` and **not** `database("DatabaseName").TableName` nor `cluster("ClusterName").database("DatabaseName").TableName`).
> * The update policy's query can't reference any table with a [Row Level Security policy](./rowlevelsecuritypolicy.md) which is enabled.
> * A query which is run as part of an update policy does **not** have read access to tables which have the [RestrictedViewAccess policy](restrictedviewaccesspolicy.md) enabled.
> * `PropagateIngestionProperties` only takes effect in ingestion operations. When the update policy is triggered as part of a `.move extents` or `.replace extents` command, this
  option has **no** effect.
> * When the update policy is invoked as part of a `.set-or-replace` command, default behavior is that data in derived table(s) is also replaced, as it is in the source table.

## Retention policy on the source table

So as not to retain the raw data in the source table, you can set a soft-delete period of 0 in the source
table's [retention policy](retentionpolicy.md), while setting the update policy as transactional.

This will result with:
* The source data not being queryable from the source table.
* The source data not being persisted to durable storage as part of the ingestion operation.
* Improvement in performance of the operation.
* Reduction of resources utilized post-ingestion, for background grooming operations done on [extents](../management/extents-overview.md)
  in the source table.

## Failures

In some cases, ingestion of data into the source table succeeds, but the update policy fails during ingestion to the target table.

Failures encountered while the policies are being updated can be retrieved using the
[.show ingestion failures command](../management/ingestionfailures.md), as follows:
 
```
.show ingestion failures 
| where FailedOn > ago(1hr) and OriginatesFromUpdatePolicy == true
```

Failures are treated as follows:

* **Non-transactional policy**: The failure is ignored by Kusto. Any retry is the responsibility of the data owner.  
* **Transactional policy**: The original ingestion operation that triggered the update will fail as well. The source table and the database will not be modified with new data.
  * In case the ingestion method is `pull` (Kusto's Data Management service is involved in the ingestion
  process), there's an automated retry on the entire ingestion operation, orchestrated by Kusto's Data Management
  service, according to the following logic:
    * Retries are done until reaching the earliest between `DataImporterMaximumRetryPeriod` (default = 2 days) and
    `DataImporterMaximumRetryAttempts` (default = 10).
    * Both the above settings can be altered in the Data Management service's configuration, by KustoOps.
    * The backoff period starts from 2 minutes, and grows exponentially (2 -> 4 -> 8 -> 16 ... minutes)
  * In any other case, any retry is the responsibility of the data owner.



## Control Commands

* Use [.show table TABLE policy update](../management/update-policy.md#show-update-policy)
  to show the current update policy of a table.
* Use [.alter table TABLE policy update](../management/update-policy.md#alter-update-policy)
  to set the current update policy of a table.
* Use [.alter-merge table TABLE policy update](../management/update-policy.md#alter-merge-table-table-policy-update)
  to append to the current update policy of a table.
* Use [.delete table TABLE policy update](../management/update-policy.md#delete-table-table-policy-update)
  to append to the current update policy of a table.

## Testing an update policy's performance impact

Defining an update policy can affect the performance of a Kusto cluster because it affects any ingestion into the source table. It is highly recommended that the `Query` part of the update
policy is optimized to perform well.
You can test an update policy's additional performance impact on an ingestion operation by invoking it on specific and already-existing extents, before creating or altering the policy and/or a function it uses in its `Query` part.

The following example assumes:

* The source table name (the `Source` property of the update policy) is `MySourceTable`.
* The `Query` property of the update policy calls a function named `MyFunction()`.

Using [.show queries](../management/queries.md), you can evaluate resource usage (CPU, memory, etc.) of
the following query, and/or multiple executions of it.

```
.show table MySourceTable extents;
// The following line provides the extent ID for the not-yet-merged extent in the source table which has the most records
let extentId = $command_results | where MaxCreatedOn > ago(1hr) and MinCreatedOn == MaxCreatedOn | top 1 by RowCount desc | project ExtentId;
let MySourceTable = MySourceTable | where extent_id() == toscalar(extentId);
MyFunction()
```