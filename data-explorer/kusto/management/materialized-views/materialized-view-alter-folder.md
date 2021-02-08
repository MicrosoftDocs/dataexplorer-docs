---
title: .alter materialized view folder - Azure Data Explorer | Microsoft Docs
description: This article describes .alter materialized view folder in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: orspodek
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view folder

Alters the Folder value of an existing materialized view. 

`.alter` `materialized-view` *MaterializedViewName* `folder` *Folder*

> [!NOTE]
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the materialized view is also allowed to edit it

**Examples** 

```kusto
.alter materialized-view MyView folder "Updated folder"
```

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```