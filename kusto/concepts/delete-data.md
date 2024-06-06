---
title: Delete data
description: This article describes delete scenarios, including purge, dropping extents and retention based deletes.
ms.reviewer: avneraa
ms.topic: how-to
ms.date: 02/01/2022
---

# Delete data

There are several ways to delete data from a table. Use the following information to help you choose which deletion method is best for your use case.

| Use case | Considerations | Method |
|--|--|--|
| Delete all data from a table | | [Use the `.clear table data` command](#delete-all-data-in-a-table) |
| Routinely delete old data | Use if you need an automated deletion solution | [Use a retention policy](#delete-data-using-a-retention-policy) |
| Bulk delete specific data by extents | Only use if you are an expert user | [Use the `.drop extents` command](#delete-data-by-dropping-extents) |
| Delete records based on their content | - Storage artifacts that contain the deleted records aren't necessarily deleted<br /> - Deleted records can't be recovered (regardless of any retention or recoverability settings)<br />- Use if you need a quick way to delete records | [Use soft delete](#soft-delete) |
| Delete records based on their content | - Storage artifacts that contain the deleted records are deleted<br /> - Deleted records can't be recovered (regardless of any retention or recoverability settings)<br />- Requires significant system resources and time to complete | [Use purge](#purge) |

The following sections describe the different deletion methods.

## Delete all data in a table

To delete all data in a table, use the [.clear table data](kusto/management/clear-table-data-command.md) command. This is the most efficient way to remove all data from a table.

Syntax:

```kusto
.clear table <TableName> data
```

## Delete data using a retention policy

Automatically delete data based on a [retention policy](kusto/management/retention-policy.md). You can set the retention policy at the database or table level. There is no guarantee as to when the deletion occurs, but it will not be deleted before the retention period. This is a very efficient and convenient way to remove old data.

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

Both purge and soft delete can be used for deleting individual rows, but while soft delete doesn't necessarily delete the storage artifacts that contain records to delete, purge does delete all such storage artifacts.

Both methods prevent deleted records from being recovered, regardless of any retention or recoverability settings. The deletion process is final and irreversible.

### Soft delete

With [soft delete](kusto/concepts/data-soft-delete.md), data is not necessarily deleted from storage artifacts. This method marks all matching records as deleted, so that they will be filtered out in queries, and doesn't require significant system resources.

### Purge

With [purge](kusto/concepts/data-purge.md), extents that have one or more records to be deleted, are replaced with new extents in which those records do not exist. This deletion process isn't immediate, requires significant system resources, and can take a whole day to complete.
