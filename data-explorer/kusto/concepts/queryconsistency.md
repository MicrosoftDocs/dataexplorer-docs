---
title: Query consistency - Azure Data Explorer
description: This article describes Query consistency in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/22/2022
---
# Query consistency

## Consistency modes

Azure Data Explorer supports two query consistency modes: **strong** and **weak**.

*Strongly consistent queries* (default) have a "read-my-changes" guarantee.
If you send a control command and receive acknowledgment that the command has completed successfully, then you'll be guaranteed any query immediately following will observe the results of the command.

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

1. Alternatively, it is possible to control the consistency mode by setting a [Query consistency policy](../management/query-consistency-policy.md)
   at the workload group level. Doing so affects all queries sent to the service which are associated with that workload group, so users don't need
   to specify it manually.
   
1. The [Query weak consistency policy](../management/query-weak-consistency-policy.md) provides further control over the latency of *weakly*-consistent
   queries, as well as other parameters.

|Consistency               |Set client request property to      |Set query consistency policy to|
|--------------------------|------------------------------------|-------------------------------|
|Strong                    |`strongconsistency`                 |`Strong`                       |
|Weak (random)             |`weakconsistency`                   |`Weak`                         |
|Weak (query text affinity)|`affinitizedweakconsistency`        |`WeakAffinitizedByQuery`       |
|Weak (database affinity)  |`databaseaffinitizedweakconsistency`|`WeakAffinitizedByDatabase`    |
