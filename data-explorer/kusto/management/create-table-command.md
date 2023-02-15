---
title: .create table - Azure Data Explorer
description: This article describes .create table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/15/2023
---
# .create table

Creates a new empty table.

The command must run in the context of a specific database.

Requires [Database user permission](./access-control/role-based-access-control.md).

## Syntax

`.create` `table` *TableName* `(`*ColumnName*`:`*ColumnType* [`,` ...]`)`  [`with` `(`*PropertyName* `=` *PropertyValue*`)`]

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

If the table already exists, the command will return success.

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
