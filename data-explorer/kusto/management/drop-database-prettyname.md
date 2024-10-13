---
title:  .drop database prettyname command
description: Learn how to use the `.drop database prettyname` command to drop the database's prettyname.
ms.reviewer: idoein
ms.topic: reference
ms.date: 07/29/2024
monikerRange: "azure-data-explorer"
---
# .drop database prettyname command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Drops a database's pretty (friendly) name.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `database` *DatabaseName* `prettyname`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:| The name of the database with the pretty name to drop.|

## Returns

This command returns a table with the following columns:

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName | `string` | The name of the database.|
|PrettyName | `string` | The pretty name of the database. This field is empty once the pretty name is dropped.|
|Status|`string`| The status of the operation.|

## Example

The following example drops the pretty name of the `TestDatabase` database.

```kusto
.drop database TestDatabase prettyname
```

**Output**

|DatabaseName |PrettyName |Status|
|---|---|---|
|TestDatabase| | Complete|
