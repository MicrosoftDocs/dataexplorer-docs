---
title: Kusto query weak consistency policy management
description: This article describes query weak consistency policy management in Azure Data Explorer.
services: data-explorer
author: yahav
---

# query weak consistency policy commands

This article describes control commands used for creating and altering query weak consistncy policy.

## Show query weak consistency policy

This command returns the query weak consistency policy of the cluster.

**Syntax**

```kusto
.show cluster policy query_weak_consistency
```

**Returns**

This command returns a table with the following columns:


### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|QueryWeakConsistencyPolicy | <Empty> | JSON serialization of the policy object | null | Cluster

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - QueryWeakConsistencyPolicy
|EntityName|`string`|Empty                         
|Policy    |`string`|A JSON object that defines the query weak consistency policy, formatted as [query weak consistency policy object](./queryweakconsistencypolicy.md#the-policy-object)

**Example**

<!-- csl -->
```
.show cluster policy query_weak_consistency 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": 20,"EnableMetadataPrefetch": false}

## Alter query weak consistency policy 

.alter cluster policy query_weak_consistency
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
