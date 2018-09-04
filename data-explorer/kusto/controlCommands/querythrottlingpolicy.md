---
title: Query throttling policy - Azure Kusto | Microsoft Docs
description: This article describes Query throttling policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Query throttling policy

The [query throttling policy](https://kusdoc2.azurewebsites.net/docs/concepts/querythrottlingpolicy.html)
is a cluster-level policy object to restrict the query concurrency in the cluster.

When cluster does not have query throttling policy defined - it does not apply 
limit on the amount of concurrent queries.

## .show cluster policy querythrottling

This command returns the query throttling policy of the cluster.

**Syntax**

* `.show` `cluster` `policy` `querythrottling`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - QueryThrottlingPolicy
|EntityName|`string`|Empty                         
|Policy    |`string`|A JSON object that defines the query throttling policy, formatted as [query throttling policy object](#query-throttling-policy-object)

**Example**

```kusto
.show cluster policy querythrottling 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryThrottlingPolicy||{"IsEnabled": true,"MaxQuantity": 25}

## Query throttling policy object

A cluster may have one or none query throttling policy defined. 

When cluster does not have query throttling policy defined - it does not apply 
limit on the amount of concurrent queries.
 

|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|IsEnabled |`bool`  |States if query throttling policy is enabled (true) or disabled (false)     |
|MaxQuantity|`int`|Number of the concurrent queries that cluster can run. Number must have positive value. |

## .alter cluster policy querythrottling

This command sets the querythrottling policy of the specified table.

**Syntax**

* `.alter` `cluster` `policy` `querythrottling` *QueryThrottlingPolicyObject*

*QueryThrottlingPolicyObject* is a JSON object that has query throttling policy object defined.

**Returns**

The command sets the cluster query throttling policy object (overriding any current
policy defined, if any) and then returns the output of the corresponding 
[.show cluster policy querythrottling](#show-cluster-policy-querythrottling)
command.

**Example**

```kusto
.alter cluster policy querythrottling '{"IsEnabled": true, "MaxQuantity": 25}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryThrottlingPolicy||{"IsEnabled": true,"MaxQuantity": 25}

## .delete cluster policy querythrottling

This command drops the cluster query throttling policy object.

**Syntax**

* `.delete` `cluster` `policy` `querythrottling`