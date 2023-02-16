---
title: ".alter callout policy command - Azure Data Explorer"
description: "This article describes the .alter callout policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/16/2023
---
# .alter callout policy

Change the cluster [callout policy](calloutpolicy.md). Azure Data Explorer clusters can communicate with external services in many different scenarios. Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

## Syntax

`.alter` `cluster` `policy` `callout` *SerializedArrayOfPolicyObjects*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *SerializedArrayOfPolicyObjects* | string | &check; | A serialized array of JSON policy objects defined. See [callout policy](calloutpolicy.md) for policy properties.|

## Returns

Returns a JSON representation of the policy.

## Example

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

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|CalloutPolicy||[{<br>"CalloutType": "sql",<br>"CalloutUriRegex": "sqlname\\\\.database\\\\.azure\\\\.com/?$",<br>"CanCall": true<br>}]|||
