---
title:  .alter table policy auto_delete command
description: Learn how to use the `.alter table policy auto_delete` command to alter the auto delete policy that's applied to a table.
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/25/2023
---
# .alter table policy auto_delete command

Alters the auto delete policy that's applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `auto_delete` *SerializedPolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                     | Type   | Required | Description                        |
|--------------------------|--------|----------|------------------------------------|
| *TableName*              | string |  :heavy_check_mark:  | Name of the table.                 |
| *SerializedPolicyObject* | string |  :heavy_check_mark:  | JSON representation of the policy. |

## Returns

| Name          | Type   | Description                                                                                                                                                                                                                                                                  |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For table auto delete policy this value is **AutoDeletePolicy**.                                                                                                                                                                                         |
| EntityName    | string | Name of the entity for which the policy is set. For table auto delete policy this value is `[`*databaseName*`].[`*tableName*`]`, where *databaseName* corresponds to the name of the database in which in the table exists, and *tableName* to the name of the table itself. |
| Policy        | string | JSON representation of the policy object.                                                                                                                                                                                                                                    |
| ChildEntities | string | Child entities for which this policy is set. For table auto delete policy this value is an empty string.                                                                                                                                                                     |
| EntityType    | string | Type of entity for which this policy is set. For table auto delete policy this value is *Table*.                                                                                                                                                                             |

## Examples

### Set expiry date of a table

Set expiry of table *T* to *2023-06-01*. Table will be deleted even if there are records in it (noted by `DeleteIfNotEmpty`):

```kusto
.alter table T policy auto_delete @'{ "ExpiryDate" : "2023-06-01", "DeleteIfNotEmpty": true }'
```

**Output:**

| PolicyName       | EntityName     | Policy                                                           | ChildEntities | EntityType |
|------------------|----------------|------------------------------------------------------------------|---------------|------------|
| AutoDeletePolicy | [database].[T] | { "ExpiryDate": "2023-06-01T00:00:00" "DeleteIfNotEmpty": true } |               | Table      |
