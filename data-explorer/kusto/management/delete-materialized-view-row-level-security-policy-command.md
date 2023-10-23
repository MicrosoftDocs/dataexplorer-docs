---
title: .delete materialized-view policy row_level_security command
description: Learn how to use the `.delete materialized-view policy row_level_security` command to delete the row level security of a materialized view
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 10/23/2023
---
# .delete materialized-view policy row_level_security command

Deletes the row level security policy of a materialized-view. For more information, see [row level security policy](rowlevelsecuritypolicy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `row_level_security`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name        | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

## Returns

| Name          | Type   | Description
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For materialized view row level security policy this value is **RowLevelSecurityPolicy**.
| EntityName    | string | Name of the entity for which the policy is set. For materialized view row level security policy this value is `[`*databaseName*`].[`*MaterializedViewName*`]`, where *databaseName* corresponds to the name of the database in which in the materialized view exists, and *MaterializedViewName* to the name of the materialized view itself.
| Policy        | string | JSON representation of the policy object. When the policy is deleted with this command, this property is set to `null`.
| ChildEntities | string | Child entities for which this policy is set. For materialized view row level security policy this value is an empty string.                                                                                                                                                                     |
| EntityType    | string | Type of entity for which this policy is set. For materialized view row level security this value is an empty string.                                                                                                                                                                     |

## Examples

### Remove row level security policy of a table

Remove row level security policy of table *T*:

```kusto
.delete materialized-view MyMaterializedView policy row_level_security
```

**Output:**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| RowLevelSecurityPolicy | [database].[MyMaterializedView] | null                                                             |               |            |
