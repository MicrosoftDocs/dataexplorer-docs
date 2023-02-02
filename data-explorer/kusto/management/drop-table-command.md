---
title: .drop table and .drop tables - Azure Data Explorer
description: This article describes .drop table and .drop tables in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/18/2020
---
# .drop table and .drop tables

Removes a table or multiple tables from the database.

> [!NOTE]
> The `.drop` `table` command only soft deletes the data. That is, data can't be queried, but is still recoverable from persistent storage. The underlying storage artifacts are hard-deleted according to the `recoverability` property in the [retention policy](../management/retentionpolicy.md) that was in effect at the time the data was ingested into the table.

## Permissions

This command requires [table admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.drop` `table` *TableName* [`ifexists`]

`.drop` `tables` (*TableName1*, *TableName2*,..) [ifexists]

> [!NOTE]
> If `ifexists` is specified, the command won't fail if there is a non-existent table.

## Example

```kusto
.drop table CustomersTable ifexists
.drop tables (ProductsTable, ContactsTable, PricesTable) ifexists
```

## Returns

This command returns a list of the remaining tables in the database.

| Output parameter | Type   | Description                             |
|------------------|--------|-----------------------------------------|
| TableName        | String | The name of the table.                  |
| DatabaseName     | String | The database that the table belongs to. |
