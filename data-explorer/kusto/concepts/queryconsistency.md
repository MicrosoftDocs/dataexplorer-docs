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

Strongly consistent queries (default) have a "read-my-changes" guarantee. 
If you send a control command and receive acknowledgment that the command has completed successfully, then you'll be guaranteed any query immediately following will observe the results of the command.

Weakly consistent queries that must be explicitly enabled by the client,
don't have that guarantee. Clients making queries might observe some latency
(usually 1-2 minutes) between changes and queries reflecting those changes.

The advantage of weakly consistent queries, is that it reduces the load on the cluster node that handles database changes. In general, we recommend that you first try the strongly consistent model. Switch to using weakly consistent queries only if necessary.

To switch to weakly consistent queries, set the `queryconsistency` property when making a [REST API call](../api/rest/request.md). Users of the
.NET client can also set it in the [Kusto connection string](../api/connection-strings/kusto.md) or as a flag in the [client request properties](../api/netfx/request-properties.md).
