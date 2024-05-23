---
title: Data soft delete command - Azure Data Explorer
description: This article describes the data soft delete commands in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 03/28/2024
---
# .delete table records - soft delete command

To soft delete individual records without a system guarantee that the storage artifacts containing these records are deleted as well, use the following command. This command marks records as deleted but doesn't necessarily delete the data from storage artifacts. For more information, see [Soft delete](../concepts/data-soft-delete.md).

To delete individual records with a system guarantee that the storage artifacts containing these records are deleted as well, see [Data purge](../concepts/data-purge.md).

## Syntax

`.delete` [`async`] `table` *TableName* `records` [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *Predicate*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`| `string` ||If specified, indicates that the command runs in asynchronous mode.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table from which to delete records.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|
|*Predicate*| `string` | :heavy_check_mark:|The predicate that returns records to delete, which is specified as a query. See note.|

> [!NOTE]
> The following restrictions apply to the *Predicate*:
>
> * The predicate should have at least one `where` operator.
> * The predicate can only use the following operators: `extend`, `where` and `project`.
> * The predicate can't use `externaldata`.

## Supported properties

|Name|Type|Description|
|--|--|--|
|`whatif`| `bool` |If `true`, returns the number of records that will be deleted in every shard, without actually deleting any records. The default is `false`.

## Returns

The output of the command contains information about which extents were replaced.

## Example: delete records of a given user

To delete all the records that contain data of a given user:

```kusto
.delete table MyTable records <| MyTable | where UserId == 'X'
```

## Example: check how many records would be deleted from a table

To determine the number of records that would be deleted by the operation without actually deleting them, check the value in the *RecordsMatchPredicate* column when running the command in `whatif` mode:

```kusto
.delete table MyTable records with (whatif=true) <| MyTable | where UserId == 'X'
```

## .delete materialized-view records - soft delete command

When soft delete is executed on materialized views, the same concepts and limitations apply.

## Syntax - materialized views

`.delete` [`async`] `materialized-view` *MaterializedViewName* `records` [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *Predicate*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters - materialized views

|Name|Type|Required|Description|
|--|--|--|--|
|`async`| `string` ||If specified, indicates that the command runs in asynchronous mode.|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view from which to delete records.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties---materialized-views).|
|*Predicate*| `string` | :heavy_check_mark:|The predicate that returns records to delete. Specified as a query.|

> [!NOTE]
> The same restrictions on the *Predicate* mentioned for table apply here as well.
> Soft delete might fail in case of conflicts with the [materialization process](materialized-views/materialized-view-overview.md#how-materialized-views-work) running in the background. Retrying the operation can help in this case. To avoid conflicts, you can [disable the materialized view](materialized-views/materialized-view-enable-disable.md) before executing soft delete, and re-enable it when the operation completes.
> Usage of function [materialized_view()](../query/materialized-view-function.md) is not allowed in *Predicate*.

## Supported properties - materialized views

|Name|Type|Description|
|--|--|--|
|`whatif`| `bool` |If `true`, returns the number of records that will be deleted in every shard, without actually deleting any records. The default is `false`.

## Example - materialized views

To delete all the materialized view records that contain data of a given user:

```kusto
.delete materialized-view MyMaterializedView records <| MyMaterializedView | where UserId == 'X'
```

## Example: check how many records would be deleted from a materialized view

To determine the number of records that would be deleted by the operation without actually deleting them, check the value in the *RecordsMatchPredicate* column while running the command in `whatif` mode:

```kusto
.delete materialized-view MyMaterializedView records with (whatif=true) <| MyMaterializedView | where UserId == 'X'
```

## Related content

* [Soft delete](../concepts/data-soft-delete.md)
* [Materialized views](materialized-views/materialized-view-overview.md)
