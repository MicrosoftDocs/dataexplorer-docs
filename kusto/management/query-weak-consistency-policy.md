---
title: Query weak consistency policy
description: Learn how to use the query weak consistency policy to configure the weak consistency service.
ms.reviewer: yabenyaa
ms.topic: reference
ms.date: 05/24/2023
---
# Query weak consistency policy

The query weak consistency policy is a cluster-level policy object that configures the [weak consistency](../concepts/query-consistency.md) service.

## Management commands

* Use [`.show cluster policy query_weak_consistency`](show-query-weak-consistency-policy.md) to show the current query weak consistency policy of the cluster.
* Use [`.alter cluster policy query_weak_consistency`](alter-query-weak-consistency-policy.md) to change the current query weak consistency policy of the cluster.

## The policy object

The query weak consistency policy includes the following properties:

| Property | Description | Values | Default
|---|---|---|---|
| **PercentageOfNodes** | The percentage of nodes in the cluster that execute the query weak consistency service (the selected nodes will execute the weakly consistent queries). | An integer between `1` to `100`, or `-1` for default value (which is currently `20%`). | `-1`
| **MinimumNumberOfNodes** | Minimum number of nodes that execute the query weak consistency service (will determine the number of nodes in case `PercentageOfNodes`*`#NodesInCluster` is smaller). | A positive integer, or `-1` for default value (which is currently `2`). Smaller or equal to `MaximumNumberOfNodes`. | `-1`
| **MaximumNumberOfNodes** | Maximum number of nodes that execute the query weak consistency service (will determine the number of nodes in case `PercentageOfNodes`*`#NodesInCluster` is greater). | A positive integer, or `-1` for default value (which is currently `30`). Greater or equal to `MinimumNumberOfNodes`.  | `-1`
| **SuperSlackerNumberOfNodesThreshold** | If the **total** number of nodes in the cluster exceeds this number, **nodes that execute the weak consistency service** will become 'super slacker', meaning they won't have data on them (in order to reduce load). **See Warning below.** | A positive integer that is greater than or equal to `4`, or `-1` for default value (currently no threshold - weak consistency nodes won't become 'super slacker'). | `-1`
|**EnableMetadataPrefetch** | When set to `true`, database metadata will be pre-loaded when the cluster comes up, and reloaded every few minutes, on all weak consistency nodes. When set to `false`, database metadata load will be triggered by queries (on demand), so some queries might be delayed (until the database metadata is pulled from storage).  Database metadata must be reloaded from storage to query the database, when its age is greater than `MaximumLagAllowedInMinutes`.  **See Warning and Important below.** | `true` or `false` | `false`
|  **MaximumLagAllowedInMinutes** | The maximum duration (in minutes) that weakly consistent metadata is allowed to lag behind.  If metadata is older than this value, the most up-to-date metadata will be pulled from storage (when the database is queried, or periodically if `EnableMetadataPrefech` is enabled). **See Warning below.** | An integer between `1` to `60`, or `-1` for default value (currently `5` minutes). | `-1`
| **RefreshPeriodInSeconds** | The refresh period (in seconds) to update a database metadata on each weak consistency node. **See Warning below.** | An integer between `30` to `1800`, or `-1` for default value (currently `120` seconds).| `-1`

> [!IMPORTANT]
> Prefetch operation requires pulling all databases metadata from Azure storage every few minutes (in all weak consistency nodes). This operation puts a load on the underlying storage resources and has impact on cluster performance.

> [!WARNING]
> Consult with the support team before altering this property.

## Default policy

The default policy is:

```json
{
  "PercentageOfNodes": -1,
  "MinimumNumberOfNodes": -1,
  "MaximumNumberOfNodes": -1,
  "SuperSlackerNumberOfNodesThreshold": -1,
  "EnableMetadataPrefetch": false,
  "MaximumLagAllowedInMinutes": -1,
  "RefreshPeriodInSeconds": -1
}
```
