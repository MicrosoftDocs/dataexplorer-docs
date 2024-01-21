---
title: .rename column command
description: Learn how to use the `.rename column` command to change the name of a column in an existing table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .rename column command

Changes the name of existing table columns.

## Permissions

You must have at least [Table Admin](../management/access-control/role-based-access-control.md) permissions to run this command.

### Syntax

`.rename` `column` [ *DatabaseName*`.`]*TableName*`.`*CurrentColumnName* `to` *NewColumnName*

`.rename` `columns` *NewColumnName* `=` [ *DatabaseName*`.`]*TableName*`.`*CurrentColumnName* `,` ...

> [!NOTE]
> `.rename` `columns` only supports swapping the names of exactly two existing columns.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string||The name of the database that contains the table with the column to rename. If not provided, the current context database is used.|
|*TableName*|string| :heavy_check_mark:|The name of the table containing the column to rename.|
|*CurrentColumnName*|string| :heavy_check_mark:|The name of the column to rename.|
|*NewColumnName*|string| :heavy_check_mark:|The new name for the column. The name must follow the [identifier naming rules](../query/schema-entities/entity-names.md).|

## Example

The following command swaps the names of the `TimeGenerated_archive` column and the `TimeGenerated` column.

```kusto
.rename columns TimeGenerated_archive = myDB.sampleData.TimeGenerated, TimeGenerated = myDB.sampleData.TimeGenerated_archive
```
