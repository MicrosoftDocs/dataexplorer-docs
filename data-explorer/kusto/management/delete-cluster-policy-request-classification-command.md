---
title: .delete cluster policy request_classification command
description: Learn how to use the `.delete cluster policy request_classification` command to delete the cluster's request classification policy.
ms.topic: reference
ms.date: 05/24/2023
---
# .delete cluster policy request_classification command

Delete the cluster's request classification policy.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `request_classification`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                              |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For cluster request classification policy this value is **ClusterRequestClassificationPolicy**.      |
| EntityName    | `string` | Name of the entity for which the policy is set. For cluster request classification policy this value is an empty string. |
| Policy        | `string` | JSON representation of the policy object. This command sets this property to null.                                       |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy this value is an empty string.    |
| EntityType    | `string` | Type of entity for which this policy is set. For cluster request classification policy this value is an empty string.    |

## Examples

### Delete cluster request classification policy

Delete cluster request classification policy:

`.delete` `cluster` `policy` `request_classification`

**Output**

| PolicyName                         | EntityName | Policy | ChildEntities | EntityType |
|------------------------------------|------------|--------|---------------|------------|
| ClusterRequestClassificationPolicy |            | null   |               |            |
