---
title:  .alter cluster cache policy command
description: Learn how to use the `.alter cluster cache policy` command to change the cluster's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter cluster cache policy command

Changes the cluster's cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `caching` *PolicyParameter*  

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *PolicyParameter* | string | &check; | One or more policy parameters. For parameters, see [cache policy](cachepolicy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following example sets the caching policy to include the last 30 days.

```kusto
.alter cluster policy caching hot = 30d
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|CachingPolicy| |{"DataHotSpan": { "Value": "30.00:00:00" }, "IndexHotSpan": { "Value": "30.00:00:00"}}| |

### Define hot-cache windows

This command sets the caching policy to include the last 30 days and additional data from January and April 2021.

```kusto
.alter cluster policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|CachingPolicy| |{"DataHotSpan": { "Value": "30.00:00:00" }, "IndexHotSpan": {    "Value": "30.00:00:00" },"HotWindows": [{ "MinValue": "2021-01-01T00:00:00Z", "MaxValue": "2021-02-01T00:00:00Z" }, { "MinValue": "2021-04-01T00:00:00Z", "MaxValue": "2021-05-01T00:00:00Z" }]}| |
