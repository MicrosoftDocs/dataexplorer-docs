---
title: .show cluster policy callout command
description: Learn how to use the `.show cluster policy callout` command to display a cluster's callout policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show cluster policy callout command

Display a cluster's [callout policy](callout-policy.md).

## Permissions

You must have at least [Cluster AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `callout`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

| Name          | Type   | Description                                                                                                                                                                                            |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster callout policy this value is **CalloutPolicy**.                                                                                                                        |
| EntityName    | string | Name of the entity for which the policy is set.                                                                                                                                                        |
| Policy        | string | JSON representation of the policy object.                                                                                                                                                              |
| ChildEntities | string | Child entities for which this policy is set. For cluster callout policy this value is an array of strings, each of which corresponds to the name of system and user databases attached to the cluster. |
| EntityType    | string | Type of entity for which this policy is set. For cluster callout policy this value is *Cluster*.                                                                                                       |

### Examples

Display the cluster's callout policy.

```kusto
.show cluster policy callout
```

**Output:**

| PolicyName    | EntityName | Policy                                                                                               | ChildEntities                                              | EntityType |
|---------------|------------|------------------------------------------------------------------------------------------------------|------------------------------------------------------------|------------|
| CalloutPolicy |            | []                                                                                                   | ["$systemdb","KustoMonitoringPersistentDatabase","TestDB"] | Cluster    |
