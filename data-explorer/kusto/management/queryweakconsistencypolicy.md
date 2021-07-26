---
title: Kusto query weak consistency policy management
description: This article describes query weak consistency policy management in Azure Data Explorer.
services: data-explorer
author: yahav
ms.author: yabenyaa
ms.reviewer: a
ms.service: data-explorer
ms.topic: reference
ms.date: 07/19/2021
---
# Query weak consistency policy

The query weak consistency policy is a cluster-level policy object to configure the [weak consistency](../concepts/queryconsistency.md) service.

## The policy object

A retention policy includes the following properties:
* **PercentageOfNodes**:
    * The percentage of nodes in the cluster which execute the weak consistency queries.
    * An integer between `1` to `100`, or `-1` for default value (currently `20%`).
    * Defaults to `-1.
* **MinimumNumberOfNodes**:
    * Minimum number of nodes which execute the weak consistency service (will determine the number of nodes in case `PercentageOfNodes`*`#NodesInCluster` is smaller).
    * A positive integer, or `-1` for default value (currently `0`).
    * Defaults to `-1`.
* **EnableMetadataPrefetch**:
    * When set to `true`, database metadata will be pre-loaded when the cluster comes up, and reloaded every few minutes, on all weak consistency nodes.
    * When set to `false`, database metadata load will be triggered by queries (on demand), so some queries might be delayed (until the database metadata is pulled from stroage).
    * Database metadata needs to be reloaded from storage when its age is greater than `MaximumLagAllowedInMinutes`.
    * Defaults to `true`.
    * **WARNING**: Prefetch operation requires pulling all databases metadata from Azure storage every few minutes (in all weak consistency nodes), this puts load on the underlying storage resources and has impact on cluster performance.
* **MaximumLagAllowedInMinutes**:
    * The maximum duration (in minutes) that weakly consistent metadata is allowed to lag behind. 
    * If metadata is older than this value, the most up-to-date metadata will be pulled from storage (triggered when there is a query to the database, or periodically if `EnableMetadataPrefech` is enabled.
    * An integer between `1` to `60`, or `-1` for default value (currently `5` minutes).
    * Defaults to `-1`.
* **RefreshPeriodInSeconds**:
    * The refresh period (in seconds) to update a database metadata on each weak consistency node
    * The number is between `30` to `1800`, or -1 for default value (currently 120 seconds).
    
## .alter cluster policy query_weak_consistency

This command sets the query weak consistency policy.

**Syntax**

* `.alter` `cluster` `policy` `query_weak_consistency` @'{ ... query weak consistency policy JSON representation ... }'

* `.alter-merge` `cluster` `policy` `query_weak_consistency` @'{ ... query weak consistency policy partial-JSON representation  ... }'


**Returns**

The command sets the cluster query weak consistency policy (overriding any current
policy defined, if any) and then returns the updated policy.

**Examples**

<!-- csl -->
```
.alter cluster policy query_weak_consistency @'{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}||Cluster

<!-- csl -->
```
.alter-merge cluster policy query_weak_consistency @'{"PercentageOfNodes": 40}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 40, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}||Cluster
