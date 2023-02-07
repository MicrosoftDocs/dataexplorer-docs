---
title: .show restricted view access policy command - Azure Data Explorer
description: This article describes the .show restricted view access policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/03/2021
---
# .show restricted view access policy

Display the optional table [restricted view access policy](restrictedviewaccesspolicy.md). When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database. Deleting a policy is similar to disabling a policy. 

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

Display the policy for a table:

`.show` `table` *TableName* `policy` `restricted_view_access`

Display the policy for all tables:

`.show` `table` * `policy` `restricted_view_access`

## Arguments

*TableName* - Specify the name of the table. 

## Returns

Returns a JSON representation of the policy.

## Example

Display the policy for a table:

```kusto
.show table Table1 policy restricted_view_access
```

Display the policies for all tables:

```kusto
.show table * policy restricted_view_access
```
