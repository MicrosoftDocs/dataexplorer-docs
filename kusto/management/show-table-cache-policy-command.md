---
title: .show table policy caching command
description: Learn how to use the `.show table policy caching` command to show the table's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy caching command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Show the table cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cache-policy.md) describes the data artifacts used, so that more important data can take priority.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` ||The name of the database. This is required when running the command from outside the database context of the specified table.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|

## Examples

The following examples show the table caching policy:

```kusto
.show table MyDatabase.MyTable policy caching 
```

```kusto
.show table MyTable policy caching 
```
