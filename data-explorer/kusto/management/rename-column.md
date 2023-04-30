---
title: rename column - Azure Data Explorer
description: This article describes rename column in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/30/2023
---
# .rename column

Changes the name of an existing table column.

To change the name of multiple columns, see [Rename multiple columns](#rename-multiple-columns).

## Permissions

You must have at least [Table Admin](../management/access-control/role-based-access-control.md) permissions to run this command.

### Syntax

`.rename` `column` [ *DatabaseName*`.`]*TableName*`.`*CurrentColumnName* `to` *NewColumnName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string||The name of the database that contains the table with the column to rename. If not provided, the current context database is used.|
|*TableName*|string|&check;|The name of the table containing the column to rename.|
|*CurrentColumnName*|string|&check;|The name of the column to rename.|
|*NewColumnName*|string|&check;|The new name for the column. The name must follow the [identifier naming rules](../query/schema-entities/entity-names.md).|

## Rename multiple columns

Swaps the names of two existing columns in the same table.

> [!NOTE]
> `rename columns` only supports swapping exactly two columns.

### Syntax

`.rename` `columns` *NewColumnName* `=` [ *DatabaseName*`.`]*TableName*`.`*CurrentColumnName* `,` ...

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string||The name of the database that contains the table with the column to rename. If not provided, the current context database is used.|
|*TableName*|string|&check;|The name of the table containing the column to rename.|
|*CurrentColumnName*|string|&check;|The name of the column to rename.|
|*NewColumnName*|string|&check;|The new name for the column. The name must follow the [identifier naming rules](../query/schema-entities/entity-names.md).|

### Example

```kusto
.rename columns TimeGenerated_archive = myDB.sampleData.TimeGenerated, TimeGenerated = myDB.sampleData.TimeGenerated_archive
```
