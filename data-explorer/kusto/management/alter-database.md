---
title: .alter database prettyname - Azure Data Explorer
description: This article describes the `.alter` database pretty name command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/13/2020
---
# .alter database prettyname

Alters a database's pretty (friendly) name.

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

## Returns
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database
|PrettyName |String |The pretty name of the database
