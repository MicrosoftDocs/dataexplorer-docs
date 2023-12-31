---
title: .show table policy restricted_view_access command
description: Learn how to use the `.show table policy restricted_view_access` command to display the details of the table's restricted view access policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy restricted_view_access command

Display the optional table [restricted view access policy](restricted-view-access-policy.md). When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database. Deleting a policy is similar to disabling a policy.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

Display the policy for a table:

`.show` `table` *TableName* `policy` `restricted_view_access`

Display the policy for all tables:

`.show` `table` `*` `policy` `restricted_view_access`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Examples

Display the policy for a table:

```kusto
.show table Table1 policy restricted_view_access
```

Display the policies for all tables:

```kusto
.show table * policy restricted_view_access
```
