---
title: .alter materialized view lookback - Azure Data Explorer
description: This article describes .alter materialized view lookback in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view lookback

Alters the `lookback` value of an existing materialized view. For more information on the lookback property, see [materialized view create command properties](materialized-view-create.md#properties).

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

> [!NOTE]
> * A `lookback` for a materialized view is only supported for [EngineV3](../../../engine-v3.md) clusters.
> * You must either be the [database user](../access-control/role-based-authorization.md) who created the materialized view or have [database admin permission](../access-control/role-based-authorization.md) to run this command.

**Examples** 

```kusto
.alter materialized-view MyView lookback 6h
```
