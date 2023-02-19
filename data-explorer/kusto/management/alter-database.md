---
title: .alter database prettyname - Azure Data Explorer
description: This article describes the `.alter` database pretty name command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/19/2023
---
# .alter database prettyname

Alters a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](./access-control/role-based-access-control.md).

## Syntax

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

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
