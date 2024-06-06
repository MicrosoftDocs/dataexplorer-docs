---
title: .show table policy auto_delete command
description: Learn how to use the `.show table policy auto_delete` command to show the auto delete policy that's applied to a table.
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy auto_delete command

Shows the auto delete policy that's applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `auto_delete`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name                     | Type   | Required | Description                        |
|--------------------------|--------|----------|------------------------------------|
| *TableName*              | `string` |  :heavy_check_mark:  | The name of the table.                 |

## Returns

| Name          | Type   | Description                                                                                                                                                                                                                                                                  |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For table auto delete policy this value is **AutoDeletePolicy**.                                                                                                                                                                                         |
| EntityName    | `string` | Name of the entity for which the policy is set. For table auto delete policy this value is `[`*databaseName*`].[`*tableName*`]`, where *databaseName* corresponds to the name of the database in which in the table exists, and *tableName* to the name of the table itself. |
| Policy        | `string` | JSON representation of the policy object.                                                                                                                                                                                                                                    |
| ChildEntities | `string` | Child entities for which this policy is set. For table auto delete policy this value is an empty string.                                                                                                                                                                     |
| EntityType    | `string` | Type of entity for which this policy is set. For table auto delete policy this value is *Table*.                                                                                                                                                                             |

## Examples

### Show auto delete policy of a table

Show the auto delete policy that is applied to table *T*:

```kusto
.show table T policy auto_delete
```

**Output**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| AutoDeletePolicy | [database].[T] | { "ExpiryDate": "2023-06-01T00:00:00" "DeleteIfNotEmpty": true } |               | Table      |
