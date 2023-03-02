---
title: .alter-merge callout policy command- Azure Data Explorer
description: This article describes the .alter-merge callout policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge callout policy

Use this command to turn on or turn off a cluster's [callout policy](calloutpolicy.md). Azure Data Explorer clusters can communicate with external services in many different scenarios. Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `callout` *SerializedArrayOfPolicyObjects*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SerializedArrayOfPolicyObjects*|string|&check;|A serialized array with one or more JSON policy objects. For more information, see [callout policy](calloutpolicy.md).|

### Examples

````kusto
.alter-merge cluster policy callout
```
[
    {
        "CalloutType": "sql",
        "CalloutUriRegex": "sqlname\\.database\\.azure\\.com/?$",
        "CanCall": true
    }
]
```
````
