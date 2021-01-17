---
title: .alter table docstring - Azure Data Explorer
description: This article describes the `.alter table docstring` command in Azure Data Explorer.
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
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the table is permitted to modify it
> * If the table doesn't exist, an error is returned. To create a new table, see [`.create table`](create-table-command.md)

**Example** 

```kusto
.alter table LyricsAsTable docstring "This is the theme to Garry's show"
```
 
