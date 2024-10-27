---
title:  .alter column command
description: Learn how to use the `.alter column` command to alter the data type of an existing table column.
ms.reviewer: alexans
ms.topic: reference
ms.date: 10/14/2024
---
# .alter column command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters the data type of an existing table column.

> [!WARNING]
> When altering the data type of a column, any preexisting data in that column will return a [null value](../query/scalar-data-types/null-values.md) in future queries.
> After using `.alter column`, that data cannot be recovered, even by using another command to alter the column type back to a previous value.
> For information on how to preserve preexisting data, see [Change column type without data loss](change-column-type-without-data-loss.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnName* `type` `=` *ColumnNewType*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` ||The name of the database that contains the table.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table that contains the column to alter.|
|*ColumnName*| `string` | :heavy_check_mark:|The name of the column to alter.|
|*ColumnNewType*| `string` | :heavy_check_mark:|The new [data type](../query/scalar-data-types/index.md) for the column.|

## Example

```kusto
.alter column ['Table'].['ColumnX'] type=string
```

## Related content

* [.alter-merge table column-docstrings command](alter-merge-table-column.md) and [.alter table column-docstrings command](alter-column-docstrings.md)
* [.alter column policy encoding command](alter-encoding-policy.md)
* [.rename column command](rename-column.md)
* [.drop column command](drop-column.md)