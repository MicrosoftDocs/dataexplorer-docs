---
title: .create-merge tables - Azure Data Explorer | Microsoft Docs
description: This article describes .create-merge tables in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .create-merge tables

Allows creating and/or extending the schemas of existing tables in a single bulk operation, in the context of a specific database.

Requires [Database user permission](../management/access-control/role-based-authorization.md), as well as [table admin permission](../management/access-control/role-based-authorization.md) for extending existing tables.

**Syntax**

`.create-merge` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ]

* Specified tables which don't exist will be created.
* Specified tables which already exist will have their schemas extended:
    * Non-existing columns will be added at the _end_ of the existing table's schema.
    * Existing columns which aren't specified in the command won't be removed from the existing table's schema.
    * Existing columns which are specified with a different data type in the command to that in the existing table's schema will lead to a failure (no tables will be created or extended).

**Example** 

```
.create-merge tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```

**Return output**

| TableName | DatabaseName  | Folder | DocString |
|-----------|---------------|--------|-----------|
| MyLogs    | TopComparison |        |           |
| MyUsers   | TopComparison |        |           |