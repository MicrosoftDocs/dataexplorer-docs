---
title: .undo drop table command
description: Learn how to use the `.undo drop table` command to revert a drop table operation to a specific database version.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/25/2023
---
# .undo drop table command

The `.undo` `drop` `table` command reverts a drop table operation to a specific database version. The database version must be the version just prior to the table deletion.

## Permissions

You must have at least [Database Admin](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.undo` `drop` `table` *TableName* [`as` *NewTableName*] `version=`*Version*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table to restore.|
|*NewTableName*|string||A new table name for the table.|
|*Version*|string||The database version prior to the table deletion. The format is *MajorVersion*.*MinorVersion*. To find the version, see [Find the required database version](#find-the-required-database-version).|

> [!NOTE]
> The command must be executed in the context of the database from which the table was dropped.

### Find the required database version

Use the `.show` `journal` command to find the database version before the drop operation was executed. For example:

```kusto
.show database TestDB journal
| where Event == "DROP-TABLE" and EntityName == "TestTable"
| project OriginalEntityVersion 
```

| OriginalEntityVersion |
|-----------------------|
| v24.3                 |

## Returns

This command:

* Returns the original table extents list
* Specifies for each extent the number of records the extent contains
* Returns if the recover operation succeeded or failed
* Returns the failure reason, if relevant.

| ExtentId                             | NumberOfRecords | Status                   | FailureReason                                                                                                                  |
|--------------------------------------|-----------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| ef296c9e-d75d-44bc-985c-b93dd2519691 | 100             | Recovered                |
| 370b30d7-cf2a-4997-986e-3d05f49c9689 | 1000            | Recovered                |
| 861f18a5-6cde-4f1e-a003-a43506f9e8da | 855             | Unable to recover extent | Extent container: 4b47fd84-c7db-4cfb-9378-67c1de7bf154 wasn't found, the extent was removed from storage and can't be restored |

## Examples

```kusto
// Recover TestTable table to database version 24.3
.undo drop table TestTable version="v24.3"
```

```kusto
// Recover TestTable table to database version 10.3 with new table name, NewTestTable (can be used if a table with the same name was already created since the drop)  
.undo drop table TestTable as NewTestTable version="v10.3"
```

## Limitations

* If a Purge command was executed on this database, the undo drop table command can't be executed to a version earlier to the purge execution.
* Extent can be recovered only if the hard delete period of the extent container it resides in wasn't reached yet.
* If a table with the same name has been created and dropped several times, only most recent drop can be undone.
