---
title: Columns - Azure Data Explorer | Microsoft Docs
description: This article describes Columns in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Columns

## rename column

Change the name of an existing column.

```kusto
.rename column [database_name.table_name.old_column_name] to [new_column_name]
```

## rename columns

Currently swaps names of two columns.

```kusto
.rename columns column1_name = [database_name.table_name.column2_name], column2_name = [database_name.table_name.column1_name]

```

## alter column 

Modifies the data type of a given column. 

```kusto
.alter column [qualified_existing_column_name] type=[new_column_type]  
```

> Any existing data in the column which is not of the new data type will be ignored in future queries, and assumed to be null. A future command to "re-set" the column type to the original type will not regain that data. 
 
**Syntax** 
 
* `qualified column name`: `database_name.table_name.column_name` 
(or just `table_name`.`column_name` if the command run in context of specific database).
 
**Example** 

```kusto
.alter column Table.ColumnX type=string 
```

**Changing column type without loosing the data**

The right way to change column type while retaining the historical data is to create a new, properly typed table.

For each table `T1` you'd like to change a column type in, execute the following steps:
* Create a table `T1_prime` with the correct schema (the right column types)
* Swap the tables using [.rename tables](./tables.md#rename-tables) command, which allows swapping table names:

```kusto
.rename tables T_prime=T1, T1=T_prime
```

When the command completes, the new data is flowing to `T1` that is now typed correctly and the historical data is available in `T1_prime`.
* **Until `T1_prime` data goes out of the retention window,  queries touching `T1` would need to be altered to perform union with `T1_prime`**.

## drop column

```kusto
.drop column [Table].[Column]
```

Removes a column.

## drop table columns

```kusto
.drop table [Table] columns ([Column1], [Column2])
```

Removes columns from a table.

## alter table column-docstrings

`.alter` `table` [Table] `column-docstrings` ([Column1]:"DocString1", [Column2]:"DocString2")

`.alter-merge` `table` [Table] `column-docstrings` ([Column1]:"DocString1", [Column2]:"DocString2")

.alter - sets the values for the columns' documentation strings according to the input. The documentation strings for columns that are not in the input are cleaned.

.alter-merge - sets the values for the columns' documentation strings according to the input. The documentation strings for columns that are not in the input remain untouched.

**Example** 

```kusto
.alter table Table1 column-docstrings 
(Column1:"DocString1", Column2:"DocString2")

.alter-merge table Table1 column-docstrings 
(Column1:"DocString1", Column2:"DocString2")
```