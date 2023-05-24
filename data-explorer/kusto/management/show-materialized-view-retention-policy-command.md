---
title:  .show materialized-view retention policy command
description: This article describes the .show materialized-view retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .show materialized-view retention policy

Display a materialized-view's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Syntax

`.show` `materialized-view` *DatabaseName* `policy` `retention` 

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

### Example

Displays a retention policy:

```kusto
.show materialized-view MyMaterializedView policy retention 
```
