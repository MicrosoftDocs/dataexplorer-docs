---
title: .drop database prettyname - Azure Data Explorer | Microsoft Docs
description: This article describes .drop database prettyname in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .drop database prettyname

Drops a database's pretty (friendly) name.
Requires [DatabaseAdmin permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.drop` `database` *DatabaseName* `prettyname`

**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The database name
|PrettyName |String |The database pretty name (null after drop operation)