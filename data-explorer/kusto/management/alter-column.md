---
title: .alter column - Azure Data Explorer
description: This article describes .alter column in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# .alter column

Alters the data type of an existing table column.

> [!WARNING]
> When altering the data type of a column, any pre-existing data in that column will return a [null value](../query/scalar-data-types/null-values.md) in future queries.
> After using `.alter column`, that data cannot be recovered, even by using another command to alter the column type back to a previous value.
> If you need to preserve pre-existing data, see our recommended [procedure for changing the type of a column without losing data](#changing-column-type-without-data-loss).

**Syntax** 

`.alter` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnName* `type` `=` *ColumnNewType*
 
**Example** 

```kusto
.alter column ['Table'].['ColumnX'] type=string
```

## Changing column type without data loss

To change column type while retaining the historical data, create a new, properly typed table.

For each table `T1` you'd like to change a column type in, execute the following steps:

1. Create a table `T1_prime` with the correct schema (the right column types and the same column order).
1. Ingest the data into `T1_prime` from `T1`, applying the required data transformations. In the example below, Col1 is being converted to the string data type.

    `.set-or-append T1_prime <| T1 | extend Col1=tostring(Col1)`

1. Swap the tables using [.rename tables](rename-table-command.md) command, which allows swapping table names.

    ```kusto
    .rename tables T_prime=T1, T1=T_prime
    ```

    When the command completes, the new data from existing ingestion pipelines flows to `T1` that is now typed correctly.

1. Drop the table `T1_prime`

    `T1_prime` will include only a copy of the historical data (before the schema change) and can be safely dropped after confirming the schema and data in `T1` were correctly updated.

    `.drop table T1_prime`
