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

This command has two flavors:
* `.alter` `cluster` `policy` `query_weak_consistency` *PolicyObject* 
* `.alter-merge` `cluster` `policy` `query_weak_consistency` *PolicyObject*

The first flavor expects a complete JSON (that includes all policy properties), and any property that is omitted, will be set to its default. The second flavor may receive a subset of the policy properties, and only those will be modified (while the rest remain untouched). Examples will follow.

## Arguments

*PolicyObject* - a JSON policy object, see the [query weak consistency policy](./query-weak-consistency-policy.md#default-policy) for policy properties (also shown in the example below).

## Result

JSON serialization of the updated [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) 

## Examples

`alter` command:
<!-- csl -->
```
.alter cluster policy query_weak_consistency @'{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}'
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2 "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| |Cluster

For demonstrating the `alter-merge`, we will assume the following policy is set prior to executing the command:
```JSON
{
  "PercentageOfNodes": 20,
  "MinimumNumberOfNodes": 10,
  "EnableMetadataPrefetch": false,
  "MaximumLagAllowedInMinutes": 5,
  "RefreshPeriodInSeconds": 30
}
```

`alter-merge` command:
<!-- csl -->
```
.alter-merge cluster policy query_weak_consistency @'{"PercentageOfNodes": 30, "EnableMetadataPrefetch": true}'
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 30, "MinimumNumberOfNodes": 10, "EnableMetadataPrefetch": true, "MaximumLagAllowedInMinutes": 5, "RefreshPeriodInSeconds": 30}| |Cluster
