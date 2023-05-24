---
title:  show cluster policy callout command
description: This article describes the show cluster policy callout command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/05/2023
---
# .show cluster policy callout

Display a cluster's [callout policy](calloutpolicy.md).

## Permissions

You must have at least [Cluster AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `callout`

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
