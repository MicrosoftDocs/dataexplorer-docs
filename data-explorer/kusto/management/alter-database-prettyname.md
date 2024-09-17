---
title:  .alter database prettyname command
description: Learn how to use the `.alter database prettyname` command to alter the database's prettyname.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 08/26/2024
monikerRange: "azure-data-explorer"
---
# .alter database prettyname command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters a database's pretty (friendly) name.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:| The name of the database to alter.|
|*DatabasePrettyName*| `string` | :heavy_check_mark:| The new pretty name for the database.|

## Returns

This command returns a table with the following columns:

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName | `string` | The name of the database.|
|PrettyName | `string` | The pretty name of the database.|
|Status|`string`| The status of the operation.|

## Example

The following example changes the `TestDatabase` pretty name to `NewDatabasename`.

```kusto
.alter database TestDatabase prettyname 'NewDatabasename'
```

**Output**

|DatabaseName |PrettyName |Status|
|---|---|---|
|TestDatabase| NewDatabasename| Complete|
