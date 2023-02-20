---
title: .delete restricted view access policy command - Azure Data Explorer
description: This article describes the .delete restricted view access policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/27/2021
---
# .delete restricted view access policy

Delete the optional table [restricted view access policy](restrictedviewaccesspolicy.md). When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database. Deleting a policy is similar to disabling a policy. 

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `restricted_view_access`

## Arguments

*TableName* - Specify the name of the table. 

## Example

```kusto
.delete table MyTable policy restricted_view_access
```
