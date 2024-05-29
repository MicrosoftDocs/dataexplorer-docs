---
title: .show cluster policy request_classification command
description: Learn how to use the `.show cluster policy request_classification` command to show the cluster's request classification policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show cluster policy request_classification command

Shows the cluster's request classification policy.

## Permissions

You must have at least [Cluster AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `request_classification`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                                                                                                                            |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For cluster request classification policy, this value is **ClusterRequestClassificationPolicy**.                                                                                                   |
| EntityName    | `string` | Name of the entity for which the policy is set. For cluster request classification policy, this value is an empty string.                                                                                              |
| Policy        | `string` | JSON representation of the policy object.                                                                                                                                                                              |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy, this value is an array of strings, each of which corresponds to the name of system and user databases attached to the cluster. |
| EntityType    | `string` | Type of entity for which this policy is set. For cluster request classification policy, this value is **Cluster**.                                                                                                     |

## Examples

### Display the cluster's request classification policy

Display request classification policy for the cluster:

```kusto
.show cluster policy request_classification
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities                                                          | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} | ["$systemdb", "KustoMonitoringPersistentDatabase", "YourDatabaseName"] | Cluster    |
