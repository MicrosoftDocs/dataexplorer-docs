---
title: .alter cluster policy query_weak_consistency - Azure Data Explorer
description: This article describes '.alter cluster policy query_weak_consistency' in Azure Data Explorer.
services: data-explorer
author: yahav
ms.author: yahavx-ms
ms.reviewer: ?
ms.service: data-explorer
ms.topic: reference
ms.date: 07/19/2021
---

# Query weak consistency policy

The query weak consistency policy is a cluster-level policy object to configure the weak consistency service.

## .show cluster policy query_weak_consistency

This command returns the query weak consistency policy of the cluster.

**Syntax**

* `.show` `cluster` `policy` `query_weak_consistency`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - QueryWeakConsistencyPolicy
|EntityName|`string`|Empty                         
|Policy    |`string`|A JSON object that defines the query weak consistency policy, formatted as [query weak consistency policy object](#query-weak-consistency-policy-object)

**Example**

<!-- csl -->
```
.show cluster policy query_weak_consistency 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 20,"EnableMetadataPrefetch": false}

## Query weak consistency policy object


|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|PercentageOfNodes |`int`|States the number of nodes (%) which execute the weak consistency service (weak consistency queries will be sent to those nodes). The number is between 0 to 100, or -1 for default value (currently 20%).
|MinimumNumberOfNodes |`int`|Minimum number of nodes which execute the weak consistency service. If `PercentageOfNodes`*`#OfNodesInCluster` is smaller than that, this will determine the number of nodes. The number is 0 or greater, or -1 for default value (currently 0).
|EnableMetadataPrefetch |`bool`|True means all databases MD will be pre-loaded when the cluster comes up on all weak consistency nodes, this way the first weak consistency query doesn’t wait until the the database metadata is loaded. Default value is false. **WARNING**: Prefetch operation requires pulling all databases metadata from Azure storage every few minutes in all weak consistency nodes, this puts load on the underlying xStore resources and has impact on cluster performance.
|MaximumLagAllowedInMinutes|`int`|The maximum duration that weak consistent metadata is allowed to lag behind. If metadata is older than this value, a cache miss will occur. The number is between 1 to 60, or -1 for default value (currently 5 minutes).
|RefreshPeriodInSeconds|`int`|The refresh period (in seconds) to update a database MD on each weak consistency node. The number is between 30 to 1800, or -1 for default value (currently 120 seconds).

## .alter cluster policy query_weak_consistency

This command sets the query weak consistency policy.

**Syntax**

* `.alter` `cluster` `policy` `query_weak_consistency` @'{ ... query weak consistency policy JSON representation ... }'

* `.alter-merge` `cluster` `policy` `query_weak_consistency` @'{ ... query weak consistency policy partial-JSON representation  ... }'


**Returns**

The command sets the cluster query weak consistency policy object (overriding any current
policy defined, if any) and then returns the output of the corresponding 
[.show cluster policy query_weak_consistency](#show-cluster-policy-query_weak_consistency)
command.

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
