---
title: ".alter cluster policy query_weak_consistency management - Azure Data Explorer"
description: "This article describes the `.alter cluster policy query_weak_consistency` command in Azure Data Explorer."
ms.reviewer: yabenyaa
ms.topic: reference
ms.date: 01/13/2022
---
# .alter cluster policy query_weak_consistency

The command sets the cluster [query weak consistency policy](./query-weak-consistency-policy.md), overriding the current policy, and then returns the updated policy. The updated policy can be later viewed using the [show command](show-query-weak-consistency-policy.md). If not altered, the [default policy](./query-weak-consistency-policy.md#default-policy) applies.

## Syntax

This command has two flavors:
* `.alter` `cluster` `policy` `query_weak_consistency` *PolicyObject* 
* `.alter-merge` `cluster` `policy` `query_weak_consistency` *PolicyObject*

The first flavor expects a complete JSON (that includes all policy properties), and any property that is omitted, will be set to its default. The second flavor may receive a subset of the policy properties, and only those will be modified (while the rest remains untouched). Examples will follow.

## Arguments

*PolicyObject* - a JSON policy object, see the [query weak consistency policy](./query-weak-consistency-policy.md#the-policy-object) for policy properties (also shown in the examples below).

## Result

JSON serialization of the updated [query weak consistency policy object](./query-weak-consistency-policy.md#the-policy-object) 

## Examples

### alter
`alter` command:
<!-- csl -->
```
.alter cluster policy query_weak_consistency ```{
   "PercentageOfNodes": 10,
   "MinimumNumberOfNodes": 2,
   "MaximumNumberOfNodes": 20,
   "SuperSlackerNumberOfNodesThreshold": 5,
   "EnableMetadataPrefetch": false,
   "MaximumLagAllowedInMinutes": 10,
   "RefreshPeriodInSeconds": 300
   }```
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 10, "MinimumNumberOfNodes": 2, "MaximumNumberOfNodes": 20, "SuperSlackerNumberOfNodesThreshold": 5, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 10, "RefreshPeriodInSeconds": 300}| |Cluster

For demonstrating the `alter-merge`, we'll assume the following policy is set prior to executing the command:
```JSON
{
  "PercentageOfNodes": 20,
  "MinimumNumberOfNodes": 10,
  "MaximumNumberOfNodes": 100, 
  "SuperSlackerNumberOfNodesThreshold": 30,
  "EnableMetadataPrefetch": false,
  "MaximumLagAllowedInMinutes": 5,
  "RefreshPeriodInSeconds": 30
}
```

### alter-merge
`alter-merge` command:
<!-- csl -->
```
.alter-merge cluster policy query_weak_consistency @'{"PercentageOfNodes": 30, "MaximumLagAllowedInMinutes": 15}'
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 30, "MinimumNumberOfNodes": 10, "MaximumNumberOfNodes": 100, "SuperSlackerNumberOfNodesThreshold": 30, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": 15, "RefreshPeriodInSeconds": 30}| |Cluster

As can be seen, only `PercentageOfNodes` and `MaximumLagAllowedInMinutes` were modified (whereas if the `alter` command was used instead, the remaining properties would be also modified, and set to their [defaults](./query-weak-consistency-policy.md#default-policy)).
