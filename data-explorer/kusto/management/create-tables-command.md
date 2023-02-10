---
title: .create tables - Azure Data Explorer
description: This article describes .create tables in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2020
---
# .create tables

Creates new empty tables as a bulk operation.

The command must run in the context of a specific database.

Requires [Database user permission](./access-control/role-based-access-control.md).

**Syntax**

`.create` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ] [`with` `(` [`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

If a table with the same (case-sensitive) name already exists in the context database, the command will return success withouth changing the existing table.

That is the case even if the folder or docstring clauses have different values than the ones set in the existing table, or if the schema declared in the command doesn't match the schema of the existing table.

**Example** 

```kusto
.create tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```
