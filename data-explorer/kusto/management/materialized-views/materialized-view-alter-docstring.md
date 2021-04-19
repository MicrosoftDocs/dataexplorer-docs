---
title: .alter materialized view docstring - Azure Data Explorer
description: This article describes the `.alter materialized-view docstring` command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view docstring

Alters the DocString value of an existing materialized view.

`.alter` `materialized-view` *MaterializedViewName* `docstring` *Documentation*

> [!NOTE]
> You must either be the [database user](../access-control/role-based-authorization.md) who created the materialized view or have [database admin permission](../access-control/role-based-authorization.md) to run this command.

**Example** 

```kusto
.alter materialized-view MyView docstring "docs here..."
```
