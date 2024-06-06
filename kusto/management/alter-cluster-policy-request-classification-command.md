---
title:  .alter cluster policy request_classification command
description: Learn how to use the `.alter cluster policy request_classification` command to alter the cluser's request classification policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter cluster policy request_classification command

Alters the cluster's request classification policy.

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `request_classification` *SerializedPartialPolicy*  `<|` *ClassificationFunctionBody*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name                         | Type   | Required | Description                                                                                                                                                                                                                       |
|------------------------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| *SerializedPartialPolicy*    | `string` |  :heavy_check_mark:  | Define a serialized JSON policy. For policy properties, see [request classification policy](request-classification-policy.md). |
| *ClassificationFunctionBody* | `string` |  :heavy_check_mark:  | The body of the function to use for classifying requests.                                                                      |

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

### Set a policy with multiple workload groups

Set a policy which, based on the evaluation of multiple conditions, assigns the user to one among many different workload groups or to default:

```kusto
.alter cluster policy request_classification '{"IsEnabled":true}' <|
    case(current_principal_is_member_of('aadgroup=somesecuritygroup@contoso.com'), "First workload group",
         request_properties.current_database == "MyDatabase" and request_properties.current_principal has 'aadapp=', "Second workload group",
         request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query", "Third workload group",
         request_properties.current_application == "KustoQueryRunner", "Fourth workload group",
         request_properties.request_description == "this is a test", "Fifth workload group",
         hourofday(now()) between (17 .. 23), "Sixth workload group",
         "default")
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | ChildEntities | EntityType |
|------------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_database", "request_description", "current_application", "current_principal", "request_type"], "IsEnabled": true, "ClassificationFunction": "case(current_principal_is_member_of('aadgroup=somesecuritygroup@contoso.com'), \"First workload group\", request_properties.current_database == \"MyDatabase\" and request_properties.current_principal has 'aadapp=', \"Second workload group\", request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\", \"Third workload group\", request_properties.current_application == \"KustoQueryRunner\", \"Fourth workload group\", request_properties.request_description == \"this is a test\", \"Fifth workload group\", hourofday(now()) between (17 .. 23), \"Sixth workload group\", \"default\")"} |               |            |

### Set a policy with a single workload group

Set a policy which, based on the evaluation of a composed condition, assigns the user to either a custom or to default workload group:

```kusto
.alter cluster policy request_classification '{"IsEnabled":true}' <|
    iff(request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query",
        "Ad-hoc queries",
        "default")
```

**Output**

| PolicyName                         | EntityName | Policy                                                                                                                                                                                                                                                                   | ChildEntities | EntityType |
|------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|------------|
| ClusterRequestClassificationPolicy |            | {"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"} |               |            |
