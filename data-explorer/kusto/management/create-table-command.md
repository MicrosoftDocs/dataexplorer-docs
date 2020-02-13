---
title: .create table - Azure Data Explorer | Microsoft Docs
description: This article describes .create table in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/06/2020
---
# .create table

Creates a new empty table.

The command must run in context of a specific database.

Requires [Database user permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.create` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

If the table already exists the command will return success.

**Example** 

```
.create table MyLogs ( Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32 ) 
```
 
**Return output**

Returns the table's schema in JSON format, same as:

```
.show table MyLogs schema as json
```

> [!NOTE]
> For creating multiple tables, use the [.create tables](/create-tables.md) command for better performance and lower load on the cluster.

## .create-merge table

Creates a new table or extends an existing table. 

The command must run in context of a specific database. 

Requires [Database user permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.create-merge` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

If the table doesn't exist, functions exactly as ".create table" command.

If table T exists, and you send a ".create-merge table T (<columns specification>)" command, then:

* Any column in <columns specification> that didn't previously exist in T will be added to the end of T's schema.
* Any column in T which is not in <columns specification> won't be removed from T.
* Any column in <columns specification> that exists in T, but with a different data type will cause the command to fail.