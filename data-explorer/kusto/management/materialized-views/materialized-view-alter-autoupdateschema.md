---
title: .alter materialized view autoUpdateSchema - Azure Data Explorer
description: This article describes .alter materialized view autoUpdateSchema in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. For information on the the autoUpdateSchema property, see [materialized view create command properties](materialized-view-create.md#properties).

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

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
