---
title: The .delete cluster policy request classification command - Azure Data Explorer
description: This article describes the delete cluster policy request classification command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/01/2023
---
# .delete cluster request classification policy

Deletes the cluster's request classification policy. For more information, see [Request classification policy](request-classification-policy.md).

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `request_classification`

## Returns

The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                              |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster request classification policy this value is **ClusterRequestClassificationPolicy**.      |
| EntityName    | string | Name of the entity for which the policy is set. For cluster request classification policy this value is an empty string. |
| Policy        | string | JSON representation of the policy object. This command sets this property to null.                                       |
| ChildEntities | string | Child entities for which this policy is set. For cluster request classification policy this value is an empty string.    |
| EntityType    | string | Type of entity for which this policy is set. For cluster request classification policy this value is an empty string.    |

## Examples

### Delete cluster request classification policy

Delete cluster request classification policy:

`.delete` `cluster` `policy` `request_classification`

**Output:**

| PolicyName                         | EntityName | Policy | ChildEntities | EntityType |
|------------------------------------|------------|--------|---------------|------------|
| ClusterRequestClassificationPolicy |            | null   |               |            |
