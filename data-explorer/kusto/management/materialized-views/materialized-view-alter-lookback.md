---
title: .alter materialized view lookback - Azure Data Explorer | Microsoft Docs
description: This article describes .alter materialized view lookback in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: orspodek
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view lookback

Alters the `lookback` value of an existing materialized view. Please see the documentation for the lookback property in the [materialized view create command properties](materialized-view-create.md#properties).

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

> [!NOTE]
> * A `lookback` for a materialized view is only supported for [EngineV3](../../../engine-v3.md) clusters.
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the materialized view is also allowed to edit it

**Examples** 

```kusto
.alter materialized-view MyView lookback 6h
```