---
title: Query consistency - Azure Data Explorer
description: This article describes Query consistency in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/22/2023
---
# Maintain data consistency with strong and weak query consistency

Query consistency refers to how queries and updates are synchronized. The objective of query consistency is to ensure accurate and up-to-date results based on data modifications. Queries can coincide with ongoing data updates, which necessitates balancing requirements for performance and data accuracy.

There are two supported modes of query consistency:

* [Strong consistency](#use-cases-for-strong-consistency): Strong consistency ensures immediate access to the most recent updates, such as data appends, deletions, and schema modifications. With strong consistency, query planning stage and the query finalization stage occur on the *database admin node* node, which is also responsible for orchestrating [management commands](../management/index.md) and committing the changes to the database metadata. During periods of high load, the database admin node may become overwhelmed, affecting its availability.

* [Weak consistency](#use-cases-for-weak-consistency): With weak consistency, the query load is distributed among additional nodes in the cluster that can serve as *query heads*. While this reduces the load on the database admin node, it may introduce a delay before query results reflect the latest database updates. Typically, this delay ranges from 1 to 2 minutes.

For example, if 1000 records are ingested each minute into a table in the database, queries over that table running with strong consistency will have access to the most-recently ingested records, whereas queries over that table running with weak consistency may not have access to a few thousands of records from the last few minutes.

> [!NOTE]
> By default, queries run with strong consistency. We recommend only switching to weak consistency when necessary to reduce load on the database admin node.

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

## Query weak consistency policy

The cluster-level [query weak consistency policy](../management/query-weak-consistency-policy.md) controls various parameters related to weak consistency.

For instance, the default behavior is to allow 20% of the nodes in the cluster, with a minimum of 2 nodes and a maximum of 30 nodes, to serve as weakly consistent query heads. In this case, a cluster with 15 nodes could have 3 nodes that serve as weakly consistent query heads. However, you can adjust these parameters in the query weak consistency policy.

The query weak consistency policy also allows you to control the refresh rate of the database metadata on the weakly consistency query heads. By default, these nodes will refresh the latest database metadata every 2 minutes. This process that usually takes up to a few seconds, unless the amount of changes that occur in that period is very high.

We recommend starting with the default values and only adjusting if necessary.

## Weak consistency modes

The following table summarizes the 4 modes of weak query consistency.

| Mode | Description |
|--|--|
| Random| Queries are routed randomly to one of the nodes in the cluster that can serve as a weakly consistent query head.|
| [Affinity by database](#affinity-by-database)| Queries within the same database are routed to the same weakly consistent query head, ensuring consistent execution for that database. |
| [Affinity by query text](#affinity-by-query-text)| Queries with the same query text hash are routed to the same weakly consistent query head, which is beneficial for leveraging query caching. |
| [Affinity by session ID](#affinity-by-session-id)| Queries with the same session ID hash are routed to the same weakly consistent query head, ensuring consistent execution within a session. |

### Affinity by database

The affinity by database mode ensures that queries running against the same database are executed against the same version of the database, although not necessarily the most recent version of the database. This mode is useful when ensuring consistent execution within a specific database is important. However, if there's an imbalance in the number of queries across databases, then this mode may result in uneven load distribution.

### Affinity by query text

The affinity by query text mode is beneficial when queries leverage the [Query results cache](../query/query-results-cache.md). This mode routes repeating queries frequently executed by the same identity to the same query head, allowing them to benefit from cached results and reducing the load on the cluster.

### Affinity by session ID

The affinity by session ID mode ensures that queries belonging to the same user activity or session are executed against the same version of the database, although not necessarily the most recent one. To use this mode, the session ID needs to be explicitly specified in each query's client request properties. This mode is helpful in scenarios where consistent execution within a session is essential.

## How to specify query consistency

Specifying the query consistency mode can be done either by the client sending the request, or using a server side policy. If it isn’t specified by either, the default mode of strong consistency applies.

### Specifying in client request properties
### Specifying in the query consistency policy -- Maybe remove the earlier heading about this policy??

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
