---
title: Request classification policy management - Azure Data Explorer
description: This article describes management commands for the request classification policy in Azure Data Explorer.
services: data-explorer
author: yonileibowitz
ms.author: yonil
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: reference
ms.date: 12/31/2020
---
# Request classification policy (Preview) - Control commands

## Permissions

Managing a cluster's request classification policy can be done by an [AllDatabasesAdmin](access-control/role-based-authorization.md),
using the following control commands.

## alter cluster policy request_classification

Changes the cluster's request classification policy.

### Syntax

`.alter` `cluster` `policy` `request_classification` `"`*Serialized partial policy*`"` `<|` *Classification function body*

### Examples

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

```kusto
.alter cluster policy request_classification '{"IsEnabled":false}' <|
    iff(request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query",
        "Ad-hoc queries",
        "default")
```

## alter-merge cluster policy request_classification

Enables or disables the cluster's request classification policy.

### Syntax

`.alter-merge` `cluster` `policy` `request_classification` `"`*Serialized partial policy*`"`

### Examples

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":true}'
```

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":false}'
```

## delete cluster policy request_classification

Deletes the cluster's request classification policy.

### Syntax

`.delete` `cluster` `policy` `request_classification`

## show cluster policy request_classification

Shows the cluster's request classification policy.

### Syntax

`.show` `cluster` `policy` `request_classification`
