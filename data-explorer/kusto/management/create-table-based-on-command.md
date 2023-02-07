---
title: .create table based-on - Azure Data Explorer
description: This article describes the `.create table based-on` command in Azure Data Explorer
ms.reviewer: mispecto
ms.topic: reference
ms.date: 12/29/2020
---
# .create table based-on

Creates a new empty table based on existing table. This command must run in the context of a specific database.

> [!NOTE]
> All properties of the source table are copied to the new table, with the following exceptions:
> * [Update policy](updatepolicy.md)
> * [Authorized principals](security-roles.md): When using the `.create table based-on` command, the current principal is added to the table admins.

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.create` `table` *TableName* `based-on` *OtherTable*  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

## Arguments

* *TableName*: New table name
* *OtherTable*: Source table name
* *Documentation*: Override default table documentation string
* *FolderName*: Override target folder name

## Returns

This command returns the new table's schema in JSON format, similar to running the following command:

```kusto
.show table MyLogs schema as json
```

## Example

```kusto
.create table MyLogs_Temp based-on MyLogs with (folder="TempTables")
```

