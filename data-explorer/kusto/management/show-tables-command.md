---
title: .show tables command
description: Learn how to use the `.show tables` command to show a set that contains the specified tables in the database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/23/2023
---
# .show tables command

Returns a set that contains the specified tables or all tables in the database.

> [!NOTE]
> For table statistics, see the [.show table data statistics](show-table-data-statistics.md) command.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `tables` [`(`*TableName* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string||The name of the table to show.|

## Returns

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the table.
|DatabaseName  |String |The database that the table belongs to.
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.

## Example

```kusto
.show tables
.show tables (T1, ..., Tn)
```

**Output example**

|Table Name |Database Name |Folder | DocString
|---|---|---|---
|Table1 |DB1 |Logs |Contains services logs
|Table2 |DB1 | Reporting |
|Table3 |DB1 | | Extended info |
|Table4 |DB2 | Metrics| Contains services performance information
