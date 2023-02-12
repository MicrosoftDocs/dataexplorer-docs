---
title: .create table based-on - Azure Data Explorer
description: This article describes the `.create table based-on` command in Azure Data Explorer
ms.reviewer: mispecto
ms.topic: reference
ms.date: 02/12/2023
---
# .create table based-on

Creates a new empty table based on existing table. This command must run in the context of a specific database.

Requires [Database admin permission](access-control/role-based-access-control.md).

> [!NOTE]
> All properties of the source table are copied to the new table, with the following exceptions:
> * [Update policy](updatepolicy.md)
> * [Authorized principals](security-roles.md): When using the `.create table based-on` command, the current principal is added to the table admins.

## Syntax

`.create` `table` *TableName* `based-on` *OtherTable*  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to create. The case-senestive name must be unique in the database. |
| *OtherTable*:*columnType* | string | &check; | The name of an existing table to use as the source for the columns, docstring, and folder of the table being created. |
| *Documentation* | string | | Free text describing the entity to be added. This string is presented in various UX settings next to the entity names. The default value is *Created based on **<TableName>***.  |
| *FolderName* | string | | The name of the folder where to add the table. The default is the same folder as *TableName*.  |

## Returns

This command returns the new table's schema in JSON format, similar to running the following command:

```kusto
.show table MyLogs schema as json
```

## Example

```kusto
.create table MyLogs_Temp based-on MyLogs with (folder="TempTables")
```

