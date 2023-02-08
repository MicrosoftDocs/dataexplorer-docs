---
title: .show table update policy command - Azure Data Explorer
description: This article describes the .show table update policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/10/2021
---
# .show table update policy

Show the table update policy. The [update policy](updatepolicy.md) instructs Azure Data Explorer to automatically append data to a target table whenever new data is inserted into the source table, based on a transformation query that runs on the data inserted into the source table.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

**For a specified table**

`.show` `table` *TableName* `policy` `update`

`.show` `table` *DatabaseName*`.`*TableName* `policy` `update`

**For all tables**

`.show` `table` * `policy` `update`

## Arguments

*DatabaseName* - Specify the name of the database.
*TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context. A wildcard (*) denotes all tables.

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the update policies for all tables:

```kusto
.show table * policy update 
```
