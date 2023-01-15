---
title: .create-merge tables - Azure Data Explorer
description: This article describes the .create-merge tables command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .create-merge tables

Lets you create and extend the schemas of existing tables in a single bulk operation, in the context of a specific database.

> [!NOTE]
> Requires [Database user permission](./access-control/role-based-access-control.md).
> Requires [table admin permission](./access-control/role-based-access-control.md) for extending existing tables.

**Syntax**

`.create-merge` `tables` *TableName1* ([columnName:columnType], ...) [`,` *TableName2* ([columnName:columnType], ...) ... ] [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

* Specified tables that don't exist will be created.
* Specified tables that already exist will have their schemas extended.
    * Non-existent columns will be added at the _end_ of the existing table's schema.
    * Existing columns that aren't specified in the command won't be removed from the existing table's schema.
    * Existing columns that are specified with a data type in the command that is different from the one in the existing table's schemas will lead to a failure. No tables will be created or extended.

**Example**

```kusto
.create-merge tables 
  MyLogs (Level:string, Timestamp:datetime, UserId:string, TraceId:string, Message:string, ProcessId:int32),
  MyUsers (UserId:string, Name:string)
```

**Return output**

| TableName | DatabaseName  | Folder | DocString |
|-----------|---------------|--------|-----------|
| MyLogs    | TopComparison |        |           |
| MyUsers   | TopComparison |        |           |
