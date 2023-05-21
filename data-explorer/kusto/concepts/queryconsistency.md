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

In addition, strong consistency should be used when database metadata is very large. For instance, if there are millions of [data extents](../management/extents-overview.md) in the database. If weak consistency is used in this case, then weakly consistent query heads would spend resources on frequently downloading and deserializing large metadata artifacts from persistent storage, which would increase the potential for transient failures in these downloads and other operations running against the same persistent storage.

## Use cases for weak consistency

Weak consistency is best for when you don’t have a strong dependency on updates that occurred in the database in the last few minutes, and you want to reduce the load from the database admin node.

For example, the following query counts the number of error records per week in the last 90 days. Weak consistency is appropriate in this case, since your insights are unlikely to be impacted if records ingested in the past few minutes are omitted.

```kusto
my_table
| where timestamp between(ago(90d) .. now())
| where level == "error"
| summarize count() by level, startofweek(Timestamp)
```

## Weak consistency modes

There are 4 modes of weak query consistency:

| Mode | Description |
|--|--|
| Random| Queries are routed randomly to one of the nodes in the cluster that can serve as a weakly consistent query head.|
| Affinitized by database| All queries that run in the context of the same database get routed to the same weakly consistent query head. |
| Affinitized by query text| All queries that have the same hash for their query text get routed to the same weakly consistent query head. |
| Affinitized by session ID| All queries that have the same hash for their session ID (provided separately, explained below) get routed to the same weakly consistent query head. |

### Affinity by database

This mode of weak consistency can be helpful if it is important that queries running against the same database will all get executed against the same (though, not most recent) version of the database.

If, however, there’s an imbalance in the amount of queries running against databases in the cluster (e.g. 70% of queries are run in the context of a specific database), then the query head serving queries for that database will be more loaded than other query heads in the cluster, which is suboptimal.

### Affinity by query text

This mode of weak consistency can be helpful when queries are also leveraging the Query results cache. This way, repeating weakly consistent queries that are run frequently by the same identity leverages results cached from recent executions of the same query on the same query head, and reduce the load on the cluster.

### Affinity by session ID

This mode of weak consistency can be helpful if it is important that queries that belong to the same user activity/session will all get executed against the same (though, not most recent) version of the database.

It does, however, require you to explicitly specify the session ID as part of each query’s client request properties.

## Weakly consistent query heads

The default behavior is to allow 20% of the nodes in the cluster, with a minimum of 2 nodes, and a maximum of 30 nodes to serve as weakly consistent query heads.

For example, for a cluster with 15 nodes, 3 nodes can serve as weakly consistent query heads. These parameters can be controlled using the cluster-level [Query weak consistency policy](../management/query-weak-consistency-policy.md).

The same policy allows controlling the refresh rate of the database metadata on the weakly consistency query heads. By default, these nodes will refresh the latest database metadata every 2 minutes. This process that usually takes up to a few seconds, unless the amount of changes that occur in that period is very high.

We recommend starting with the default values and only adjusting if necessary.

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
