---
title: .show cluster databases command
description: Learn how to use the `.show cluster databases` command to show the databases attached to the invoked cluster.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .show cluster databases command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a table showing all the databases attached to the cluster and to which the user invoking the command has access. If specific database names are used, only those databases would
be included.

## Permissions

You must have at least [AllDatabasesMonitor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `databases` [`details` | `identity` | `policies` | `datastats`]

`.show` `cluster` `databases` `(`*DatabaseName* [`,` ... ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database to show.|

## Returns

|Output parameter |Type |Description
|---|---|---
|DatabaseName  | `string` |Database name. Database names are case-sensitive.
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema).
|IsCurrent  |Boolean |True if the database is the one that the current connection points to.
|DatabaseAccessMode  | `string` |How the cluster is attached to the database. For example, if the database is attached in ReadOnly mode, the cluster fails all requests to modify the database in any way.
|PrettyName | `string` |The database pretty name.
|CurrentUserIsUnrestrictedViewer |Boolean | Specifies if the current user is an unrestricted viewer on the database.
|DatabaseId | `guid` |The database's unique ID
