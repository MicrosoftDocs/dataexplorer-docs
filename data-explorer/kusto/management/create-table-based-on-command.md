---
title: .create table based-on command
description: Learn how to use the `.create table based-on` command to create a new empty table based on an existing table.
ms.reviewer: mispecto
ms.topic: reference
ms.date: 05/14/2023
---
# .create table based-on command

Creates a new empty table based on an existing table. This command must run in the context of a specific database.

> [!NOTE]
> All properties of the source table are copied to the new table, with the following exceptions:
>
> * [Update policy](update-policy.md)
> * [Authorized principals](security-roles.md): When using the `.create table based-on` command, the current principal is added to the table admins.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `table` *tableName* `based-on` *otherTable*  [`ifnotexists`] [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| `ifnotexists` | string | | If specified, the table will only be created if it doesn't already exist.|
| *tableName* | string |  :heavy_check_mark: | The name of the table to create. The case-senestive name must be unique in the database. |
| *otherTable* | string |  :heavy_check_mark: | The name of an existing table to use as the source for the columns, docstring, and folder of the table being created. |
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names. The default value is *Created based on **\<tableName>***.|
|`folder`|string|The name of the folder where to add the table. The default is the same folder as *tableName*.|

## Returns

This command returns the new table's schema in JSON format, similar to running the following command:

```kusto
.show table MyLogs schema as json
```

> [!NOTE]
>
> * If the table already exists:
>    * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>    * If `ifnotexists` flag is NOT specified, an error is returned.

## Example

```kusto
.create table MyLogs_Temp based-on MyLogs with (folder="TempTables")
```
