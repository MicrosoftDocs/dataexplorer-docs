---
title: .delete cluster policy request_classification command
description: Learn how to use the `.delete cluster policy request_classification` command to delete the request classification policy.
ms.topic: reference
ms.date: 01/01/2025
---
# .delete cluster policy request_classification command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Delete the cluster's request classification policy.
::: moniker-end
:::moniker range="microsoft-fabric"
Delete the Eventhouse's request classification policy.
::: moniker-end

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The `admin` role inherits `Cluster AllDatabasesAdmin` permissions.
::: moniker-end

## Syntax

`.delete` `cluster` `policy` `request_classification`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

:::moniker range="azure-data-explorer"
The command returns one row showing the details of the cluster request classification policy.
::: moniker-end
:::moniker range="microsoft-fabric"
The command returns one row showing the details of the Eventhouse request classification policy.
::: moniker-end

Following is the schema of the output returned:

:::moniker range="azure-data-explorer"
| Name | Type | Description |
|--|--|--|
| PolicyName | `string` | Name of the policy. For cluster request classification policy, this value is **ClusterRequestClassificationPolicy**. |
| EntityName | `string` | Name of the entity for which the policy is set. For cluster request classification policy, this value is an empty string. |
| Policy | `string` | JSON representation of the policy object. This command sets this property to null. |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy, this value is an empty string. |
| EntityType | `string` | Type of entity for which this policy is set. For cluster request classification policy, this value is an empty string. |
::: moniker-end
:::moniker range="microsoft-fabric"
| Name | Type | Description |
|--|--|--|
| PolicyName | `string` | Name of the policy. For Eventhouse request classification policy, this value is **ClusterRequestClassificationPolicy**. |
| EntityName | `string` | Name of the entity for which the policy is set. For Eventhouse request classification policy, this value is an empty string. |
| Policy | `string` | JSON representation of the policy object. This command sets this property to null. |
| ChildEntities | `string` | Child entities for which this policy is set. For Eventhouse request classification policy, this value is an empty string. |
| EntityType | `string` | Type of entity for which this policy is set. For Eventhouse request classification policy, this value is an empty string. |
::: moniker-end

## Examples

:::moniker range="azure-data-explorer"
### Delete cluster request classification policy

Delete cluster request classification policy:
::: moniker-end
:::moniker range="microsoft-fabric"
### Delete Eventhouse request classification policy

Delete Eventhouse request classification policy:
::: moniker-end

`.delete` `cluster` `policy` `request_classification`

**Output**

| PolicyName | EntityName | Policy | ChildEntities | EntityType |
|--|--|--|--|--|
| ClusterRequestClassificationPolicy |  | null |  |  |

## Related content

* [Workload groups](workload-groups.md)
* [Request classification policy](request-classification-policy.md)
* [`.alter cluster request classification policy`](alter-cluster-policy-request-classification-command.md)
* [`.alter-merge cluster request classification policy`](alter-merge-cluster-policy-request-classification-command.md)
* [`.show cluster request classification policy`](show-cluster-policy-request-classification-command.md)