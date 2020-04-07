---
title: .alter database prettyname - Azure Data Explorer | Microsoft Docs
description: This article describes .alter database prettyname in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .alter database prettyname

Alters a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database.
|PrettyName |String |The pretty name of the database.

