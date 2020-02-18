---
title: .detach database - Azure Data Explorer | Microsoft Docs
description: This article describes .detach database in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .detach database

Removes a database from Kusto service. 
If the database has persistent storage, it can be re-attached using the [`.attach database`](attach-database.md) command. 

Requires [ClusterAdmin permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.detach` `database` *DatabaseName*

**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|Table |String |Name of the table that was detached as the result of the database detach operation 
|NumberOfRemovedExtents |String |Number of extents that were associated with the table and were detached as well 