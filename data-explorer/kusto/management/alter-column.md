---
title: .alter column - Azure Data Explorer | Microsoft Docs
description: This article describes .alter column in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/11/2020
---
# .alter column

Alters the data type of an existing table column.

> [!WARNING]
> When altering the data type of a column, any pre-existing data in that column
> which is not of the new data type will be ignored in future queries and will be
> replaced by a [null value](../query/scalar-data-types/null-values.md). After using `alter column`, that data
> cannot be recovered, even through using another command
> to alter the column type back to a previous value.
> See [below](#changing-column-type-without-data-loss) for the recommended procedure for changing the type of a column
> without losing data.

**Syntax** 

`.alter` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnName* `type` `=` *ColumnNewType*
 
**Example** 

```kusto
.alter column ['Table'].['ColumnX'] type=string
```

## Changing column type without data loss

To change column type while retaining the historical data, create a new, properly typed table.

For each table `T1` you'd like to change a column type in, execute the following steps:

1. Create a table `T1_prime` with the correct schema (the right column types).
1. Swap the tables using [.rename tables](rename-table-command.md) command, which allows swapping table names.

```kusto
.rename tables T_prime=T1, T1=T_prime
```

When the command completes, the new data flows to `T1` that is now typed correctly and the historical data is available in `T1_prime`.

Until `T1_prime` data goes out of the retention window, queries touching `T1` need to be altered to perform union with `T1_prime`.