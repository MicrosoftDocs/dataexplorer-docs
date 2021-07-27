---
title: Kusto query weak consistency policy management
description: This article describes query weak consistency policy management in Azure Data Explorer.
services: data-explorer
author: yahav
---

# query weak consistency policy commands

This article describes control commands used for creating and altering query weak consistncy policy.

## Show query weak consistency policy

```kusto
.show cluster policy query_weak_consistency
```

This command returns the query weak consistency policy of the cluster.

### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|QueryWeakConsistencyPolicy | <Empty> | JSON serialization of the [query weak consistency policy object](./queryweakconsistencypolicy.md#the-policy-object) | null | Cluster

**Example**

<!-- csl -->
```
.show cluster policy query_weak_consistency 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryWeakConsistencyPolicy||{"PercentageOfNodes": -1, "MinimumNumberOfNodes": -1, "EnableMetadataPrefetch": false, "MaximumLagAllowedInMinutes": -1, "RefreshPeriodInSeconds": -1}

## Alter query weak consistency policy 

```kusto
.alter cluster policy query_weak_consistency
```	
	
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
