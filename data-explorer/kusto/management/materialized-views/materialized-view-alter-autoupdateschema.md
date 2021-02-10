---
title: .alter materialized view autoUpdateSchema - Azure Data Explorer | Microsoft Docs
description: This article describes .alter materialized view autoUpdateSchema in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. Please see the documentation for the autoUpdateSchema property in the [materialized view create command properties](materialized-view-create.md#properties).

`.alter` `materialized-view` *MaterializedViewName* `autoUpdateSchema` [`true`|`false`]

> [!NOTE]
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the materialized view is also allowed to edit it

**Examples** 

```kusto
.alter materialized-view MyView autoUpdateSchema true

.alter materialized-view MyView autoUpdateSchema false
```
