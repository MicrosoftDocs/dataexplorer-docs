---
title: Query limit policy - Azure Kusto | Microsoft Docs
description: This article describes Query limit policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Query limit policy

The [query limit policy](https://kusdoc2.azurewebsites.net/docs/concepts/querylimitpolicy.html)
 is a cluster-level policy object to limit the total amount
of memory that a query can consume while running on a single node.

## .show cluster policy querylimit

This command returns the query limit policy of the cluster.

**Syntax**

* `.show` `cluster` `policy` `querylimit`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - QueryLimitPolicy
|EntityName|`string`|Empty                         
|Policy    |`string`|A JSON object that defines the query limit policy, formatted as [query limit policy object](#query-limit-policy-object)

**Example**

```kusto
.show cluster policy querylimit 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryLimitPolicy||{"IsEnabled": true,"MaxMemoryPerQueryPerNode": 25000000000}

## Query limit policy object

A cluster may have one or none query limit policy defined. 


|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|IsEnabled |`bool`  |States if query limit policy is enabled (true) or disabled (false)     |
|MaxMemoryPerQueryPerNode|`long`|Maximum memory allocation to be allowed per query per node (in bytes). The minimum allowed value is 1GB. |

## .alter cluster policy querylimit

This command sets the querylimit policy of the specified table.

**Syntax**

* `.alter` `cluster` `policy` `querylimit` *QueryLimitPolicyObject*

*QueryLimitPolicyObject* is a JSON object that has query limit policy object defined.

**Returns**

The command sets the cluster query limit policy object (overriding any current
policy defined, if any) and then returns the output of the corresponding 
[.show cluster policy querylimit](#show-cluster-policy-querylimit)
command.

**Example**

```kusto
.alter cluster policy querylimit '{"IsEnabled": true, "MaxMemoryPerQueryPerNode": 25000000000}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryLimitPolicy||{"IsEnabled": true,"MaxMemoryPerQueryPerNode": 25000000000}