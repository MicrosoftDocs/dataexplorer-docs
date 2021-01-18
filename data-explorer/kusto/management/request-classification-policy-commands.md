---
title: Request classification policy management - Azure Data Explorer
description: This article describes management commands for the request classification policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 01/18/2021
---
# Request classification policy (Preview) - Control commands

These commands require [AllDatabasesAdmin](access-control/role-based-authorization.md) permissions.

## .alter cluster policy request_classification

Changes the cluster's request classification policy.

### Syntax

`.alter` `cluster` `policy` `request_classification` `"`*Serialized partial policy*`"` `<|` *Classification function body*

### Examples

#### Set a policy with multiple workload groups

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

#### Set a policy with a single workload group

```kusto
.alter cluster policy request_classification '{"IsEnabled":false}' <|
    iff(request_properties.current_application == "Kusto.Explorer" and request_properties.request_type == "Query",
        "Ad-hoc queries",
        "default")
```

## .alter-merge cluster policy request_classification

Enables or disables the cluster's request classification policy.

### Syntax

`.alter-merge` `cluster` `policy` `request_classification` `"`*Serialized partial policy*`"`

### Examples

#### Enable the policy

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":true}'
```

#### Disable the policy

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":false}'
```

## .delete cluster policy request_classification

Deletes the cluster's request classification policy.

### Syntax

`.delete` `cluster` `policy` `request_classification`

## .show cluster policy request_classification

Shows the cluster's request classification policy.

### Syntax

`.show` `cluster` `policy` `request_classification`
