---
title: .alter materialized view autoUpdateSchema - Azure Data Explorer
description: This article describes .alter materialized view autoUpdateSchema in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. For information on the the autoUpdateSchema property, see [materialized view create command properties](materialized-view-create.md#properties).

> [!NOTE]
> You must either be the [database user](../access-control/role-based-access-control.md) who created the materialized view or have [database admin permission](../access-control/role-based-access-control.md) to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `autoUpdateSchema` [`true`|`false`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |

## Examples

```kusto
.alter materialized-view MyView autoUpdateSchema true

.alter materialized-view MyView autoUpdateSchema false
```
