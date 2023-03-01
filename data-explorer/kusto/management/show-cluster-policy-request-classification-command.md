---
title: The .show cluster policy request classification command - Azure Data Explorer
description: This article describes the show cluster policy request classification command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/01/2023
---
# .show cluster policy request_classification

Shows the cluster's request classification policy. For more information, see [Request classification policy](request-classification-policy.md).

## Permissions

You must have at least [Cluster AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `request_classification`

## Returns

The command returns one row showing the details of the cluster request classification policy.

Following is the schema of the output returned:

| Name          | Type   | Description                                                                                                                                                        |
|---------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster request classification policy this value is **ClusterRequestClassificationPolicy**.                                                |
| EntityName    | string | Name of the entity for which the policy is set. For cluster request classification policy this value is an empty string.                                           |
| Policy        | string | JSON representation of the policy object.                                                                                                                          |
| ChildEntities | string | Child entities for which this policy is set. For cluster request classification policy this command returns **["$systemdb","KustoMonitoringPersistentDatabase"]**. |
| EntityType    | string | Type of entity for which this policy is set. For cluster request classification policy this command returns **Cluster**.                                           |

## Examples

### Display the cluster's request classification policy

Display request classification policy for the cluster:

```kusto
.show cluster policy request_classification
```

**Output:**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities                                                          | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} | ["$systemdb", "KustoMonitoringPersistentDatabase", "YourDatabaseName"] | Cluster    |
