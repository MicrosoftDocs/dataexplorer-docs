---
title: .drop column command
description: Learn how to use the `.drop column` command to remove a column from a table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .drop column command

Removes a column from a table.

To drop multiple columns from a table, see [drop multiple table columns](#drop-multiple-table-columns).

> [!NOTE]
> This command does not physically delete the data, and does not reduce the cost of storage
> for data that was already ingested.

> [!WARNING]
> This command is irreversible. All data in the column that is removed will no longer by queryable.
> Future commands to add that column back will not be able to restore the data.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `column` *TableName*`.`*ColumnName* [`ifexists`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table containing the column to drop.|
|*ColumnName*|string|&check;|The name of the column to drop.|
|`ifexists`|string||If specified, the command won't fail on a non-existent column.|

## Example

The following command will drop the `Value` column from the `Test` database, if such a column exists. If the column doesn't exist, the command will not fail.

```kusto
.drop column Test.Value ifexists
```

## Drop multiple table columns

Removes multiple columns from a table.

> [!NOTE]
> This command does not physically delete the data, and does not reduce the cost of storage
> for data that was already ingested.

> [!WARNING]
> This command is irreversible. All data in the column that is removed will no longer by queryable.
> Future commands to add those columns back will not be able to restore the data.

### Syntax

`.drop` `table` *TableName* `columns` `(` *ColumnName* [`,` ...] `)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table containing the column to drop.|
|*ColumnName*|string|&check;|The name of the column to drop.|

### Example

The following command will drop the `Value` and `Item` columns from the `Test` database.

```kusto
.drop table Test columns ( Value, Item )
```
