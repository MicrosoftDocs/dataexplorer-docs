---
title: .show database policy caching command
description: Learn how to use the `.show database policy caching` command to show the database cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show database policy caching command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Show the database cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cache-policy.md) describes the data artifacts used, so that more important data can take priority.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the table caching policy:

```kusto
.show database MyDatabase policy caching 
```
