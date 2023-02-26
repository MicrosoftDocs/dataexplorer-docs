---
title: The .show auto delete policy command - Azure Data Explorer
description: This article describes the .show auto delete policy command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .show auto delete policy

Shows the auto delete policy that is applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `auto_delete`

## Arguments

*TableName* - Specify the name of the table. 

## Returns

Returns a JSON representation of the policy.

## Example

Displays the auto delete policy that is applied on the table.

```kusto
.show table StormEvents policy auto_delete
```

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|AutoDeletePolicy | [database].[StormEvents] | { "ExpiryDate": "2021-12-01T00:00:00" "DeleteIfNotEmpty": true } |      | Table
