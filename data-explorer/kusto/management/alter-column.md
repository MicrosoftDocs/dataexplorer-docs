---
title:  .alter column command
description: Learn how to use the `.alter column` command to alter the data type of an existing table column.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .alter column command

Alters the data type of an existing table column.

> [!WARNING]
> When altering the data type of a column, any pre-existing data in that column will return a [null value](../query/scalar-data-types/null-values.md) in future queries.
> After using `.alter column`, that data cannot be recovered, even by using another command to alter the column type back to a previous value.
> If you need to preserve pre-existing data, see our recommended [procedure for changing the type of a column without losing data](#changing-column-type-without-data-loss).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnName* `type` `=` *ColumnNewType*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

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

## Changing column type without data loss

To change column type while retaining the historical data, create a new, properly typed table.

For each table `T1` you'd like to change a column type in, execute the following steps:

1. Create a table `T1_prime` with the correct schema (the right column types and the same column order).
1. Ingest the data into `T1_prime` from `T1`, applying the required data transformations. In the example below, Col1 is being converted to the string data type.

    ```kusto
    .set-or-append T1_prime <| T1 | extend Col1=tostring(Col1)
    ```

1. Swap the tables using [.rename tables](rename-table-command.md) command, which allows swapping table names.

    ```kusto
    .rename tables T_prime=T1, T1=T_prime
    ```

    When the command completes, the new data from existing ingestion pipelines flows to `T1` that is now typed correctly.

1. Drop the table `T1_prime`

    `T1_prime` will include only a copy of the historical data (before the schema change) and can be safely dropped after confirming the schema and data in `T1` were correctly updated.

    ```kusto
    .drop table T1_prime
    ```

Example:

Change column "Col1" data type in table `T1` from guid to string.

```kusto
// Create table T1
.create table T1 (Col1:guid, Id:int)

// Ingest sample data into T1
.ingest inline into table T1 <|
b642dec0-1040-4eac-84df-a75cfeba7aa4,1
c224488c-ad42-4e6c-bc55-ae10858af58d,2
99784a64-91ad-4897-ae0e-9d44bed8eda0,3
d8857a93-2728-4bcb-be1d-1a2cd35386a7,4
b1ddcfcc-388c-46a2-91d4-5e70aead098c,5

// Create table T1_prime with the correct schema and same column order
.create table T1_prime (Col1:string, Id:int)

// Append data to the new table
.set-or-append T1_prime <| T1 | extend Col1=tostring(Col1)

// Rename tables
.rename tables T1_prime = T1, T1 = T1_prime

// Drop table T1_prime, which now has the old schema and data
.drop table T1_prime
```
