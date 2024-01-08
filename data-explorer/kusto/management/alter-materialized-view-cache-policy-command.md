---
title:  .alter materialized-view policy caching command
description: Learn how to use the `.alter materialized-view policy caching` command to change the materialized view's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter materialized-view policy caching command

Changes the materialized view's cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cache-policy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `caching` *PolicyParameters*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;| The name of the materialized view.|
|*PolicyParameters*|string|&check;|One or more policy parameters. For parameters, see [cache policy](cache-policy.md).|

## Examples

Set the caching policy to include the last 30 days.

```kusto
.alter materialized-view MyMaterializedView policy caching hot = 30d
```

Set the caching policy to include the last 30 days and data from January and April 2021.

```kusto
.alter materialized-view MyMaterializedView policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```
