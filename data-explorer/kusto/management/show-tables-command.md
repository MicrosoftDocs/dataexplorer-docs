---
title: .show tables command
description: Learn how to use the `.show tables` command to show a set that contains the specified tables in the database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# .show tables command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a set that contains the specified tables or all tables in the database.

> [!NOTE]
> For table statistics, see the [.show table data statistics](show-table-data-statistics.md) command.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `tables` [`(`*TableName* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` ||The name of the table to show.|

## Returns

|Output parameter |Type |Description
|---|---|---
|TableName  | `string` |The name of the table.
|DatabaseName  | `string` |The database that the table belongs to.
|Folder | `string` |The table's folder.
|DocString | `string` |A string documenting the table.

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
