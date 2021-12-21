---
title: ".alter cluster policy request classification command - Azure Data Explorer"
description: "This article describes the .alter cluster policy request classification command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter cluster request classification policy

Alters cluster's request classification policy. For more information, see [Request classification policy](request-classification-policy.md).

## Syntax

`.alter` `cluster` `policy` `request_classification` *SerializedArrayOfPolicyObjects*  `<|` *ClassificationFunctionBody*

## Arguments

*SerializedArrayOfPolicyObjects* - A serialized array with one or more JSON policy objects defined.
*ClassificationFunctionBody* - An array with one or more classification functions defined.

## Returns

Returns a JSON representation of the policy.

## Examples

### Set a policy with multiple workload groups

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

```kusto
"PolicyName": ClusterRequestClassificationPolicy,
"EntityName": ,
"Policy": {
  "ClassificationProperties": [
    "current_database",
    "request_description",
    "current_application",
    "current_principal",
    "request_type"
  ],
  "IsEnabled": true,
  "ClassificationFunction": "case(current_principal_is_member_of('aadgroup=somesecuritygroup@contoso.com'), \"First workload group\",\r\n         request_properties.current_database == \"MyDatabase\" and request_properties.current_principal has 'aadapp=', \"Second workload group\",\r\n         request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\", \"Third workload group\",\r\n         request_properties.current_application == \"KustoQueryRunner\", \"Fourth workload group\",\r\n         request_properties.request_description == \"this is a test\", \"Fifth workload group\",\r\n         hourofday(now()) between (17 .. 23), \"Sixth workload group\",\r\n         \"default\")"
},
"ChildEntities": ,
"EntityType": ,

```

### Set a policy with a single workload group

```kusto
.alter cluster policy request_classification '{"IsEnabled":true}' <|
    iff(request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query",
        "Ad-hoc queries",
        "default")
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|ClusterRequestClassificationPolicy| |{"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\r\n        \"Ad-hoc queries\",\r\n        \"default\")"
}| | |
