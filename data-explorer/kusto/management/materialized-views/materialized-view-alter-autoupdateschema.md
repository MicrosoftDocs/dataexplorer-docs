---
title: .alter materialized view autoUpdateSchema - Azure Data Explorer
description: This article describes .alter materialized view autoUpdateSchema in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/08/2021
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. For information on the the autoUpdateSchema property, see [materialized view create command properties](materialized-view-create.md#properties).

`.alter` `materialized-view` *MaterializedViewName* `autoUpdateSchema` [`true`|`false`]

## Permissions

This command requires you to have [database admin or materialized view admin](../access-control/role-based-access-control.md) permissions.

## Examples

```kusto
.alter materialized-view MyView autoUpdateSchema true

.alter materialized-view MyView autoUpdateSchema false
```
