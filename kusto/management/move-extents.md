---
title: .move extents command
description: Learn how to use the `.move extents` command to move extents from a source table to a destination table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---

# .move extents command

This command runs in the context of a specific database. It moves the specified extents from the source table to the destination table.

> [!NOTE]
>
> * For more information on extents, see [Extents (data shards) overview](extents-overview.md).
> * A `.move` command either completes or fails for all source extents. There are no partial outcomes.

## Permissions

You must have at least [Table Admin](../management/access-control/role-based-access-control.md) permissions for the source and destination tables.

## Restrictions

* Both source and destination tables must be in the context database.
* All columns in the source table are expected to exist in the destination table with the same name and data type.
* If the destination table is a source table of a [materialized view](materialized-views/materialized-view-overview.md), the command might fail since the materialized view won't process the records in the moved extents. See more details in the [materialized views limitations](materialized-views/materialized-views-limitations.md#the-materialized-view-source) page. You can workaround this error by setting a new ingestion time during the move command. See `setNewIngestionTime` in [supported properties](#supported-properties).

## Syntax

Move all extents:

`.move` [`async`] `extents` `all` `from` `table` *sourceTableName* `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`]

Move extents specified by ID:

`.move` [`async`] `extents` `from` `table` *SourceTableName* `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue* [`,` ...]`)`] `(` *GUID* [`,` ...] `)`

Move extents specified by query results:

`.move` [`async`] `extents` `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue* [`,`...]`)`] `<|` *Query*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`| `string` ||If specified, the command runs asynchronously.|
|*SourceTableName*| `string` | :heavy_check_mark:|The name of the table containing the extents to move.|
|*DestinationTableName*| `string` | :heavy_check_mark:|The name of the table to which to move the extents.|
|*PropertyName*, *PropertyValue*| `string` ||One or more [Supported properties](#supported-properties).|
|*Query*| `string` | :heavy_check_mark:|The results of this [Kusto Query Language (KQL)](../query/index.md) query specify the source table and the extent IDs to be moved from it. Should return a recordset with columns called "ExtentId" and "TableName".|

## Supported properties

| Property name | Type | Required | Description |
|--|--|--|--|
| `setNewIngestionTime` | `bool` |  | If set to `true`, a new [ingestion time](../query/ingestion-time-function.md) is assigned to all records in extents being moved. This is useful when records should be processed by workloads that depend on [database cursors](database-cursor.md), such as [materialized views](materialized-views/materialized-view-overview.md) and [continuous data export](data-export/continuous-data-export.md). |
| `extentCreatedOnFrom` | `datetime` |  :heavy_check_mark: | Apply on extents created after this point in time. |
| `extentCreatedOnTo` | `datetime` |  :heavy_check_mark: | Apply on extents created before this point in time. |

> [!NOTE]
> For better performance, set `extentCreatedOnFrom` and `extentCreatedOnTo` parameters to the smallest possible range.

## Returns

When the command is run synchronously, a table with the following schema is returned.

| Output parameter | Type | Description |
|--|--|--|
| OriginalExtentId | `string` | A unique identifier (GUID) for the original extent in the source table, which has been moved to the destination table. |
| ResultExtentId | `string` | A unique identifier (GUID) for the result extent that has been moved from the source table to the destination table. Upon failure - "Failed". |
| Details | `string` | Includes the failure details, in case the operation fails. |

When the command is run asynchronously, an operation ID (GUID) is returned. Monitor the operation's status with the [.show operations](operations.md#show-operations) command, and retrieve the results of a successful execution with the [.show operation details](operations.md#show-operation-details) command.

## Examples

### Move all extents

Move all extents in table `MyTable` to table `MyOtherTable`:

```kusto
.move extents all from table MyTable to table MyOtherTable
```

### Move two specific extents in a specified creation time range

Move two specific extents (by their extent IDs) in a specified creation time range from table `MyTable` to table `MyOtherTable`:

```kusto
.move extents from table MyTable to table MyOtherTable with (extentCreatedOnFrom=datetime(2023-03-10), extentCreatedOnTo=datetime(2023-03-12)) (AE6CD250-BE62-4978-90F2-5CB7A10D16D7,399F9254-4751-49E3-8192-C1CA78020706)
```

### Move all extents in a specified creation time range from specific tables

Move all extents in a specified creation time range from specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`:

```kusto
.move extents to table MyOtherTable with (extentCreatedOnFrom=datetime(2023-03-10), extentCreatedOnTo=datetime(2023-03-12)) <| .show tables (MyTable1,MyTable2) extents
```

### Move all extents with set new ingestion time

```kusto
.move extents all from table MyTable to table MyOtherTable with (setNewIngestionTime=true)
```

## Sample output

|OriginalExtentId |ResultExtentId| Details
|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687|
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be|
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f|
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df|
