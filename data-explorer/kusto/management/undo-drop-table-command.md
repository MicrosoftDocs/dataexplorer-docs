---
title: .undo drop table - Azure Data Explorer
description: This article describes .undo drop table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .undo drop table

The `.undo` `drop` `table` command reverts a drop table operation to a specific database version.

Requires [Database admin permission](./access-control/role-based-access-control.md).

**Syntax**

`.undo` `drop` `table` *TableName* [`as` *NewTableName*] `version=v` *DB_MajorVersion.DB_MinorVersion*

The command must be executed in the context of the database from which the table was dropped.

**Returns**

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

**Examples**

```kusto
// Recover TestTable table to database version 24.3
.undo drop table TestTable version="v24.3"
```

```kusto
// Recover TestTable table to database version 10.3 with new table name, NewTestTable (can be used if a table with the same name was already created since the drop)  
.undo drop table TestTable as NewTestTable version="v10.3"
```

**How to find the required database version**

You can find the database version before the drop operation was executed by using the `.show` `journal` command :

```kusto
.show database TestDB journal | where Event == "DROP-TABLE" and EntityName == "TestTable" | project OriginalEntityVersion 
```

| OriginalEntityVersion |
|-----------------------|
| v24.3                 |

**Limitations**

If a Purge command was executed on this database, the undo drop table command can't be executed to a version earlier to the purge execution.

Extent can be recovered only if the hard delete period of the extent container it resides in wasn't reached yet.
