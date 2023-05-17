---
title: Data soft delete - Azure Data Explorer
description: This article describes Data soft delete in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 03/02/2023
---
# Soft delete

As a data platform, Azure Data Explorer supports the ability to delete individual records. This is commonly achieved using one of the following methods:

* To delete records with a system guarantee that the storage artifacts containing these records are deleted as well, use [.purge](./data-purge.md)
* To delete records without such a guarantee, use `.delete` as described in this topic - this marks records as deleted but doesn't necessarily delete the data from storage artifacts. This deletion method is much faster than purge.

## Use cases

This deletion method should only be used for the unplanned deletion of individual records. For example, if you discover that an IoT device is reporting corrupt telemetry for some time, you should consider using this method to delete the corrupt data.

If you need to frequently delete records for deduplication or updates, we recommend using [materialized views](../management/materialized-views/materialized-view-overview.md). See [choose between materialized views and soft delete for data deduplication](../../dealing-with-duplicates.md#choose-between-materialized-views-and-soft-delete-for-data-deduplication).

## Deletion process

The soft delete process is performed using the following steps:

1. **Run predicate query**: The table is scanned to identify data extents that contain records to be deleted. The extents identified are those with one or more records returned by the predicate query.
1. **Extents replacement**: The identified extents are replaced with new extents that point to the original data blobs, and also have a new hidden column of type `bool` that indicates per record whether it was deleted or not. Once completed, if no new data is ingested, the predicate query won't return any records if run again.

## Limitations and considerations

* The deletion process is final and irreversible. It isn't possible to undo this process or recover data that has been deleted, even though the storage artifacts aren't necessarily deleted following the operation.

* Soft delete is only available on clusters running Engine V3.

* Soft delete is supported for native tables and materialized views. It isn't supported for external tables.

* Before running soft delete, verify the predicate by running a query and checking that the results match the expected outcome. You can also run the command in `whatif` mode, that returns the number of records that are expected to be deleted.

* Don't run multiple parallel soft delete operations on the same table, as this may result in failures of some or all the commands. However, it's possible to run multiple parallel soft delete operations on different tables.

* Don't run soft delete and purge commands on the same table in parallel. First wait for one command to complete and only then run the other command.

* Soft delete is executed against your engine endpoint: `https://[YourClusterName].[region].kusto.windows.net`. The command requires [database admin](../management/access-control/role-based-access-control.md) permissions on the relevant database.

## Deletion performance

The main considerations that can impact the [deletion process](#deletion-process) performance are:

* **Run predicate query**: The performance of this step is very similar to the performance of the predicate itself. It might be slightly faster or slower depending on the predicate, but the difference is expected to be insignificant.
* **Extents replacement**: The performance of this step depends on the following:
    * Record distribution across the data extents in the cluster
    * The number of nodes in the cluster

Unlike `.purge`, the `.delete` command doesn't reingest the data. It just marks records that are returned by the predicate query as deleted and is therefore much faster.

## Query performance after deletion

Query performance isn't expected to noticeably change following the deletion of records.

Performance degradation isn't expected because the filter that is automatically added on all queries that filter out records that were deleted is very efficient.

However, query performance is also not guaranteed to improve. While this may happen for some types of queries, it may not happen for some others. In order to improve query performance, extents in which the majority of the records are deleted are periodically compacted by replacing them with new extents that only contain the records that haven't been deleted.

## Impact on COGS (cost of goods sold)

In most cases, the deletion of records won't result in a change of COGS.

* There will be no decrease, because no records are actually deleted. Records are only marked as deleted using a hidden column of type `bool`, the size of which is negligible.
* In most cases, there will be no increase because the `.delete` operation doesn't require the provisioning of extra resources.
* In some cases, extents in which the majority of the records are deleted are periodically compacted by replacing them with new extents that only contain the records that haven't been deleted. This causes the deletion of the old storage artifacts that contain a large number of deleted records. The new extents are smaller and therefore consume less space in both the Storage account and in the hot cache. However, in most cases, the effect of this on COGS is negligible.

## Soft delete for table

Soft delete can affect materialized views that are based on a source table in which records are deleted. This can happen because every [materialization cycle](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work) adds newly ingested data to the materialized part from the previous cycle. Therefore, if the command deletes newly ingested records before a new cycle begins, those records won't be added to the materialized view. Otherwise, deleting records won't affect the materialized view.

### Syntax

`.delete` [`async`] `table` *TableName* `records` [`with (`propertyName `=` propertyValue [`,` ...]`)`] `<|` *Predicate*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`|string||If specified, indicates that the command runs in asynchronous mode.|
|*TableName*|string|&check;|The name of the table from which to delete records.|
|*Predicate*|string|&check;|The predicate that returns records to delete. Specified as a query.|

> [!NOTE]
> The following restrictions apply to the *Predicate*:
>
> * The predicate should have at least one `where` operator.
> * The predicate can only use the following operators: `extend`, `where` and `project`.
> * The predicate can't reference other tables, nor use `externaldata`.

#### Example

To delete all the records that contain data of a given user:

```kusto
.delete table MyTable records <| MyTable | where UserId == 'X'
```

> [!NOTE]
>
> To determine the number of records that would be deleted by the operation without actually deleting them, check the value in the RecordsMatchPredicate column when running the command in `whatif` mode:
>
> ```kusto
> .delete table MyTable records with (whatif=true) <| MyTable | where UserId == 'X'
> ```

### Output

The output of the command contains information about which extents were replaced.

## Soft delete for materialized view

When soft delete is executed on materialized views, the same concepts and limitations explained above apply.

### Syntax

`.delete` [`async`] `materialized-view` *MaterializedViewName* `records` [`with (`propertyName `=` propertyValue [`,` ...]`)`] `<|` *Predicate*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`|string||If specified, indicates that the command runs in asynchronous mode.|
|*MaterializedViewName*|string|&check;|The name of the materialized view from which to delete records.|
|*Predicate*|string|&check;|The predicate that returns records to delete. Specified as a query.|

> [!NOTE]
> The same restrictions on the *Predicate* mentioned for table apply here as well.
> Soft delete might fail in case of conflicts with the [materialization process](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work) running in the background. Retrying the operation can help in this case. To avoid conflicts, you can [disable the materialized view](../management/materialized-views/materialized-view-enable-disable.md) before executing soft delete, and re-enable it when the operation completes.
> Usage of function [materialized_view()](../query/materialized-view-function.md) is not allowed in *Predicate*.
> 
#### Example

To delete all the records that contain data of a given user:

```kusto
.delete materialized-view MyMaterializedView records <| MyMaterializedView | where UserId == 'X'
```

> [!NOTE]
>
> To determine the number of records that would be deleted by the operation without actually deleting them, check the value in the RecordsMatchPredicate column when running the command in `whatif` mode:
>
> ```kusto
> .delete materialized-view MyMaterializedView records with (whatif=true) <| MyMaterializedView | where UserId == 'X'
> ```
