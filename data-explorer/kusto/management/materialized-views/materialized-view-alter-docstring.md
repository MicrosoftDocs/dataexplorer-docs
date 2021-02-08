---
title: .alter materialized view docstring - Azure Data Explorer
description: This article describes the `.alter materialized-view docstring` command in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: orspodek
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view docstring

Alters the DocString value of an existing materialized view.

`.alter` `materialized-view` *MaterializedViewName* `docstring` *Documentation*

> [!NOTE]
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the materialized view is permitted to modify it

**Example** 

```kusto
.alter materialized-view MyView docstring "docs here..."
```