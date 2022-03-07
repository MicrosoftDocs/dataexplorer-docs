---
title: '.alter-merge query weak consistency policy management - Azure Data Explorer'
description: This article describes the `.alter-merge query weak consistency policy` command in Azure Data Explorer.
ms.reviewer: yabenyaa
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge query weak consistency policy

The command sets the cluster query weak consistency policy, overriding the current
policy, and then returns the updated policy. The updated policy can be later viewed using the [show command](show-query-weak-consistency-policy.md). If not altered, the [default policy](./query-weak-consistency-policy.md#default-policy) applies.

## Syntax

`.alter-merge` `cluster` `policy` `query_weak_consistency` *PolicyObject*

## Arguments

*PolicyObject* - Define a policy object, see also [show command](show-query-weak-consistency-policy.md).

## Result

JSON serialization of the updated [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) 

## Examples

<!-- csl -->
```
.alter-merge cluster policy query_weak_consistency @'{"PercentageOfNodes": 40}'
```
**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 40, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| |Cluster
