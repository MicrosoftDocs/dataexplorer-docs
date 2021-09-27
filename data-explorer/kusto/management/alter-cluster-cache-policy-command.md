---
title: .alter cluster cache policy command - Azure Data Explorer
description: This article describes the .alter cluster cache policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .alter cluster cache policy

Change the cluster cache policy.  To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority. 

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources. Queries over important data will be faster and resistant to the impact of queries over less important data.
- Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

## Syntax

`.alter` `cluster` *ClusterName* `policy` `caching`

## Arguments

*ClsuterName* - Specify the name of the cluster.

## Example

The following example sets the caching policy to include the last 30 days.

```kusto
.alter cluster MyCluster policy caching hot = 30d
```