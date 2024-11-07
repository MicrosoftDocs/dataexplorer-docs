---
title: Delete data
description: This article describes delete scenarios, including purge, dropping extents and retention based deletes.
ms.reviewer: avneraa
ms.topic: how-to
ms.date: 10/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# Delete data

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Delete data from a table is supported in several ways. Use the following information to help you choose which deletion method is best for your use case.

:::moniker range="azure-data-explorer"
| Use case | Considerations | Method |
|--|--|--|
| Delete all data from a table. | | [Use the `.clear table data` command](#delete-all-data-in-a-table) |
| Routinely delete old data. | Use if you need an automated deletion solution. | [Use a retention policy](#delete-data-using-a-retention-policy) |
| Bulk delete specific data by extents. | Only use if you're an expert user. | [Use the `.drop extents` command](#delete-data-by-dropping-extents) |
| Delete records based on their content. | - Storage artifacts that contain the deleted records aren't necessarily deleted. <br /> - Deleted records can't be recovered (regardless of any retention or recoverability settings). <br />- Use if you need a quick way to delete records. | [Use soft delete](#soft-delete) |
| Delete records based on their content. | - Storage artifacts that contain the deleted records are deleted. <br /> - Deleted records can't be recovered (regardless of any retention or recoverability settings). <br />- Requires significant system resources and time to complete. | [Use purge](#purge) |
:::moniker-end

:::moniker range="microsoft-fabric"
| Use case | Considerations | Method |
|--|--|--|
| Delete all data from a table | | [Use the `.clear table data` command](#delete-all-data-in-a-table) |
| Routinely delete old data | Use if you need an automated deletion solution | [Use a retention policy](#delete-data-using-a-retention-policy) |
| Bulk delete specific data by extents | Only use if you're an expert user | [Use the `.drop extents` command](#delete-data-by-dropping-extents) |
| Delete records based on their content | - Storage artifacts that contain the deleted records aren't necessarily deleted<br /> - Deleted records can't be recovered (regardless of any retention or recoverability settings)<br />- Use if you need a quick way to delete records | [Use soft delete](#soft-delete) |
:::moniker-end

The following sections describe the different deletion methods.

## Delete all data in a table

To delete all data in a table, use the [.clear table data](../management/clear-table-data-command.md) command. This command is the most efficient way to remove all data from a table.

Syntax:

```kusto
.clear table <TableName> data
```

## Delete data using a retention policy

Automatically delete data based on a [retention policy](../management/retention-policy.md). You can set the retention policy at the database or table level. There's no guarantee as to when the deletion occurs, but it will not be deleted before the retention period. This is an efficient and convenient way to remove old data.

Consider a database or table that is set for 90 days of retention. If only 60 days of data are needed, delete the older data as follows:

```kusto
.alter-merge database <DatabaseName> policy retention softdelete = 60d

.alter-merge table <TableName> policy retention softdelete = 60d
```

## Delete data by dropping extents

[Extent (data shard)](../management/extents-overview.md) is the internal structure where data is stored. Each extent can hold up to millions of records. Extents can be deleted individually or as a group using [drop extent(s) commands](../management/drop-extents.md).

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

:::moniker range="azure-data-explorer"
Both purge and soft delete can be used for deleting individual rows. Soft delete doesn't necessarily delete the storage artifacts that contain records to delete, and purge does delete all such storage artifacts.

Both methods prevent deleted records from being recovered, regardless of any retention or recoverability settings. The deletion process is final and irreversible.

### Soft delete

With [Soft delete overview](data-soft-delete.md), data isn't necessarily deleted from storage artifacts. This method marks all matching records as deleted, so that they'll be filtered out in queries, and doesn't require significant system resources.

### Purge

With [purge](data-purge.md), extents that have one or more records to be deleted, are replaced with new extents in which those records don't exist. This deletion process isn't immediate, requires significant system resources, and can take a whole day to complete.
::: moniker-end

:::moniker range="microsoft-fabric"
[Soft delete overview](data-soft-delete.md) can be used for deleting individual rows. Data isn't necessarily deleted from storage artifacts. Soft delete prevent deleted records from being recovered, regardless of any retention or recoverability settings. The deletion process is final and irreversible. This method marks all matching records as deleted, so that they'll be filtered out in queries, and doesn't require significant system resources.
::: moniker-end
