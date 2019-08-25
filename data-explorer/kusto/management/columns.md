---
title: Columns management - Azure Data Explorer | Microsoft Docs
description: This article describes Columns management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Columns management

## rename column

The `.rename column` command changes the name of an existing table column.

`.rename` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnExistingName* `to` *ColumnNewName*

Where *DatabaseName*, *TableName*, *ColumnExistingName*, and *ColumnNewName*
are the names of the respective entities and follow the [identifier naming rules](../query/schema-entities/entity-names.md).

## rename columns

The `.rename columns` command changes the names of multiple existing columns
in the same table.

`.rename` `columns` *Col1* `=` [*DatabaseName* `.` [*TableName* `.` *Col2*]] `,` ...

The command can be used to swap the names of two columns (each is renamed as
the other's name.)

## alter column

The `.alter column` command alters the data type of an existing table column.

> [!WARNING]
> When altering the data type of a column any pre-existing data in that column
> which is not of the new data type will be ignored in future queries, and
> replaced by a [null value](../query/scalar-data-types/null-values.md). That data
> cannot be recovered following this command, even through using another command
> to alter the column type back to a previous value.
> See below for the recommended procedure for changing the type of a column
> without losing data.

`.alter` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnName* `type` `=` *ColumnNewType*
 
**Example** 

```kusto
.alter column ['Table'].['ColumnX'] type=string
```

**Changing column type without data loss**

The right way to change column type while retaining the historical data is to create a new, properly typed table.

For each table `T1` you'd like to change a column type in, execute the following steps:

* Create a table `T1_prime` with the correct schema (the right column types)
* Swap the tables using [.rename tables](./tables.md#rename-tables) command, which allows swapping table names:

```kusto
.rename tables T_prime=T1, T1=T_prime
```

When the command completes, the new data is flowing to `T1` that is now typed correctly and the historical data is available in `T1_prime`.

* Until `T1_prime` data goes out of the retention window,  queries touching `T1` would need to be altered to perform union with `T1_prime`.

## drop column

The `.drop column` command removes a column from a table.

> [!WARNING]
> This command is irreversible. All data in the column that is removed will be deleted.
> Future commands to add that column back will not be able to regain it.

`.drop` `column` *TableName* `.` *ColumnName*

## drop table columns

The `.drop table columns` command removes a number of columns from a table.

> [!WARNING]
> This command is irreversible. All data in the columns that are removed will be deleted.
> Future commands to add those columns back will not be able to regain it.

`.drop` `table` *TableName* `columns` `(` *Col1* [`,` *Col2*]... `)`

## alter table column-docstrings

The `.alter table column-docstrings` command sets the `docstring` property
of one or more columns of the specified table. Columns that are not explicitly
set will have this property removed.

`.alter` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

**Example** 

```kusto
.alter table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```

## alter-merge table column-docstrings

The `.alter-merge table column-docstrings` command sets the `docstring` property
of one or more columns of the specified table. Columns that are not explicitly
set will retain their existing value for this property, if they have one.

`.alter-merge` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

**Example** 

```kusto
.alter-merge table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```