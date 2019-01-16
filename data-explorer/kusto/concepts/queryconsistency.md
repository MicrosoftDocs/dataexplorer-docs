---
title: Query Consistency - Azure Data Explorer | Microsoft Docs
description: This article describes Query Consistency in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# Query Consistency

Kusto supports two query consistency models: **strong** and **weak**.

Strongly-consistent queries (which are the default) have a "read-my-changes"
guarantee; a client that sends a control command and receives a positive
acknowledgement that the command has completed successfully will be guaranteed
that any query immediately following will observe the results of the command.

Weakly-consistent queries (which must be explicitly enabled by the client)
do not make that guarantee; clients making queries might observe some latency
(on the order of 1-2 minutes usually) between changes and queries reflecting
those changes.

The advantage of weakly consistent queries is that it reduces the load on the cluster node that handles database changes. In general, it is recommended that customers first try the strongly consistent model and only switch to using
weak consistency if absolutely required.

Switching to weakly consistent queries is done by setting the `queryconsistency`
property when making a [REST API call](../api/rest/request.md). Users of the
Kusto .NET client can also set it in the [Kusto connection string](../api/connection-strings/kusto.md)
or as a flag in the [client request properties](../api/netfx/request-properties.md).