---
title: Query throttling policy- Azure Data Explorer
description: This article describes the query throttling policy in Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: reference
ms.date: 04/11/2020
---
# Query throttling policy

Define the query throttling policy to limit the amount of concurrent queries the cluster is executing at the same time. The policy can be changed at run-time and takes place immediately after the alter policy command completes.

* Use [`.show cluster policy querythrottling`](query-throttling-policy-commands.md#show-cluster-policy-querythrottling) to show the current query throttling policy of a cluster.
* Use [`.alter cluster policy querythrottling`](query-throttling-policy-commands.md#alter-cluster-policy-querythrottling) to set the current query throttling policy of a cluster.
* Use [`.delete cluster policy querythrottling`](query-throttling-policy-commands.md#delete-cluster-policy-querythrottling) to delete current query throttling policy of a cluster.

> [!NOTE]
> If you don't define a query throttling policy, a high number of concurrent queries may lead to cluster inaccessibility or performance degradation.
