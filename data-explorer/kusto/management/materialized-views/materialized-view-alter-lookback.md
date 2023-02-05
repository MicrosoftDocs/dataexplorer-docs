---
title: .alter materialized view lookback - Azure Data Explorer
description: This article describes .alter materialized view lookback in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view lookback

Alters the `lookback` value of an existing materialized view. For more information on the lookback property, see [materialized view create command properties](materialized-view-create.md#properties).

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

> [!NOTE]
> A `lookback` for a materialized view is only supported for [EngineV3](../../../engine-v3.md) clusters.

## Permissions

This command requires [Database Admin or Materialized View Admin](../access-control/role-based-access-control.md) permissions.

## Examples

```kusto
.alter materialized-view MyView lookback 6h
```

To remove a lookback from the materialized view, use `timespan(null)` as the lookback argument: 

```kusto
.alter materialized-view MyView lookback timespan(null)
```
