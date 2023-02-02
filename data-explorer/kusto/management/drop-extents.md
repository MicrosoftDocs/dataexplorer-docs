---
title: .drop extents - Azure Data Explorer
description: This article describes the drop extents command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/23/2022
---
# .drop extents

Drops extents from a specified database or table.

This command has several variants: In one, the extents to be dropped are specified by a Kusto query. In the other variants, extents are specified using a mini-language described below.

> [!NOTE]
> Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

> [!CAUTION]
> If you drop an extent, all the rows in that extent will be deleted. To delete individual records, use [Soft delete](../concepts/data-soft-delete.md).

## Permissions

This command requires [Table Admin](access-control/role-based-access-control.md) permissions for each table that has extents returned by the provided query.

## Syntax

> [!NOTE]
> If the argument *TableName* is specified, you will need [Table admin permission](./access-control/role-based-access-control.md) to drop an extent.
> If the the argument *TableName* isn't specified, you will need [Database admin permission](./access-control/role-based-access-control.md) to drop an extent.

### Drop extents with a query

Drop extents that are specified using a Kusto query.
A recordset with a column called "ExtentId" is returned.

`.drop` `extents` [`whatif`] <| *query*

If `whatif` is used, it will just report them, without actually dropping.

### Drop a specific or multiple extents

`.drop` `extent` *ExtentId* [`from` *TableName*]

`.drop` `extents` `(`*ExtentId1*`,`...*ExtentIdN*`)` [`from` *TableName*]

### Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *ExtentId*,  *ExtentIdN* | string | &check; | A single or multiple unique identifiers (GUID) of the extents to be dropped. |
| *TableName* | string |  | The name of the table where the extent to be dropped is located |

### Drop extents by specified properties

`.drop` `extents` [`older` *N* (`days` | `hours`)] `from` (*TableName* | `all` `tables`) [`trim` `by` (`extentsize` | `datasize`) *N* (`MB` | `GB` | `bytes`)] [`limit` *LimitCount*]

### Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *older* | int | &check; | Drop extents older than *N* days/hours |
| *TableName* | string |  | The name of the table where the extent to be dropped is located |
| *trim* | int | &check | Trim the data in the database until the sum of extents matches the required size (MaxSize). |
| *limit* | int | &check | Applied to first *LimitCount* extents. |

The command supports emulation mode that produces an output as if the command would have run, but without actually executing it. Use `.drop-pretend` instead of `.drop`.
## Examples

### Drop a specific extent

Use an Extent ID to drop a specific extent.

```kusto
.drop extent 609ad1e2-5b1c-4b79-90c0-1dec262e9f46
```

### Drop multiple extents

Use a list of Extent IDs to drop multiple extents.

```kusto
.drop extents (609ad1e2-5b1c-4b79-90c0-1dec262e9f46, 310a60c6-8529-4cdf-a309-fe6aa7857e1d)
```

### Remove all extents by time created

Remove all extents created more than 10 days ago, from all tables in database `MyDatabase`

```kusto
.drop extents <| .show database MyDatabase extents | where CreatedOn < now() - time(10d)
```

### Remove some extents by time created

Remove all extents in tables `Table1` and `Table2` whose creation time was over 10 days ago

```kusto
.drop extents older 10 days from tables (Table1, Table2)
```

### Remove an extent using extent_id()

Remove an extent from a table using the built in [`extent_id()`](../query/extentidfunction.md) function.

```kusto
.drop extents  <| StormEvents | where EventId == '66144' | extend ExtentId=extent_id() | summarize by ExtentId
```

### Emulation mode: Show which extents would be removed by the command

> [!NOTE]
> Extent ID parameter isn't applicable for this command.

```kusto
.drop-pretend extents older 10 days from all tables
```

### Remove all extents from 'TestTable'

```kusto
.drop extents from TestTable
```

> [!NOTE]
> Removing all extents does not necessarily delete all the data in the table, if streaming ingestion is enabled. To clear all the data of a table, use [`.clear table data TestTable`](./clear-table-data-command.md).

## Return output

|Output parameter |Type |Description |
|---|---|---|
|ExtentId |String |ExtentId that was dropped because of the command
|TableName |String |Table name, where extent belonged  
|CreatedOn |DateTime |Timestamp that holds information about when the extent was initially created |

## Sample output

|Extent ID |Table Name |Created On |
|---|---|---
|43c6e03f-1713-4ca7-a52a-5db8a4e8b87d |TestTable |2015-01-12 12:48:49.4298178 |
