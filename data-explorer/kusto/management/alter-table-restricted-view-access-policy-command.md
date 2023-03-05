---
title: .alter restricted view access policy command - Azure Data Explorer
description: This article describes the .alter restricted view access policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/28/2023
---
# .alter restricted view access policy

Turn on or turn off the optional table [restricted view access policy](restrictedviewaccesspolicy.md). When this policy is turned on for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

Use the following syntax to turn on or turn off the policy for one table.

`.alter` `table` *TableName* `policy` `restricted_view_access` `true`|`false`

Use the following syntax to turn on or turn off the policy for several tables.

`.alter` `tables` `(`*TableName*`,`*TableName2* [`,`...]`)` `policy` `restricted_view_access` `true`|`false`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table(s) to alter. |

## Examples

### Turn on a policy for a table

```kusto
.alter table MyTable policy restricted_view_access true
```

### Turn off the policy of several tables

```kusto
.alter tables (Table1, Table2, Table4) policy restricted_view_access false
```
