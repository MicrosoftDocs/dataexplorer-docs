---
title: ".alter database retention policy command- Azure Data Explorer"
description: "This article describes the .alter database retention policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/19/2023
---
# .alter database retention policy

Use this command to change a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based.

The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Syntax

`.alter` `database` *DatabaseName* `policy` `retention` *PolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the retention policy.|
|*PolicyObject*|string|&check;|A policy object that defines the retention policy. For more information, see [retention policy](retentionpolicy.md).|

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

````kusto
.alter database MyDatabase policy retention
```
{
    "SoftDeletePeriod" : "10.00:00:00",
    "Recoverability" : "Enabled"
}
```
````
