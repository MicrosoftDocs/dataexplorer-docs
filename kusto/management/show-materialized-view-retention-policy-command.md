---
title: .show materialized-view policy retention command
description: Learn how to use the `.show materialized-view policy retention` command to show the materialized view's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show materialized-view policy retention command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Display the materialized-view's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Syntax

`.show` `materialized-view` *DatabaseName* `policy` `retention`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

### Example

Displays a retention policy:

```kusto
.show materialized-view MyMaterializedView policy retention 
```
