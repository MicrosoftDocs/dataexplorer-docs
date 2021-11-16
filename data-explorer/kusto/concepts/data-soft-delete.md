---
title: Data soft-delete - Azure Data Explorer
description: This article describes Data soft-delete in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: slneimer
ms.service: data-explorer
ms.topic: reference
ms.date: 21/11/2021
---
# Data soft-delete (Public Preview)

As a data platform, Azure Data Explorer supports the ability to delete individual records. There are two common ways to do this:

* To delete records for compliance purposes (e.g. GDPR), use [.purge](./data-purge.md) - this will delete all the relevant data from the storage artifacts, and there will be no way to recover the deleted data.
* To delete records for any other purpose, use `.delete` described in this document - this will internally mark the records as deleted, but won't necessarily delete the data from the storage artifacts. This deletion method is much faster than purge.

> [!WARNING]
> Data deletion through the `.delete` command is designed to be used to delete **small amounts** of data, and is intended to be called **infrequently**. Abuse may have a significant performance impact on the service.
>
> To delete large amounts of data, you should consider other options, like [dropping extents](../management/drop-extents.md).

> [!NOTE]
> Data deletion through the `.delete` command is only available on clusters running Engine V3.

## Use cases

This deletion method should only be used for unplanned deletion of individual records. For example, if you found out that a certain IOT device was reporting corrupted telemetry for a certain period of time, then it's a valid use-case for using this deletion method.

However, if you want to do periodic cleanup by regularly deleting duplicate records, or deleting old records per entity, then you should use [Materialized Views](../management/materialized-views/materialized-view-overview.md) instead.

## Deletion process

The process of selectively deleting data from Azure Data Explorer consists of two phases:

1. Phase 1:
   Given an input with a table name and a per-record predicate, indicating which records to delete, Kusto scans the table looking to identify data extents that would participate in the data deletion. The extents identified are those having one or more records for which the predicate returns true.
1. Phase 2:
   Kusto replaces each data extent in the table (identified in step (1)) with a new one, which will point to the original data blobs, and will also contain a new hidden column of type `bool`, indicating per record whether it was deleted or not. If new data is not being ingested into the table, then by the end of this phase, queries will no longer return data for which the predicate returns true.

## Limitations and considerations

* The deletion process is final and irreversible. It isn't possible to undo this process or recover data that has been deleted (even though the storage artifacts are not necessarily deleted following the operation).

* Soft-delete is only available on clusters running Engine V3.

* Soft-delete is only supported for native Kusto tables, and is not supported for External Tables and Materialized Views.

* Before running soft-delete, verify the predicate by running a query and checking that the results match the expected outcome. You can also run the command in `whatif` mode, that returns the number of records that are expected to be deleted.

* You should not run multiple parallel soft-delete operations on the same table, as this may result in failures of some or all the commands. However, it's possible to run multiple parallel soft-delete operations on different tables.

* You should not run soft-delete and purge commands on the same table in parallel, you should first wait for one command to complete, and only then run the other command.

* Soft-delete is executed against the Engine endpoint: `https://[YourClusterName].[region].kusto.windows.net`. The command requires [database admin](../management/access-control/role-based-authorization.md) permissions on the relevant database.

* Effect on Materialized Views that are based on a table in which records are deleted: Every materialization cycle looks at the previous snapshot of the Materialized View, and combines it with the new data that landed in the table after the previous materialization cycle. So if you delete records that have been ingested after the previous materialization cycle, before a new cycle started, the new records (that you then deleted) won't be used for the materialization process. Otherwise, deleting records won't have any effect on the Materialized View.

## Deletion performance

As described [above](#deletion-process), the deletion process consists of two phases:

* The first phase runs the predicate. The performance of this phase is very similar to the performance of the predicate itself (it might be slightly faster or slightly slower, depending on the predicate, but the difference is expected to be insignificant).
* The second phase replaces extents that contain records that should be deleted, with new extents in which the relevant records are marked as deleted. The performance of this phase depends on the following parameters:
  * Record distribution across the data extents in the cluster
  * The number of nodes in the cluster  
  * Several other factors

Unlike `.purge`, the `.delete` command does not reingest the data (it just adds a hidden column of type `bool` indicating whether the records are deleted or not), and is hence much faster.

## Query performance after deletion

Query performance is not expected to noticeably degrade following deletion of records, as all that happens when a query runs, is that an implicit condition is automatically added on all queries, checking the values in the hidden column of type `bool`, that indicates per record whether it was deleted or not.

On the other hand, it is not guaranteed that query performance will improve either, following deletion of records. While this may happen for some types of queries, it may not happen for some others. For improved query performance, Azure Data Explorer may periodically compact extents in which the majority of the records are deleted, by replacing them with new extents that only contain the records that haven't been deleted.

## Impact on COGS (cost of goods sold)

Deletion of records won't result in change of COGS, in most cases:

* There will be no decrease, because no records are actually deleted, they are only marked as deleted in a hidden column of type `bool` (the size of which is negligible).
* In most cases, there will be no increase, because the `.delete` operation does not require provisioning of extra resources.
* In some cases, Azure Data Explorer may periodically compact extents in which the majority of the records are deleted, by replacing them with new extents that only contain the records that haven't been deleted. This will cause deletion of the old storage artifacts (that contain a large amount of deleted records). The new extents will be smaller, and will therefore consume less space in both the Storage account, and in the hot-cache. However, in most cases, the effect of this on COGS is negligible.

## Triggering the deletion process

### Syntax

```kusto
`.delete` [`async`] `table` *TableName* `records <|` *Predicate*
```

### Arguments

* `async`: If specified, indicates that the command runs in asynchronous mode.

* *TableName*: The name of the table from which records should be deleted.

* *Predicate*: The predicate (in the form of a query) that returns records that should be deleted

> [!NOTE]
> The following restrictions apply to the *Predicate*:
>
> * The predicate should have at least one `where` operator.
> * The predicate can only use the following operators: `extend`, `where` and `project`.
> * The predicate can't reference other tables, nor use `externaldata`.

#### Example

To delete all the records which contain data of a given user:

```kusto
.delete table MyTable records <| MyTable | where UserId == 'X'
```

> [!NOTE]
>
> To only see how many records would be deleted by the operation (but without deleting anything), look at the sum of the values in the RecordsMatchPredicate column in the result of the following command:
>
> ```kusto
> .delete table MyTable records with (whatif=true) <| MyTable | where UserId == 'X'
> ```

### Output

The output of the command contains information on which extents were replaced.
