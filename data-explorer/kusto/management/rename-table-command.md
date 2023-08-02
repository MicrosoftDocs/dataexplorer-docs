---
title: .rename table command
description: Learn how to use the `.rename table` command to change the name of an existing table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .rename table command

Changes the name of an existing table.

The `.rename tables` command changes the name of a number of tables in the database as a single transaction.

## Permissions

You must have at least [Table Admin](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.rename` `table` *OldName* `to` *NewName*

`.rename` `tables` *NewName* `=` *OldName* [`ifexists`] [`,` ...]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*OldName*|string|&check;|The name of an existing table. An error is raised and the whole command fails if *OldName* doesn't name an existing table, unless `ifexists` is specified.|
|*NewName*|string|&check;|The new name for the table that used to be called *OldName*.|
|`ifexists`|string||If specified, the command will handle the scenario where the table doesn't exist. Instead of failing, it will proceed without attempting to rename the table that doesn't exist.|

**Remarks**

This command operates on tables of the database in scope only.
Table names can't be qualified with cluster or database names.

This command doesn't create new tables, nor does it remove existing tables.
The transformation described by the command must be such that the number
of tables in the database doesn't change.

The command **does** support swapping table names, or more complex
permutations, as long as they adhere to the rules above. For example, ingest data into multiple staging tables,
and then swap them with existing tables in a single transaction.

## Examples

Imagine a database with the following tables: `A`, `B`, `C`, and `A_TEMP`.
The following command will swap `A` and `A_TEMP` (so that the `A_TEMP` table will now be called `A`, and the other way around), rename
`B` to `NEWB`, and keep `C` as-is. 

```kusto
.rename tables A=A_TEMP, NEWB=B, A_TEMP=A
```

The following sequence of commands:

1. Creates a new temporary table
1. Replaces an existing or nonexisting table with the new table

```kusto
// Drop the temporary table if it exists
.drop table TempTable ifexists

// Create a new table
.set TempTable <| ...

// Swap the two tables
.rename tables TempTable=Table ifexists, Table=TempTable

// Drop the temporary table (which used to be Table) if it exists
.drop table TempTable ifexists
```

**Rename source table of a materialized view**

If the table being renamed is the source table of a [materialized view](materialized-views/materialized-view-overview.md), you can specify the following property as part of the `.rename` command:

`.rename` `table` *OldName* `to` *NewName* `with (updateMaterializedViews=true)`

The table will be renamed and all materialized views referencing *OldName* will be updated to point to *NewName*, in a transactional way.

> [!NOTE]
> The command will only work if the source table is referenced directly in the materialized view query. If the source table is referenced from a stored function invoked by the view query, the command will fail, since the command cannot update the stored function.
