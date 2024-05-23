---
title: .drop extents command
description: Learn how to use the `.drop extents` command to drop extents from a specified database or table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/15/2023
---
# .drop extents command

Drops extents from a specified database or table.

This command has several variants: In one, the extents to be dropped are specified by a Kusto query. In the other variants, extents are specified using a mini-language described below.

> [!NOTE]
> Data shards are called **extents**, and all commands use "extent" or "extents" as a synonym.
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

> [!CAUTION]
> If you drop an extent, all the rows in that extent will be deleted. To delete individual records, use [Soft delete](../concepts/data-soft-delete.md).

## Permissions

If the *TableName* is specified, you must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run the command.

If the *TableName* isn't specified, you must have at least [Database Admin](./access-control/role-based-access-control.md) permissions to run the command.

## Syntax

### Drop extents with a query

`.drop` `extents` [`whatif`] `<|` *Query*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

#### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|`whatif`| `string` ||If specified, the extents will be reported instead of being dropped.|
| *Query* | `string` |  :heavy_check_mark: | The results of this [Kusto Query Language (KQL)](../query/index.md) query specify the source tables and the extent IDs to be dropped. Should return a recordset with columns called "ExtentId" and "TableName".|

### Drop a specific or multiple extents

`.drop` `extents` `(`*ExtentIds*`)` `from` *TableName*

#### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ExtentIds* | `guid` |  :heavy_check_mark: | One or more comma-separated unique identifiers of the extents to be dropped.|
| *TableName* | `string` |  | The name of the table where the extent to be dropped is located. |

### Drop extents by specified properties

`.drop` `extents` [`older` *N* (`days` | `hours`)] `from` (*TableName* | `all` `tables`) [`trim` `by` (`extentsize` | `datasize`) *Size* (`MB` | `GB` | `bytes`)] [`limit` *LimitCount*]

#### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *N* | `int` |  :heavy_check_mark: | Drop extents older than *N* days/hours. |
| *TableName* | `string` |  | The name of the table where the extent to be dropped is located |
| *Size* | `int` |  :heavy_check_mark: | Trim the data in the database until the sum of extents matches the required size (MaxSize). |
| *LimitCount* | `int` |  :heavy_check_mark: | Applied to first *LimitCount* extents. |

The command supports emulation mode that produces an output as if the command would have run, but without actually executing it. Use `.drop-pretend` instead of `.drop`.

## Returns

The command returns a table with the following information.

|Output parameter |Type |Description |
|---|---|---|
|ExtentId | `string` |ExtentId that was dropped because of the command
|TableName | `string` |Table name, where extent belonged  
|CreatedOn | `dateTime` |Timestamp that holds information about when the extent was initially created |

For example, the return value of a command might look like the following table.

|Extent ID |Table Name |Created On |
|---|---|---
|43c6e03f-1713-4ca7-a52a-5db8a4e8b87d |TestTable |2015-01-12 12:48:49.4298178 |

## Examples

### Drop a specific extent

Use an Extent ID to drop a specific extent.

```kusto
.drop extent 609ad1e2-5b1c-4b79-90c0-1dec262e9f46 from Table1
```

### Drop multiple extents

Use a list of Extent IDs to drop multiple extents.

```kusto
.drop extents (609ad1e2-5b1c-4b79-90c0-1dec262e9f46, 310a60c6-8529-4cdf-a309-fe6aa7857e1d) from Table1
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

Remove an extent from a table using the built-in [`extent_id()`](../query/extent-id-function.md) function.

```kusto
.drop extents  <|
    StormEvents
    | where EventId == '66144'
    | summarize by ExtentId = extent_id(), TableName = "StormEvents"
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
