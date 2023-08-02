---
title: .delete database policy caching command
description: Learn how to use the `.delete database policy caching` command to delete the database cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/13/2023
---
# .delete database policy caching command

Use this command to delete the database cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Example

The following example deletes the caching policy.

```kusto
.delete database MyDatabase policy caching
```
