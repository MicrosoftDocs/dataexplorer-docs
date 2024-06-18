---
title: .create-merge tables command
description: Learn how to use the `.create-merge tables` command to create and extend the schemas of existing tables in a single bulk operation.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .create-merge tables command

Lets you create and extend the schemas of existing tables in a single bulk operation, in the context of a specific database.

## Permissions

This command requires [Database User](../access-control/role-based-access-control.md) permissions, and [Table Admin](../access-control/role-based-access-control.md) permissions for extending existing tables.

## Syntax

`.create-merge` `tables` *tableName1* `(`*columnName*`:`*columnType* [`,` ...]`)` [`,` *tableName2* `(`*columnName*`:`*columnType* [`,` ...]`)` ... ] [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | `string` |  :heavy_check_mark: | The name of the table to create or extend. |
| *columnName*, *columnType* | `string` |  :heavy_check_mark: | The name of an existing or new column mapped to the type of data in that column. The list of mappings defines the output column schema.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`| `string` |Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`| `string` |The name of the folder to add to the table.|

## Returns

* Specified tables that don't exist will be created.
* Specified tables that already exist will have their schemas extended.
  * Nonexistent columns are added at the *end* of the existing table's schema.
  * Existing columns that aren't specified in the command won't be removed from the existing table's schema.
  * Existing columns that are specified with a data type in the command that is different from the one in the existing table's schemas lead to a failure. No tables are created.

## Example

```kusto
.create-merge tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```

**Output**

| tableName | DatabaseName  | Folder | DocString |
|-----------|---------------|--------|-----------|
| MyLogs    | TopComparison |        |           |
| MyUsers   | TopComparison |        |           |
