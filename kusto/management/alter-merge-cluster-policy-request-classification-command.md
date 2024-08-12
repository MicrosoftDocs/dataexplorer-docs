---
title:  .alter-merge cluster policy request_classification command
description: Learn how to use the `alter-merge cluster policy request_classification` command to enable or disable the cluster's request classification policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter-merge cluster policy request_classification command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Enables or disables the cluster's request classification policy.
::: moniker-end
:::moniker range="microsoft-fabric"
Enables or disables the eventhouse's request classification policy.
::: moniker-end

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The `admin` role inherits `Cluster AllDatabasesAdmin` permissions.
::: moniker-end

## Syntax

`.alter-merge` `cluster` `policy` `request_classification` `'{"IsEnabled":` [true|false] `}`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

:::moniker range="azure-data-explorer"
The command returns one row showing the details of the cluster request classification policy.
::: moniker-end
:::moniker range="microsoft-fabric"
The command returns one row showing the details of the eventhouse request classification policy.
::: moniker-end

Following is the schema of the output returned:

:::moniker range="azure-data-explorer"
| Name          | Type   | Description                                                                                                              |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For cluster request classification policy this value is **ClusterRequestClassificationPolicy**.      |
| EntityName    | `string` | Name of the entity for which the policy is set. For cluster request classification policy this value is an empty string. |
| Policy        | `string` | JSON representation of the policy object.                                                                                |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy this value is an empty string.    |
| EntityType    | `string` | Type of entity for which this policy is set. For cluster request classification policy this value is an empty string.    |
::: moniker-end
:::moniker range="microsoft-fabric"
| Name          | Type   | Description                                                                                                              |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For eventhouse request classification policy this value is **ClusterRequestClassificationPolicy**.      |
| EntityName    | `string` | Name of the entity for which the policy is set. For eventhouse request classification policy this value is an empty string. |
| Policy        | `string` | JSON representation of the policy object.                                                                                |
| ChildEntities | `string` | Child entities for which this policy is set. For eventhouse request classification policy this value is an empty string.    |
| EntityType    | `string` | Type of entity for which this policy is set. For eventhouse request classification policy this value is an empty string.    |
::: moniker-end

## Examples

### Enable the policy

:::moniker range="azure-data-explorer"
Enable request classification policy for the cluster:
::: moniker-end
:::moniker range="microsoft-fabric"
Enable request classification policy for the eventhouse:
::: moniker-end

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":true}'
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} |               |            |

### Disable the policy

:::moniker range="azure-data-explorer"
Disable request classification policy for the cluster:
::: moniker-end
:::moniker range="microsoft-fabric"
Disable request classification policy for the eventhouse:
::: moniker-end

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":false}'
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": false, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} |               |            |
