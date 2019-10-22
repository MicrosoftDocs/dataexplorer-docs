---
title: Query consistency - Azure Data Explorer | Microsoft Docs
description: This article describes Query consistency in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 01/20/2019
---
# Query consistency

Kusto supports two query consistency models: **strong** and **weak**.

Strongly-consistent queries (default) have a "read-my-changes"
guarantee. A client that sends a control command and receives a positive
acknowledgement that the command has completed successfully will be guaranteed
that any query immediately following will observe the results of the command.

Weakly-consistent queries (must be explicitly enabled by the client)
do not make the guarantee. Clients making queries might observe some latency
(usually 1-2 minutes) between changes and queries reflecting
those changes.

The advantage of weakly consistent queries is that it reduces the load on the cluster node that handles database changes. In general, it is recommended that customers first try the strongly consistent model and switch to using
weak consistency if absolutely required.

Switching to weakly consistent queries is done by setting the `queryconsistency`
property when making a [REST API call](../api/rest/request.md). Users of the
Kusto .NET client can also set it in the [Kusto connection string](../api/connection-strings/kusto.md)
or as a flag in the [client request properties](../api/netfx/request-properties.md).