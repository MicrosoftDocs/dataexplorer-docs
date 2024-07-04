---
title:  .alter-merge cluster policy request_classification command
description: Learn how to use the `alter-merge cluster policy request_classification` command to enable or disable the cluster's request classification policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 07/01/2024
monikerRange: "azure-data-explorer"
---
# .alter-merge cluster policy request_classification command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Enables or disables the cluster's request classification policy.

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `request_classification` `'{"IsEnabled":` [true|false] `}`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                              |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | `string` | Name of the policy. For cluster request classification policy this value is **ClusterRequestClassificationPolicy**.      |
| EntityName    | `string` | Name of the entity for which the policy is set. For cluster request classification policy this value is an empty string. |
| Policy        | `string` | JSON representation of the policy object.                                                                                |
| ChildEntities | `string` | Child entities for which this policy is set. For cluster request classification policy this value is an empty string.    |
| EntityType    | `string` | Type of entity for which this policy is set. For cluster request classification policy this value is an empty string.    |

## Examples

### Enable the policy

Enable request classification policy for the cluster:

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":true}'
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} |               |            |

### Disable the policy

Disable request classification policy for the cluster:

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":false}'
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": false, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} |               |            |
