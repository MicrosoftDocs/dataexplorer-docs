---
title: delete auto delete policy command - Azure Data Explorer
description: This article describes the delete auto delete policy command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/08/2023
---
# .delete table policy auto_delete

Deletes the auto delete policy of a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `auto_delete`

## Parameters

| Name        | Type   | Required | Description        |
|-------------|--------|----------|--------------------|
| *TableName* | string | &check;  | Name of the table. |

## Returns

| Name          | Type   | Description                                                                                                                                                                                                                                                                  |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For table auto delete policy this value is **AutoDeletePolicy**.                                                                                                                                                                                         |
| EntityName    | string | Name of the entity for which the policy is set. For table auto delete policy this value is `[`*databaseName*`].[`*tableName*`]`, where *databaseName* corresponds to the name of the database in which in the table exists, and *tableName* to the name of the table itself. |
| Policy        | string | JSON representation of the policy object. When the policy is deleted with this command, this property is set to null.                                                                                                                                                        |
| ChildEntities | string | Child entities for which this policy is set. For table auto delete policy this value is an empty string.                                                                                                                                                                     |
| EntityType    | string | Type of entity for which this policy is set. For table auto delete policy this value is an empty string.                                                                                                                                                                     |

## Examples

### Remove auto delete policy of a table

Remove auto delete policy of table *T*: 

```kusto
.delete table T policy auto_delete
```

**Output:**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| AutoDeletePolicy | [database].[T] | null                                                             |               |            |
