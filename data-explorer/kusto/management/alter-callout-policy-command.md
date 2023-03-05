---
title: "alter cluster policy callout command - Azure Data Explorer"
description: "This article describes the alter cluster policy callout command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/05/2023
---
# .alter cluster policy callout

Change the cluster [callout policy](calloutpolicy.md).

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `callout` *SerializedArrayOfPolicyObjects*

## Parameters

| Name                             | Type   | Required | Description                                                                                              |
|----------------------------------|--------|----------|----------------------------------------------------------------------------------------------------------|
| *SerializedArrayOfPolicyObjects* | string | &check;  | A serialized array of JSON policy objects. See [callout policy](calloutpolicy.md) for policy properties. |

## Returns

| Name          | Type   | Description                                                                                               |
|---------------|--------|-----------------------------------------------------------------------------------------------------------|
| PolicyName    | string | Name of the policy. For cluster callout policy this value is **CalloutPolicy**.                           |
| EntityName    | string | Name of the entity for which the policy is set. For cluster callout policy this value is an empty string. |
| Policy        | string | JSON representation of the policy object.                                                                 |
| ChildEntities | string | Child entities for which this policy is set. For cluster callout policy this value is an empty string.    |
| EntityType    | string | Type of entity for which this policy is set. For cluster callout policy this value is an empty string.    |

## Examples

### Define permitted callouts for the cluster

Define permitted callouts for the cluster callout policy.

````kusto
.alter cluster policy callout
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
