---
title: Delete data from Azure Data Explorer
description: This article describes delete scenarios in Azure Data Explorer, including purge, dropping extents and retention based deletes.
author: orspod
ms.author: orspodek
ms.reviewer: avneraa
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/25/2022
---

# Delete data from Azure Data Explorer

Azure Data Explorer supports the following deletion scenarios:

- **[Delete all data from a table](#delete-all-data-in-a-table)**:  
Deletes all data from a table without impacting other aspects of the table, such as the schema and policy object. This is the most efficient way to remove data.

- **[Delete aging data based on a retention policy](#delete-data-using-the-retention-policy)**:  
Deletes data that is older, based on how long ago it was ingested, than the retention [period configured in the policy](kusto/management/retentionpolicy.md). There is no specific guarantee as to when removal occurs. This is a very efficient and convenient way to remove data.

- **[Delete specific data by dropping extents](#delete-data-by-dropping-extents)**:  
Deletes data by dropping extents. The data extents to be deleted can be specified in [several ways](kusto/management/drop-extents.md), such as using a query or extent tags. This is a very efficient way to remove data.

- **[Delete individual data records by using soft-delete](#soft-delete)**:  
Deletes all records in a table that match a user-specified predicate. This method initially marks all matching records as deleted and then a background process removes them. This method is inefficient relative to other methods and query performance may be impacted.

- **[Delete individual data records by using purge](#purge)**:  
Deletes all records in a table that match a user-specified predicate. This method permanently removes data and is only recommended for compliance scenarios. Purged data cannot be retrieved regardless of any configured data recoverability policies. This is the most inefficient way to remove data and can take a whole day to complete.

## Delete all data in a table

To delete all data in a table, use the [.clear table data](kusto/management/clear-table-data-command.md) command. For example:

```kusto
.clear table <TableName> data
```

## Delete data using the retention policy

Automatically delete data based on the [retention policy](kusto/management/retentionpolicy.md). Set the retention policy at the database or table level.

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

### Soft-delete

With [soft-delete](kusto/concepts/data-soft-delete.md), data is not necessarily deleted from storage artifacts and, as such, it cannot be used for compliance scenarios. The deletion is immediate and doesn't require significant system resources.

### Purge

With [purge](kusto/concepts/data-purge.md), all storage artifacts that have "poison" data is deleted. The deletion isn't immediate and requires significant system resources. As such, it's only recommended for compliance scenarios.
