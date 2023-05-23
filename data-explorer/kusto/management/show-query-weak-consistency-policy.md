---
title:  ".show cluster policy query_weak_consistency management"
description: This article describes the `.show query weak consistency policy` command in Azure Data Explorer.
ms.reviewer: yabenyaa
ms.topic: reference
ms.date: 05/09/2023
---
# .show cluster policy query_weak_consistency

This article describes the show control command used for the [query weak consistency policy](query-weak-consistency-policy.md). This command returns the query weak consistency policy of the cluster.

## Permissions

You must have at least [AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `query_weak_consistency`

## Returns

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|QueryWeakConsistencyPolicy |  | JSON serialization of the [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) | | Cluster

## Example

```kql
.show cluster policy query_weak_consistency 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": -1, "MinimumNumberOfNodes": -1, "MaximumNumberOfNodes": -1, "SuperSlackerNumberOfNodesThreshold": -1, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": -1, "RefreshPeriodInSeconds": -1}| |Cluster
