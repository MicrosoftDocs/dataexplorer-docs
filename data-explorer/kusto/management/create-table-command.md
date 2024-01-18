---
title: .create table command
description: Learn how to use the `.create table` command to create a new empty table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .create table command

Creates a new empty table.

The command must run in the context of a specific database.

## Permissions

You must have at least [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `table` *tableName* `(`*columnName*`:`*columnType* [`,` ...]`)`  [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | string |  :heavy_check_mark: | The name of the table to create. |
| *columnName*, *columnType* | string |  :heavy_check_mark: | The name of a column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`|string|The name of the folder to add to the table.|

> [!NOTE]
> If a table with the same (case-sensitive) name already exists in the context of the database, the command returns success without changing the existing table, even in the following scenarios:
>
> * The specified schema doesn't match the schema of the existing table
> * The `folder` or `docstring` parameters are specified with values different from the ones set in the table

## Example

```kusto
.create table MyLogs ( Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32 ) 
```

**Output**

Returns the table's schema in JSON format, same as:

```kusto
.show table MyLogs schema as json
```

> [!NOTE]
> For creating multiple tables, use the [`.create tables`](create-tables-command.md) command for better performance and lower load on the cluster.
