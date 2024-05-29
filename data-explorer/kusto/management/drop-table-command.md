---
title: .drop table command
description: Learn how to use the `.drop table` command to remove one or more tables from a database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/15/2023
---
# .drop table command

Removes one or more tables from the database.

> [!NOTE]
> The `.drop` `table` command only soft deletes the data. That is, data can't be queried, but is still recoverable from persistent storage. The underlying storage artifacts are hard-deleted according to the `recoverability` property in the [retention policy](../management/retention-policy.md) that was in effect at the time the data was ingested into the table.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `table` *TableName* [`ifexists`]

`.drop` `tables` `(`*TableName* [`,` ... ]`)` [ifexists]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table to drop. |
|`ifexists`| `string` || If specified, the command won't fail if the table doesn't exist.|

## Returns

This command returns a list of the remaining tables in the database.

| Output parameter | Type   | Description                             |
|------------------|--------|-----------------------------------------|
| TableName        | `string` | The name of the table.                  |
| DatabaseName     | `string` | The database that the table belongs to. |

## Examples

### Drop a single table

```kusto
.drop table CustomersTable ifexists
```

### Drop multiple tables

```kusto
.drop tables (ProductsTable, ContactsTable, PricesTable) ifexists
```
