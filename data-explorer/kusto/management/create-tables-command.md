---
title: .create tables - Azure Data Explorer
description: This article describes .create tables in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 07/05/2020
---
# .create tables

Creates new empty tables as a bulk operation.

The command must run in context of a specific database.

Requires [Database user permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.create` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ] [`with` `(` `folder` `=` *FolderName*] `)`]

If any table already exists, the command will return success.
 
**Example** 

```kusto
.create tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```
