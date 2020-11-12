---
title: Query throttling policy- Azure Data Explorer
description: This article describes the query throttling policy in Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: reference
ms.date: 10/05/2020
---
# Query throttling policy

Define the query throttling policy to limit the amount of concurrent queries the cluster is executing at the same time. This policy is a defense mechanism for the cluster to protect it from being overloaded with the higher number of concurrent queries than it can sustain. The policy can be changed at run-time and takes place immediately after the alter policy command completes.

* Use [`.show cluster policy querythrottling`](query-throttling-policy-commands.md#show-cluster-policy-querythrottling) to show the current query throttling policy of a cluster.
* Use [`.alter cluster policy querythrottling`](query-throttling-policy-commands.md#alter-cluster-policy-querythrottling) to set the current query throttling policy of a cluster.
* Use [`.delete cluster policy querythrottling`](query-throttling-policy-commands.md#delete-cluster-policy-querythrottling) to delete current query throttling policy of a cluster.

> [!NOTE]
> Do not change query throttling policy without thorough testing, it can lead to performance degradation if the cluster resources are not scaled as per the load and as a result, queries might start failing. 
