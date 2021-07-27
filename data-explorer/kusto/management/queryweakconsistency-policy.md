---
title: Kusto query weak consistency policy management
description: This article describes query weak consistency policy management in Azure Data Explorer.
services: data-explorer
author: yahav
ms.author: yabenyaa
ms.reviewer: a
ms.service: data-explorer
ms.topic: reference
ms.date: 07/27/2021
---

# Query weak consistency policy commands

This article describes control commands used for creating and altering query weak consistncy policy.

## Show query weak consistency policy

```kusto
.show cluster policy query_weak_consistency
```

This command returns the query weak consistency policy of the cluster.

### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|QueryWeakConsistencyPolicy | <Empty> | JSON serialization of the [query weak consistency policy object](./queryweakconsistencypolicy.md#the-policy-object) | List of the databases in the cluster | Cluster

**Example**

<!-- csl -->
```
.show cluster policy query_weak_consistency 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": -1, "MinimumNumberOfNodes": -1, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": -1, "RefreshPeriodInSeconds": -1}|["Database1", "Database2"...] |Cluster

## Alter query weak consistency policy 

```kusto
.alter cluster policy query_weak_consistency <query weak consistency policy JSON representation>
	
.alter-merge cluster policy query_weak_consistency <query weak consistency policy JSON representation>
```	
	
The command sets the cluster query weak consistency policy object (overriding the current
policy) and then returns the updated policy (which is returned by the [show command](#show-query-weak-consistency-policy)). If not altered, the [default policy](./queryweakconsistencypolicy.md#default-policy) applies.

### Output
Same as in the [show command](#show-query-weak-consistency-policy).
	
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
