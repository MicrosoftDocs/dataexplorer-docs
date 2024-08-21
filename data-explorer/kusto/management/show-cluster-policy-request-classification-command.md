---
title: .show cluster policy request_classification command
description: Learn how to use the `.show cluster policy request_classification` command to show the request classification policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show cluster policy request_classification command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Shows the cluster's request classification policy.
::: moniker-end
:::moniker range="microsoft-fabric"
Shows the eventhouse's request classification policy.
::: moniker-end

## Permissions

You must have at least [Cluster AllDatabasesMonitor](../access-control/role-based-access-control.md) permissions to run this command.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The `admin` role inherits `Cluster AllDatabasesAdmin` permissions.
::: moniker-end

## Syntax

`.show` `cluster` `policy` `request_classification`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

:::moniker range="azure-data-explorer"
The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                                                                                                                            |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For cluster request classification policy, this value is **ClusterRequestClassificationPolicy**.                                                                                                   |
| EntityName    | `string` | Name of the entity for which the policy is set. For cluster request classification policy, this value is an empty string.                                                                                              |
| Policy        | `string` | JSON representation of the policy object.                                                                                                                                                                              |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy, this value is an array of strings, each of which corresponds to the name of system and user databases attached to the cluster. |
| EntityType    | `string` | Type of entity for which this policy is set. For cluster request classification policy, this value is **Cluster**.                                                                                                     |
::: moniker-end
:::moniker range="microsoft-fabric"
The command returns one row showing the details of the eventhouse request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                                                                                                                            |
|---------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For eventhouse request classification policy, this value is **ClusterRequestClassificationPolicy**.                                                                                                   |
| EntityName    | `string` | Name of the entity for which the policy is set. For eventhouse request classification policy, this value is an empty string.                                                                                              |
| Policy        | `string` | JSON representation of the policy object.                                                                                                                                                                              |
| ChildEntities | `string` | Child entities for which this policy is set. For eventhouse request classification policy, this value is an array of strings, each of which corresponds to the name of system and user databases attached to the eventhouse. |
| EntityType    | `string` | Type of entity for which this policy is set. For eventhouse request classification policy, this value is **Cluster**.                                                                                                     |
::: moniker-end

## Examples

:::moniker range="azure-data-explorer"
### Display the cluster's request classification policy

Display request classification policy for the cluster:
::: moniker-end
:::moniker range="microsoft-fabric"
### Display the eventhouse's request classification policy

Display request classification policy for the eventhouse:
::: moniker-end

```kusto
.show cluster policy request_classification
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities                                                          | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} | ["$systemdb", "KustoMonitoringPersistentDatabase", "YourDatabaseName"] | Cluster    |
