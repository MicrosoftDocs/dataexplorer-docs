---
title: ".alter query weak consistency policy management - Azure Data Explorer"
description: "This article describes the .alter query weak consistency policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yabenyaa
ms.service: data-explorer
ms.topic: reference
ms.date: 01/13/2022
---
# .alter query weak consistency policy

The command sets the cluster [query weak consistency policy](./query-weak-consistency-policy.md#default-policy), overriding the current policy, and then returns the updated policy. The updated policy can be later viewed using the [show command](show-query-weak-consistency-policy.md). If not altered, the [default policy](./query-weak-consistency-policy.md#default-policy) applies.

## Syntax

`.alter` `cluster` `policy` `query_weak_consistency` *PolicyObject* 

## Arguments

*PolicyObject* - Define a policy object, see also [query weak consistency policy](./query-weak-consistency-policy.md#default-policy).

## Result

JSON serialization of the updated [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) 

## Examples

<!-- csl -->
```
.alter cluster policy query_weak_consistency @'{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}'
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| |Cluster
