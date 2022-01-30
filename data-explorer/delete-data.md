---
title: Delete data from Azure Data Explorer
description: This article describes delete scenarios in Azure Data Explorer, including purge, dropping extents and retention based deletes.
author: orspod
ms.author: orspodek
ms.reviewer: avneraa
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/26/2022
---

# Delete data from Azure Data Explorer

Azure Data Explorer supports several ways to delete data from a table. Use the following information to help you choose which deletion method is best for your use case.

| Use case | Considerations | Method |
|--|--|--|
| Drop all data from a table | | [Use the `.clear table data` command](#delete-all-data-in-a-table) |
| Routinely drop old data | Use if you need an automated deletion solution | [Use a retention policy](#delete-data-using-a-retention-policy) |
| Bulk drop specific data by extents | Only use if you are an expert user | [Use the `.drop extents` command](#delete-data-by-dropping-extents) |
| Drop a few records based on their contents | Storage artifacts that contain the deleted records aren't necessarily deleted, but deleted records can't be recovered (regardless of any retention or recoverability settings) | [Use soft delete](#soft-delete) |
| Permanently drop records based on their contents | Dropped records can't be recovered, regardless of any retention or recoverability settings | [Use purge](#purge) |

The following sections describe the different deletion methods.

## Delete all data in a table

To delete all data in a table, use the [.clear table data](kusto/management/clear-table-data-command.md) command. This is the most efficient way to remove all data from a table.

For example:

```kusto
.clear table <TableName> data
```

## Delete data using a retention policy

Automatically delete data based on a [retention policy](kusto/management/retentionpolicy.md). You can set the retention policy at the database or table level. This is a very efficient and convenient way to remove old data, but there is no guarantee as to when the removal occurs.

Consider a database or table that is set for 90 days of retention. If only 60 days of data are needed, delete the older data as follows:

```kusto
.alter-merge database <DatabaseName> policy retention softdelete = 60d

.alter-merge table <TableName> policy retention softdelete = 60d
```

## Delete data by dropping extents

[Extent (data shard)](kusto/management/extents-overview.md) is the internal structure where data is stored. Each extent can hold up to millions of records. Extents can be deleted individually or as a group using [drop extent(s) commands](./kusto/management/drop-extents.md).

### Examples

You can delete all rows in a table or just a specific extent.

- Delete all rows in a table:

    ```kusto
    .drop extents from TestTable
    ```

- Delete a specific extent:

    ```kusto
    .drop extent e9fac0d2-b6d5-4ce3-bdb4-dea052d13b42
    ```

## Delete individual rows

Both purge and soft-delete can be used for deleting individuals rows, but they are designed for completely different scenarios.

### Soft delete

With [soft delete](kusto/concepts/data-soft-delete.md), data is not necessarily deleted from storage artifacts. This method marks all matching records as deleted, so that they can be filtered out by queries, and doesn't require significant system resources. The deletion process is final and irreversible.

### Purge

With [purge](kusto/concepts/data-purge.md), all storage artifacts that have "poison" data is deleted and is useful for removing corrupt data. The deletion isn't immediate, requires significant system resources, and can take a whole day to complete. This method prevents deleted records from being recovered, regardless of retention or recoverability settings. The deletion process is final and irreversible.
