---
title: .create tables - Azure Data Explorer
description: This article describes .create tables in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# .create tables

Creates new empty tables as a bulk operation.

The command must run in the context of a specific database.

Requires [Database user permission](./access-control/role-based-access-control.md).

## Syntax

`.create` `tables` *TableName1* `(`*ColumnName*`:`*ColumnType* [`,` ...]`)` [`,` *TableName2* `(`*ColumnName*`:`*ColumnType* [`,` ...]`)` ... ] [`with` `(`*PropertyName* `=` *PropertyValue*`)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to create. |
| *ColumnName*, *ColumnType* | string | &check; | The name of a column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of properties. See [supported properties](#supported-properties) to learn more about the optional property values.|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`|string|The name of the folder to add to the table.|

> [!NOTE]
> If a table with the same (case-sensitive) name already exists in the context of the database, the command returns success without changing the existing table, even in the following scenarios:
>
> - The specified schema doesn't match the schema of the existing table
> - The `folder` or `docstring` parameters are specified with values different from the ones set in the table

## Example

```kusto
.create tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```
