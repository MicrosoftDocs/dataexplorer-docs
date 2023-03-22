---
title: .alter-merge cluster policy callout command- Azure Data Explorer
description: This article describes the .alter-merge cluster policy callout command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/05/2023
---
# .alter-merge cluster policy callout

Turn on or turn off a cluster's [callout policy](calloutpolicy.md) or add a new, nonexisting, callout policy to the array of callout policies defined for the cluster.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `callout` *SerializedArrayOfPolicyObjects*

## Parameters

| Name                             | Type   | Required | Description                                                                                              |
|----------------------------------|--------|----------|----------------------------------------------------------------------------------------------------------|
| *SerializedArrayOfPolicyObjects* | string | &check;  | A serialized array of JSON policy objects. See [callout policy](calloutpolicy.md) for policy properties. |

## Returns

| Name          | Type   | Description                                                                                               |
|---------------|--------|-----------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster callout policy, this value is **CalloutPolicy**.                           |
| EntityName    | string | Name of the entity for which the policy is set. For cluster callout policy, this value is an empty string. |
| Policy        | string | JSON representation of the policy object.                                                                 |
| ChildEntities | string | Child entities for which this policy is set. For cluster callout policy, this value is an empty string.    |
| EntityType    | string | Type of entity for which this policy is set. For cluster callout policy, this value is an empty string.    |

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

**Output:**

| PolicyName    | EntityName | Policy                                                                                               | ChildEntities | EntityType |
|---------------|------------|------------------------------------------------------------------------------------------------------|---------------|------------|
| CalloutPolicy |            | [{"CalloutType":"sql","CalloutUriRegex":"sqlname\\\\.database\\\\.azure\\\\.com/?$","CanCall":true}] |               |            |

## Remarks

If the callout policies currently defined for the cluster already contain one defined for the exact same combination of CalloutType and CalloutUriRegex provided in any of the policies passed to this command, that policy's CanCall property is set to whatever value is specified in this command.

All other objects passed in the array are simply merged/added to the existing cluster policy.
