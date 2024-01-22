---
title: .delete materialized-view policy row_level_security command
description: Learn how to use the `.delete materialized-view policy row_level_security` command to delete the row level security of a materialized view
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 10/23/2023
---
# .delete materialized-view policy row_level_security command

Deletes the row level security policy of a materialized-view. For more information, see [row level security policy](row-level-security-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `row_level_security`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name        | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | The name of the materialized view for which to delete the row level security policy. |

## Returns

| Name          | Type   | Description
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | The name of the policy being deleted: RowLevelSecurityPolicy.
| EntityName    | string | The name of the entity for which the policy is deleted. The name follows the format of `[`*databaseName*`].[`*MaterializedViewName*`]`, where *databaseName* corresponds to the name of the database in which in the materialized view exists, and *MaterializedViewName* is the name of the materialized view itself.
| Policy        | string | A JSON representation of the policy object. Upon deletion of the policy, this property is set to `null`.
| ChildEntities | string | Child entities for which this policy is set. For a materialized view row level security policy, this value is an empty string.                                                                                                                                                                     |
| EntityType    | string | The type of entity for which this policy is set. For a materialized view row level security policy, this value is an empty string.                                                                                                                                                                     |

## Example

The following command removes the row level security policy of a materialized view named `MyMaterializedView`:

```kusto
.delete materialized-view MyMaterializedView policy row_level_security
```

**Output:**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| RowLevelSecurityPolicy | [database].[MyMaterializedView] | null                                                             |               |            |
