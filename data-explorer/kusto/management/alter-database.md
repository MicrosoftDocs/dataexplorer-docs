---
title:  .alter database prettyname command
description: Learn how to use the `.alter database prettyname` command to alter the database's name.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/25/2023
---
# .alter database prettyname command

Alters a database's pretty (friendly) name.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database to alter.|
|*DatabasePrettyName*|string|&check;|The new pretty name for the database.|

## Returns

|Output parameter |Type |Description
|---|---|---
|DatabaseName |String |The name of the database
|PrettyName |String |The pretty name of the database
