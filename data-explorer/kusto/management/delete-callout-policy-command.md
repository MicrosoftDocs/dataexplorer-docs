---
title: delete cluster policy callout command- Azure Data Explorer
description: This article describes the delete cluster callout policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/05/2023
---
# .delete cluster policy callout

Delete the [callout policy](calloutpolicy.md) defined for the cluster.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `callout`

## Returns

| Name          | Type   | Description                                                                                               |
|---------------|--------|-----------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster callout policy this value is **CalloutPolicy**.                           |
| EntityName    | string | Name of the entity for which the policy is set. For cluster callout policy this value is an empty string. |
| Policy        | string | JSON representation of the policy object. This command sets this value to null.                           |
| ChildEntities | string | Child entities for which this policy is set. For cluster callout policy this value is an empty string.    |
| EntityType    | string | Type of entity for which this policy is set. For cluster callout policy this value is an empty string.    |

## Examples

### Delete cluster callout policy

Delete cluster callout policy:

````kusto
.delete cluster policy callout
````

**Output:**

| PolicyName    | EntityName | Policy                                                                                               | ChildEntities | EntityType |
|---------------|------------|------------------------------------------------------------------------------------------------------|---------------|------------|
| CalloutPolicy |            | null                                                                                                 |               |            |

## Remarks

Notice that this command doesn't delete the immutable predefined callout policies. For more information, see [predefined callout policies](calloutpolicy.md#predefined-callout-policies).
