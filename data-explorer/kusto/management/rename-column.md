---
title: rename column - Azure Data Explorer
description: This article describes rename column in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# .rename column

Changes the name of an existing table column.
To change the name of multiple columns, see [below](#rename-columns).

## Permissions

You must have at least [Table Admin](../management/access-control/role-based-access-control.md) permissions to run this command.

### Syntax

`.rename` `column` [*DatabaseName*`.`]*TableName*`.`*ColumnExistingName* `to` *ColumnNewName*

Where *DatabaseName*, *TableName*, *ColumnExistingName*, and *ColumnNewName*
are the names of the respective entities and follow the [identifier naming rules](../query/schema-entities/entity-names.md).

## rename columns

Changes the names of multiple existing columns in the same table.

### Syntax

`.rename` `columns` *Col1* `=` [*DatabaseName*`.`[*TableName*`.`*Col2*]] `,` ...

The command can be used to swap the names of two columns (each is renamed as
the other's name.)

>[!NOTE]
>`rename columns` only supports swapping exactly two columns.

### Example

```kusto
.rename columns TimeGenerated_archive = myDB.sampleData.TimeGenerated, TimeGenerated = myDB.sampleData.TimeGenerated_archive
```
