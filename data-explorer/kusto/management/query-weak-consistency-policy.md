---
title: Query weak consistency policy
description: This article describes the query weak consistency policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yabenyaa
ms.service: data-explorer
ms.topic: reference
ms.date: 08/01/2021
---
# Query weak consistency policy

The query weak consistency policy is a cluster-level policy object that configures the [weak consistency](../concepts/queryconsistency.md) service.

## Control commands

* Use [`.show cluster policy query_weak_consistency`](show-query-weak-consistency-policy.md) to show the current query weak consistency policy of the cluster.
* Use [`.alter cluster policy query_weak_consistency`](alter-query-weak-consistency-policy.md) to change the current query weak consistency policy of the cluster.

## The policy object

The query weak consistency policy includes the following properties:

| Property | Description | Values | Default
|---|---|---|---|
| **PercentageOfNodes** | The percentage of nodes in the cluster which execute the query weak consistency service (the selected nodes will execute the weakly consistent queries). |The number is between `1` to `100`, or `-1` for default value (currently `20%`). | Defaults to `-1`.
| **MinimumNumberOfNodes** | Minimum number of nodes which execute the query weak consistency service (will determine the number of nodes in case `PercentageOfNodes`*`#NodesInCluster` is smaller). | A positive integer, or `-1` for default value (currently `0`). | Defaults to `-1`.
|**EnableMetadataPrefetch** | When set to `true`, database metadata will be pre-loaded when the cluster comes up, and reloaded every few minutes, on all weak consistency nodes. When set to `false`, database metadata load will be triggered by queries (on demand), so some queries might be delayed (until the database metadata is pulled from stroage).  Database metadata must be reloaded from storage in order to query the database, when its age is greater than `MaximumLagAllowedInMinutes`. | Defaults to `true`.
|  **MaximumLagAllowedInMinutes** | The maximum duration (in minutes) that weakly consistent metadata is allowed to lag behind.  If metadata is older than this value, the most up-to-date metadata will be pulled from storage (when the database is queried, or periodically if `EnableMetadataPrefech` is enabled). | The number is between `1` to `60`, or `-1` for default value (currently `5` minutes). | Defaults to `-1`.
| **RefreshPeriodInSeconds** | The refresh period (in seconds) to update a database metadata on each weak consistency node. | The number is between `30` to `1800`. |`-1` for default value (currently `120` seconds).

> [!IMPORTANT]
> Prefetch operation requires pulling all databases metadata from Azure storage every few minutes (in all weak consistency nodes). This operation puts a load on the underlying storage resources and has impact on cluster performance.

## Default policy

The following example shows the default policy:

```json
{
  "PercentageOfNodes": -1,
  "MinimumNumberOfNodes": -1,
  "EnableMetadataPrefetch": true,
  "MaximumLagAllowedInMinutes": -1,
  "RefreshPeriodInSeconds": -1
}
```
