---
title: .create table - Azure Data Explorer
description: This article describes .create table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2020
---
# .create table

Creates a new empty table.

The command must run in context of a specific database.

## Permissions

You must have [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

If the table already exists, the command will return success.

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
