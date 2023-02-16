---
title: ".alter cluster policy request classification command - Azure Data Explorer"
description: "This article describes the .alter cluster policy request classification command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/16/2023
---
# .alter cluster request classification policy

Alters cluster's request classification policy. For more information, see [request classification policy](request-classification-policy.md).

## Syntax

`.alter` `cluster` `policy` `request_classification` *SerializedPartialPolicy*  `<|` *ClassificationFunctionBody*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *SerializedPartialPolicy* | string | &check; | A serialized JSON policy. For policy properties, see [request classification policy](request-classification-policy.md).|
| *ClassificationFunctionBody*| string | &check; | An array with one or more classification functions.|

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
|ClusterRequestClassificationPolicy| |{"ClassificationProperties": ["current_application",  "request_type" ],"IsEnabled": true, "ClassificationFunction": "iff(request_properties.current_application == \"Kusto.Explorer\" and request_properties.request_type == \"Query\",\"Ad-hoc queries\",\"default\")"
}| | |
