---
title: Query consistency - Azure Data Explorer
description: This article describes Query consistency in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/21/2023
---
# Query consistency

There are two supported query consistency modes: strong and weak. By default, queries run with strong consistency.

With strong consistency, the query planning stage and the query finalization stage occur on the same node that's in charge of managing updates in the database. This node is called the *database admin node*. The cluster has a single database admin node. The database admin node is responsible for orchestrating control commands run in the context of databases it manages, and committing the changes to the database metadata. Strong consistency ensures immediate access to the most recent updates made to the database, such as data appends, deletions, and schema modifications. However, during periods of high load, the database admin node can become overwhelmed, affecting its availability.

With weak consistency, the query load is distributed among additional nodes in the cluster that can serve as *query heads*. While this reduces the load on the database admin node, it may introduce a slight delay before query results reflect the latest database updates. Typically, this delay ranges from 1 to 2 minutes.

For example, if 1000 records are ingested each minute into a table in the database, queries over that table running with strong consistency will have access to the most-recently ingested records, whereas queries over that table running with weak consistency may not have access to a few thousands of records from the last few minutes.

> [!NOTE]
> We recommend using the default strong consistency mode and only switching to weak consistency mode when it's necessary to reduce the load on the database admin node.

## Use cases for strong consistency

Strong consistency is best when you have a strong dependency on updates that occurred in the database in the last few minutes.

For example, the following query counts the number of error records in the 5 minutes and triggers an alert if that count is larger than 0. This use case is best handled with strong consistency, since your insights may be significantly altered if you did not have access to records ingested in the past few minutes, as may be the case with weak consistency.

```kusto
my_table
| where timestamp between(ago(5m)..now())
| where level == "error"
| count
```

## Use cases for weak consistency

Weak consistency is best for when you don’t have a strong dependency on updates that occurred in the database in the last few minutes, and you want to reduce the load from the database admin node.

For example, the following query counts the number of error records per week in the last 90 days. Weak consistency is appropriate in this case, since your insights are unlikely to be impacted if records ingested in the past few minutes are omitted.

```kusto
my_table
| where timestamp between(ago(90d) .. now())
| where level == "error"
| summarize count() by level, startofweek(Timestamp)
```

*Weakly consistent queries* don't have that guarantee. Clients making queries might observe some latency
(usually 1-2 minutes) between changes and queries reflecting those changes.

* The advantage of running queries with weak consistency is that it reduces the load on the cluster node that handles database changes.

* Weakly consistent queries execute on a cluster node that is other than the one managing the database. This can be any "random" node in the cluster (the default), or affinitized according to either the query text (*query-affinitized weakly consistent queries*), or the database-in-scope of the query (*database-affinitized weakly consistent queries*).
  * The advantage of using affinity by the query text is improved performance when also using the [query results cache](../query/query-results-cache.md).
  * The advantage of using affinity by the context database name is improved efficiency in the scenario of large clusters (>10 nodes) and many databases (>100).

In general, we recommend that you first try the strongly consistent mode. Switch to using weakly consistent queries only if necessary.

## Controlling query consistency

Before a query starts actual execution, its consistency mode is first determined.

1. The consistency mode can be controlled per-query, by setting the `queryconsistency` [client request property](../api/netfx/request-properties.md).

1. Users of the .NET SDK can also set the query consistency through the [Kusto connection string](../api/connection-strings/kusto.md).
   Doing so affects all queries sent through that connection string (by setting the client request property automatically.)

1. Alternatively, it is possible to control the consistency mode on the server side, by setting a [Query consistency policy](../management/query-consistency-policy.md)
   at the workload group level. Doing so affects all queries sent to the service which are associated with that workload group, so users don't need
   to specify it manually.
   
|Consistency               |Set client request property to      |Set query consistency policy to|
|--------------------------|------------------------------------|-------------------------------|
|Strong                    |`strongconsistency`                 |`Strong`                       |
|Weak (random)             |`weakconsistency`                   |`Weak`                         |
|Weak (query text affinity)|`affinitizedweakconsistency`        |`WeakAffinitizedByQuery`       |
|Weak (database affinity)  |`databaseaffinitizedweakconsistency`|`WeakAffinitizedByDatabase`    |

## Controlling the weak consistency service

The cluster-level [query weak consistency policy](../management/query-weak-consistency-policy.md) provides further control over execution of queries running with *weak* consistency.
