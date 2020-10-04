---
title: Query throttling policy commands - Azure Data Explorer
description: This article describes the query throttling policy commands in Azure Data Explorer
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: reference
ms.date: 04/11/2020
---
# Query throttling policy commands

The [query throttling policy](query-throttling-policy.md) is a cluster-level policy object to restrict the query concurrency in the cluster.

These commands require [AllDatabasesAdmin](../management/access-control/role-based-authorization.md) permissions.

## `.show cluster policy querythrottling`

Returns the [query throttling policy](query-throttling-policy.md) of the cluster.

### Syntax

`.show` `cluster` `policy` `querythrottling`

### Returns

Returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - QueryThrottlingPolicy
|EntityName|`string`|Empty
|Policy    |`string`|A JSON object that defines the query throttling policy, formatted as [query throttling policy object](#query-throttling-policy-object)

## Query throttling policy object

A cluster may have none or one query throttling policies defined.

When a cluster doesn't have a query throttling policy defined, the default policy applies. For more information on the default policy, see [query limits](../concepts/querylimits.md).

|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|IsEnabled |`bool`  |States if query throttling policy is enabled (true) or disabled (false)     |
|MaxQuantity|`int`|Number of the concurrent queries that cluster can run. Number must have positive value. |

### Example

<!-- csl -->
```
.show cluster policy querythrottling 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryThrottlingPolicy||{"IsEnabled": true,"MaxQuantity": 25}

## `.alter cluster policy querythrottling`

Sets the [query throttling policy](query-throttling-policy.md) of the specified table. 

### Syntax

`.alter` `cluster` `policy` `querythrottling` *QueryThrottlingPolicyObject*

### Arguments

*QueryThrottlingPolicyObject* is a JSON object that has query throttling policy object defined.

### Returns

Sets the cluster query throttling policy object, overriding any current policy defined, and then returns the output of the corresponding [.show cluster policy `querythrottling`](#show-cluster-policy-querythrottling) command.

### Example

<!-- csl -->
```
.alter cluster policy querythrottling '{"IsEnabled": true, "MaxQuantity": 25}'
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|QueryThrottlingPolicy||{"IsEnabled": true,"MaxQuantity": 25}

## `.delete cluster policy querythrottling`

Drops the cluster [query throttling policy](query-throttling-policy.md) object.

### Syntax

`.delete` `cluster` `policy` `querythrottling`

