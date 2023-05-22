---
title: Query consistency - Azure Data Explorer
description: This article describes Query consistency in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/22/2023
---
# Maintain data consistency with strong and weak query consistency

Query consistency refers to how queries and updates are synchronized. The objective of query consistency is to deliver query results that are up-to-date while taking into account the needs for both performance and data accuracy.

There are two supported modes of query consistency:

* [Strong consistency](#use-cases-for-strong-consistency): Strong consistency ensures immediate access to the most recent updates, such as data appends, deletions, and schema modifications. With strong consistency, query planning stage and the query finalization stage occur on the *database admin node* node. This node is also responsible for orchestrating [management commands](../management/index.md) and committing the changes to the database metadata. During periods of high load, the database admin node may become overwhelmed, affecting its availability.

* [Weak consistency](#use-cases-for-weak-consistency): With weak consistency, the query load is distributed among other nodes in the cluster that can serve as *query heads*. While this reduces the load on the database admin node, it may introduce a delay before query results reflect the latest database updates. Typically, this delay ranges from 1 to 2 minutes.

For example, if 1000 records are ingested each minute into a table in the database, queries over that table running with strong consistency will have access to the most-recently ingested records, whereas queries over that table running with weak consistency may not have access to a few thousands of records from the last few minutes.

> [!NOTE]
> By default, queries run with strong consistency. We recommend only switching to weak consistency when necessary to reduce load on the database admin node.

## Use cases for strong consistency

If you have a strong dependency on updates that occurred in the database in the last few minutes, use strong consistency.

For example, the following query counts the number of error records in the 5 minutes and triggers an alert if that count is larger than 0. This use case is best handled with strong consistency, since your insights may be altered if you don't have access to records ingested in the past few minutes, as may be the case with weak consistency.

```kusto
my_table
| where timestamp between(ago(5m)..now())
| where level == "error"
| count
```

In addition, strong consistency should be used when database metadata is large. For instance, if there are millions of [data extents](../management/extents-overview.md) in the database, using weak consistency would result in query heads downloading and deserializing extensive metadata artifacts from persistent storage, which may increase the likelihood of transient failures in downloads and related operations.

## Use cases for weak consistency

If you don’t have a strong dependency on updates that occurred in the database in the last few minutes, and you want to reduce the load from the database admin node, use weak consistency.

For example, the following query counts the number of error records per week in the last 90 days. Weak consistency is appropriate in this case, since your insights are unlikely to be impacted if records ingested in the past few minutes are omitted.

```kusto
my_table
| where timestamp between(ago(90d) .. now())
| where level == "error"
| summarize count() by level, startofweek(Timestamp)
```

## Weak consistency modes

The following table summarizes the four modes of weak query consistency.

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

You can specify the query consistency mode by the client sending the request or using a server side policy. If it isn’t specified by either, the default mode of strong consistency applies.

* Client sending the request: Specify the query consistency mode with the `queryconsistency` client request property. This method only affects a specific query and doesn't affect the overall effective consistency mode, which is determined by the default or the server-side policy. For more information, see [client request properties](../api/netfx/request-properties.md).

    For example, set the query consistency mode to weak consistency in a client request property before a specific query.

    ```kusto
    let queryconsistency=weakconsistency;
    // Your query here.
    ```

* Server side policy: Specify the query consistency mode in the `QueryConsistency` property of the query consistency policy at the workload group level. This method eliminates the need for users to specify the consistency mode in their client request properties and allows for enforcing desired consistency modes. For more information, see [Query consistency policy](../management/query-consistency-policy.md).

    For example, set the policy for the default workload group to `Weak`. By setting `IsRelaxable` to `false`, weak consistency is enforced for all queries within that group, preventing the client request properties from overriding the query consistency mode.

    ```kusto
    .alter-merge workload_group default ```
    {
      "QueryConsistencyPolicy": {
         "QueryConsistency": {
            "IsRelaxable": false,
            "Value": "Weak"
         }
      }
    } ```
    ```

## Next steps

* To customize parameters for queries running with weak consistency, use the [Query weak consistency policy](../management/query-weak-consistency-policy.md).
