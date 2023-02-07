---
title: .move extents - Azure Data Explorer
description: This article describes the move extents command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/02/2020
---

# .move extents

This command runs in the context of a specific database. It moves the specified extents from the source table to the destination table.

> [!NOTE]
> * For more information on extents, see [Extents (data shards) overview](extents-overview.md).
> * A `.move` command either completes or fails for all source extents. There are no partial outcomes.

## Permissions

The command requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions for the source and destination tables.

## Restrictions

* Both source and destination tables must be in the context database.
* All columns in the source table are expected to exist in the destination table with the same name and data type.

## Syntax

`.move` [`async`] `extents` `all` `from` `table` *SourceTableName* `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]

`.move` [`async`] `extents` `from` `table` *SourceTableName* `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] `(` *GUID1* [`,` *GUID2* ...] `)`

`.move` [`async`] `extents` `to` `table` *DestinationTableName* [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)` ] <| *query*

`async` (optional). Execute the command asynchronously.
   * An Operation ID (Guid) is returned.
   * The operation's status can be monitored. Use the [.show operations](operations.md#show-operations) command.
   * The results of a successful execution can be retrieved. Use the [.show operation details](operations.md#show-operation-details) command.

There are three ways to specify which extents to move:
* Move all extents of a specific table.
* Specify explicitly the extent IDs in the source table.
* Provide a query whose results specify the extent IDs in the source tables.

## Properties

The following properties are supported. All properties are optional.

|Property name|Type|Description |
|----------------|-------|---|
|setNewIngestionTime|bool|If set to true, a new [ingestion time](../query/ingestiontimefunction.md) will be assigned to all records in extents being moved. This is useful when records should be processed by workloads that depend on [database cursors](databasecursor.md), such as [materialized views](materialized-views/materialized-view-overview.md) and [continuous data export ](data-export/continuous-data-export.md).|

## Specify extents with a query

```kusto
.move extents to table TableName <| ...query...
```

The extents are specified using a Kusto query that returns a recordset with a column called *ExtentId*.

## Return output (for sync execution)

Output parameter |Type |Description
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been moved to the destination table.
ResultExtentId |string |A unique identifier (GUID) for the result extent that has been moved from the source table to the destination table. Upon failure - "Failed".
Details |string |Includes the failure details, in case the operation fails.

## Examples

### Move all extents 

Move all extents in table `MyTable` to table `MyOtherTable`:

```kusto
.move extents all from table MyTable to table MyOtherTable
```

### Move two specific extents 

Move two specific extents (by their extent IDs) from table `MyTable` to table `MyOtherTable`:

```kusto
.move extents from table MyTable to table MyOtherTable (AE6CD250-BE62-4978-90F2-5CB7A10D16D7,399F9254-4751-49E3-8192-C1CA78020706)
```

### Move all extents from specific tables 

Move all extents from specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`:

```kusto
.move extents to table MyOtherTable <| .show tables (MyTable1,MyTable2) extents
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
