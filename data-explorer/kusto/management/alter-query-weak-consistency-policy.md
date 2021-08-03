---
title: Alter query weak consistency policy management
description: This article describes the `.alter query weak consistency policy` command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yabenyaa
ms.service: data-explorer
ms.topic: reference
ms.date: 08/01/2021
---
# .alter query weak consistency policy

The command sets the cluster query weak consistency policy, overriding the current
policy (if it exists), and then returns the updated policy. The updated policy can be later viewed using the [show command](show-query-weak-consistency-policy.md). If not altered, the [default policy](./query-weak-consistency-policy.md#default-policy) applies.

## Syntax

```kusto
.alter cluster policy query_weak_consistency <query weak consistency policy JSON representation>
	
.alter-merge cluster policy query_weak_consistency <query weak consistency policy JSON representation>
```	

## Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|QueryWeakConsistencyPolicy |  | JSON serialization of the updated [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) | List of the databases in the cluster | Cluster

## Examples

<!-- csl -->
```
.alter cluster policy query_weak_consistency @'{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| ["Database1", "Database2"...] |Cluster

<!-- csl -->
```
.alter-merge cluster policy query_weak_consistency @'{"PercentageOfNodes": 40}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 40, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| ["Database1", "Database2"...] |Cluster
