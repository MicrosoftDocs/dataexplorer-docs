---
title:  Change column type without data loss
description: Learn how to preserve preexisting data by changing column type without data loss.
ms.reviewer: alexans
ms.topic: reference
ms.date: 10/14/2024
---
# Change column type without data loss

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The [.alter column](alter-column.md) command changes the column type, making the original data unrecoverable. To preserve preexisting data while changing the column type, create a new, properly typed table.

For each table `OriginalTable` you'd like to change a column type in, execute the following steps:

1. Create a table `NewTable` with the correct schema (the right column types and the same column order).
1. Ingest the data into `NewTable` from `OriginalTable`, applying the required data transformations. In the following example, Col1 is being converted to the string data type.

    ```kusto
    .set-or-append NewTable <| OriginalTable | extend Col1=tostring(Col1)
    ```

1. Use the [.rename tables](rename-table-command.md) command to swap table names.

    ```kusto
    .rename tables NewTable=OriginalTable, OriginalTable=NewTable
    ```

    When the command completes, the new data from existing ingestion pipelines flows to `OriginalTable` that is now typed correctly.

1. Drop the table `NewTable`

    `NewTable` will include only a copy of the historical data (before the schema change) and can be safely dropped after confirming the schema and data in `OriginalTable` were correctly updated.

    ```kusto
    .drop table NewTable
    ```

## Example

The following example updates the schema of `OriginalTable` while preserving its data. It creates two tables `OriginalTable` and `NewTable`, each with a column, "Col1," of types guid and string respectively and ingests data into `OriginalTable`. It appends data from `OriginalTable` to `NewTable` and uses the `tostring()` function to convert the "Col1" column from guid to string type. It then swaps table names and drops the table with the old schema and data.

```kusto

.create table OriginalTable (Col1:guid, Id:int)

.ingest inline into table OriginalTable <|
b642dec0-1040-4eac-84df-a75cfeba7aa4,1
c224488c-ad42-4e6c-bc55-ae10858af58d,2
99784a64-91ad-4897-ae0e-9d44bed8eda0,3
d8857a93-2728-4bcb-be1d-1a2cd35386a7,4
b1ddcfcc-388c-46a2-91d4-5e70aead098c,5

.create table NewTable (Col1:string, Id:int)

.set-or-append NewTable <| OriginalTable | extend Col1=tostring(Col1)

.rename tables NewTable = OriginalTable, OriginalTable = NewTable

.drop table NewTable
```

## Related content

* [Columns management](columns.md)
* [.alter column command](alter-column.md)