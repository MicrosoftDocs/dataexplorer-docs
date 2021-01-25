---
title: Kusto update policy for data added to a source - Azure Data Explorer
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

The [update policy](update-policy.md) instructs Kusto to automatically append data to a target table whenever new data is inserted into the source table, based on a transformation query that runs on the data inserted into the source table.

:::image type="content" source="images/updatepolicy/update-policy-overview.png" alt-text="Overview of the update policy in Azure Data Explorer":::

For example, the policy lets the creation of one table be the filtered view of another table. The new table can have a different schema, retention policy, and so on. 

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
|PropagateIngestionProperties  |`bool`  |States if ingestion properties (extent tags and creation time) specified during the ingestion into the source table, should also apply to the ones in the derived table.                 |

> [!NOTE]
> In production system it is recommended to set the *IsTransactional* property to *true* to ensure that the target table does not lose data in case of transient failures.  

> [!NOTE]
> Cascading updates are allowed (`TableA` → `TableB` → `TableC` → ...).
>
> However, if update policies are defined over multiple tables in a circular manner, the chain of updates is cut. This issue is detected at runtime. Data will be ingested only once to each table in the chain of affected tables.

## Update policy commands

Commands to control the update policy include:

* [`.show table *TableName* policy update`](update-policy.md#show-update-policy) shows the current update policy of a table.
* [`.alter table *TableName* policy update`](update-policy.md#alter-update-policy) sets the current update policy of a table.
* [`.alter-merge table *TableName* policy update`](update-policy.md#alter-merge-table-tablename-policy-update) appends to the current update policy of a table.
* [`.delete table *TableName* policy update`](update-policy.md#delete-table-tablename-policy-update) appends to the current update policy of a table.

## Update policy is initiated following ingestion

Update policies take effect when data is ingested or moved to (extents are created in) a defined source table using any of the following commands:

* [.ingest (pull)](../management/data-ingestion/ingest-from-storage.md)
* [.ingest (inline)](../management/data-ingestion/ingest-inline.md)
* [.set | .append | .set-or-append | .set-or-replace](../management/data-ingestion/ingest-from-query.md)
  * When the update policy is invoked as part of a  `.set-or-replace` command, the default behavior is that data in derived table(s) is replaced in the same way as in the source table.
* [.move extents](./move-extents.md)
* [.replace extents](./replace-extents.md)
  * The `PropagateIngestionProperties` command only takes effect in ingestion operations. When the update policy is triggered as part of a `.move extents` or `.replace extents` command, this option has no effect.

## Regular ingestion using update policy

The update policy will behave like regular ingestion when the following conditions are met:

* The source table is a high-rate trace table with interesting data formatted as a free-text column. 
* The target table on which the update policy is defined accepts only specific trace lines.
* The table has a well-structured schema that is a transformation of the original free-text data created by the [parse operator](../query/parseoperator.md).

## Zero retention on source table

Sometimes data is ingested to a source table only as a stepping stone to the target table, and you don't want to keep the raw data in the source table. Set a soft-delete period of 0 in the source table's [retention policy](retentionpolicy.md), and set the update policy as transactional. In this situation: 

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
.show table MySourceTable extents;
// The following line provides the extent ID for the not-yet-merged extent in the source table which has the most records
let extentId = $command_results | where MaxCreatedOn > ago(1hr) and MinCreatedOn == MaxCreatedOn | top 1 by RowCount desc | project ExtentId;
let MySourceTable = MySourceTable | where extent_id() == toscalar(extentId);
MyFunction()
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
