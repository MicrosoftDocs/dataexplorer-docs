---
title: .alter table docstring - Azure Data Explorer | Microsoft Docs
description: This article describes .alter table docstring in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .alter table docstring

Alters the DocString value of an existing table.

`.alter` `table` *TableName* `docstring` *Documentation*

> [!NOTE]
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * Modification of the table is also allowed to the [database user](../management/access-control/role-based-authorization.md) who originally created the table
> * If the table does not exist, an error is returned. For creating new table, see [.create table](/createtable.md)

**Example** 

```
.alter table LyricsAsTable docstring "This is the theme to Garry's show"
```