---
title: .create table - Azure Data Explorer
description: This article describes .create table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .create table

Creates a new empty table.

The command must run in the context of a specific database.

## Permissions

You must have at least [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

> [!NOTE]
> If a table with the same (case-sensitive) name already exists in the context of the database, the command returns success without changing the existing table, even in the following scenarios:
>
> - The specified schema doesn't match the schema of the existing table
> - The `folder` or `docstring` parameters are specified with values different from the ones set in the table

## Example

```kusto
.create table MyLogs ( Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32 ) 
```

## Returns

Returns the table's schema in JSON format, same as:

```kusto
.show table MyLogs schema as json
```

> [!NOTE]
> For creating multiple tables, use the [`.create tables`](create-tables-command.md) command for better performance and lower load on the cluster.
