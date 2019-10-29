---
title: Update policy - Azure Data Explorer | Microsoft Docs
description: This article describes Update policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/18/2019
---
# Update policy

Update policy is a policy set on a table that instructs Kusto to automatically
append data to the table whenever new data is inserted into **another table**
(called the **source table**) by running the update policy's **query** on the
data being inserted into the source table. This allows, for example, the creation
of a one table as the filtered view of another table, possibly with a different
schema, retention policy, etc.

By default, failure to run the update policy doesn't affect the ingestion of
data to the source table. The update policy can also defined as **transactional**,
in which case a failure to run the update policy forces the ingestion of data
to the source table to fail as well. (Care must be used when this is done,
however, as some user errors such as defining an incorrect query in the update
policy might prevent **any** data from being ingested into the source table.)
Data being ingested in the "boundary"
of transactional update policies becomes available for query in a single transaction.

The update policy's query is run in a special mode, in which it "sees" only the
newly ingested data to the source table. It is not possible to query the source
table's already-ingested data as part of this query, as this quickly results
quadratic-time ingestions.

As the update policy is defined on the destination table, ingesting data into one
source table might result in multiple queries being run on that data. The order
of execution of update policies is undefined.

As an example for the user of this mechanism, suppose the source table be a high-rate
trace table with interesting data formatted as a free-text column, while the target
table (the table on which the update policy is defined) accept only specific kind
of trace lines, and with a well-structured schema that is a transformation of the
original free-text data by using Kusto's parse operator.

Update policy behaves similar to regular ingestion, and is subject to the same
restrictions and best practices. For example, it scales-out with the size of
the cluster, and works more efficiently if ingestions are done in large bulks.

In cases where one is not interested in retaining the raw data in the table which is
the source of the update policy, one can set a soft-delete period of 0 in the source
table's [retention policy](retentionpolicy.md), and set the update policy as
transactional. This will cause the source data to never get committed to the source table,
nor would it be persisted as part of the ingestion operation. This will also contribute
to overall better performance of the operation.

## Commands that trigger the update policy

Update policies take effect when data is ingested/moved to (extents are created in) a table using
any of the following commands:

- [.ingest (pull)](../management/data-ingestion/ingest-from-storage.md)
- [.ingest (inline)](../management/data-ingestion/ingest-inline.md)
- [.set/.append/.set-or-append/.set-or-replace](../management/data-ingestion/ingest-from-query.md)
- [.move extents](../management/extents-commands.md#move-extents)
- [.replace extents](../management/extents-commands.md#replace-extents)

## The update policy object

A table may have zero, one, or more update policy objects associated with it.
Each such object is represented as a JSON property bag, with the following properties defined:

|Property                      |Type    |Description                                                                                                                                                                                 |
|------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|IsEnabled                     |`bool`  |States if update policy is enabled (true) or disabled (false)                                                                                                                               |
|Source                        |`string`|Name of the table that triggers update policy to be invoked                                                                                                                                 |
|Query                         |`string`|A Kusto CSL query that is used to produce the data for the update                                                                                                                           |
|IsTransactional               |`bool`  |States if the update policy is transactional or not (defaults to false). Failures to run a transactional update policy result with the source table not being updated with new data as well.|
|PropagateIngestionProperties  |`bool`  |States if ingestion properties (extent tags and creation time) specified for the extents in the source table should apply to the ones in the derived table as well.                         |

**Notes**

* The source table and the table for which the update policy is defined **must be in the same database**.
* The query may **not** include cross-database nor cross-cluster queries.
* The query can invoke stored functions.
* The query is automatically scoped to cover the newly-ingested records only.
* Cascading updates are allowed (TableA --`[update]`--> TableB --`[update]`-->  TableC --`[update]`--> ...)
* In case update policies are defined over multiple tables in a circular manner, this is detected at runtime and the chain of updates is cut
   (meaning, data will be ingested only once to each table in the chain of affected tables).
* When referencing the `Source` table in the `Query` part of the policy (or in Functions referenced by the latter), make sure you **don't** use the qualified name of the table
   (meaning, use `TableName` and not `database("DatabaseName").TableName` nor `cluster("ClusterName").database("DatabaseName").TableName`).
* A query which is run as part of an update policy doesn't have read access to tables which have the [RestrictedViewAccess policy](restrictedviewaccesspolicy.md) enabled.



## Failures

In some cases, ingestion of data into the source table succeeds, but the update policy fails during ingestion to the target table. 

Failures encountered during invocations of update policies can be retrieved using the
[.show ingestion failures command](../management/ingestionfailures.md)
in the following manner:
 
```kusto
.show ingestion failures | where FailedOn > ago(1hr) and OriginatesFromUpdatePolicy == true
```

Failured are treated as follows:

- **Non-transactional policy**: The failure is ignored by Kusto. Any retry is the responsibility of the data owner.  
- **Transactional policy**: The original ingestion operation that triggered the update will fail as well, 
the source table and the database will not be modified with new data.
  - In case the ingestion method is `pull` (i.e. Kusto's Data Management service is involved in the ingestion
  process), there's an automated retry on the entire ingestion operation according, orchestrated by Kusto's Data Management
  service, according to the following logic:
    - Retries are done until reaching the earliest between `DataImporterMaximumRetryPeriod` (default = 2 days) and
    `DataImporterMaximumRetryAttempts` (default = 10).
    - Both the above settings can be altered in the Data Management service's configuration, by KustoOps.
    - The backoff period starts from 2 minutes, and grows exponentially (i.e. 2 -> 4 -> 8 -> 16 ... minutes)
  - In any other case, any retry is the responsibility of the data owner.



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

Defining an update policy can affect the performance of a Kusto cluster, as it affects any ingestion
operation done into the source table. It is highly recommended that the `Query` part of the update
policy is optimized to perform well.
One can test an update policy's additional performance impact on an ingestion operation by invoking it on specific and already-existing extents, before creating or altering the policy and/or a function it uses in its `Query` part.

The following example assumes:

- The source table name (the `Source` property of the update policy) is `MyTable`.
- The `Query` property of the update policy calls a function named `MyFunction()`.

Using [.show queries](../management/queries.md), one can evaluate the resource utilization (e.g. CPU, memory) of
the following query, and/or multiple executions of it.

```kusto
.show table MyTable extents;
// The following line provides the extent ID for the largest and most recent not-yet-merged extent in the source table
let extentId = $command_results | where MaxCreatedOn > ago(1hr) and MinCreatedOn == MaxCreatedOn | top 1 by MaxCreatedOn desc | project ExtentId;
let MyTable = MyTable | where extent_id() == toscalar(extentId);
MyFunction()
```