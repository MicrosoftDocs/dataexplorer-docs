---
title: .delete table policy row_level_security command
description: Learn how to use the `.delete table policy row_level_security` command to delete the row level security of a table
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 10/23/2023
---
# .delete table policy row_level_security command

Deletes the row level security policy of a table. For more information, see [row level security policy](row-level-security-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `row_level_security`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name        | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| *TableName* | string | &check;  | The name of the table for which to delete the row level security policy. |

## Returns

| Name          | Type   | Description
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | The name of the policy being deleted: RowLevelSecurityPolicy.
| EntityName    | string | The name of the entity for which the policy is deleted. The name follows the format of `[`*databaseName*`].[`*tableName*`]`, where *databaseName* corresponds to the name of the database in which in the table exists, and *tableName* is the name of the table itself.
| Policy        | string | A JSON representation of the policy object. Upon deletion of the policy, this property is set to `null`.
| ChildEntities | string | Child entities for which this policy is set. For a table row level security policy, this value is an empty string.                                                                                                                                                                     |
| EntityType    | string | The type of entity for which this policy is set. For a table row level security policy, this value is an empty string.                                                                                                                                                                     |

## Example

The following command removes the row level security policy of a table named `T`:

```kusto
.delete table T policy row_level_security
```

**Output:**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| RowLevelSecurityPolicy | [database].[T] | null                                                             |               |            |
