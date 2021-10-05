---
title: Query consistency - Azure Data Explorer
description: This article describes Query consistency in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 01/20/2019
---
# Query consistency

Kusto supports two query consistency models: **strong** and **weak**.

*Strongly consistent queries* (default) have a "read-my-changes" guarantee. 
If you send a control command and receive acknowledgment that the command has completed successfully, then you'll be guaranteed any query immediately following will observe the results of the command.

*Weakly consistent queries* don't have that guarantee. Clients making queries might observe some latency
(usually 1-2 minutes) between changes and queries reflecting those changes. To change the latency, and control other parameters of the query weak consistency service, see [query weak consistency policy](../management/query-weak-consistency-policy.md).
* The advantage of weakly consistent queries, is that it reduces the load on the cluster node that handles database changes.
* Weakly consistent queries can be affinitized to a specific query head, either by the query text or by the context database name.
  * The advantage of using affinity by query text is when also using the [query results cache](../query/query-results-cache.md).
  * The advantage of using affinity by context database name is to not overload tail nodes with having to frequently load large database metadata.
 
In general, we recommend that you first try the strongly consistent model. Switch to using weakly consistent queries only if necessary.

## Controlling query consistency

* Switching to weakly consistent queries can be done by the client, by setting the `queryconsistency` property when making a [REST API call](../api/rest/request.md).
  * Users of the .NET client can also set it in the [Kusto connection string](../api/connection-strings/kusto.md) or as a flag in the [client request properties](../api/netfx/request-properties.md).
  * Supported values for the client request property are: `strongconsistency`, `weakconsistency`, `affinitizedweakconsistency`, `databaseaffinitizedweakconsistency`.
* Alternatively, query consistency can be controlled by setting a workload group's [Query consistency policy](../management/query-consistency-policy.md).
  * Supported values for the policy setting are: `Strong`, `Weak`, `WeakAffinitizedByQuery`, `WeakAffinitizedByDatabase`.

