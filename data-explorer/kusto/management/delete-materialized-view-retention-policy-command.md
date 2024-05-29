---
title: .delete materialized-view policy retention command
description: Learn how to use the `.delete materialized-view policy retention` command to delete a materialized view's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete materialized-view policy retention command

Delete a materialized-view's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `retention`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view for which to delete the retention policy.|

### Example

The following command deletes the retention policy for a materialized view named `MyMaterializedView`.

```kusto
.delete materialized-view MyMaterializedView policy retention
```
