---
title: .delete materialized-view policy caching command
description: Learn how to use the `.delete materialized-view policy caching` command to delete the materialized view's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete materialized-view policy caching command

Delete the materialized view cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cache-policy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view.|

## Example

The following example deletes the caching policy.

```kusto
.delete materialized-view MyMaterializedView policy caching 
```
