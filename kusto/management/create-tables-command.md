---
title: .create tables command
description: Learn how to use the `.create tables` command to create new empty tables as a bulk operation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/24/2023
---
# .create tables command

Creates new empty tables as a bulk operation.

The command must run in the context of a specific database.

## Permissions

You must have at least [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `tables` *tableName1* `(`*columnName*`:`*columnType* [`,` ...]`)` [`,` *tableName2* `(`*columnName*`:`*columnType* [`,` ...]`)` ... ] [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | `string` |  :heavy_check_mark: | The name of the table to create. |
| *columnName*, *columnType* | `string` |  :heavy_check_mark: | The name of a column mapped to the type of data in that column. The list of mappings defines the output column schema.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`| `string` |Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`| `string` |The name of the folder to add to the table.|

> [!NOTE]
> If one or more tables with the same (case-sensitive) names as the specified tables already exist in the context of the database, the command returns success without changing the existing tables, even in the following scenarios:
>
> - The specified schema doesn't match the schema of an existing table
> - The `folder` or `docstring` parameters are specified with values different from the ones set in the existing tables
>
> Any specified tables that don't exist are created.

## Example

```kusto
.create tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```
