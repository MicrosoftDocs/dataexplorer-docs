---
title: .clear table data - Azure Data Explorer
description: This article describes the `.clear table data` command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: vrozov
ms.service: data-explorer
ms.topic: reference
ms.date: 10/01/2020
---
# .clear table data

Clears the data of an existing table, including streaming ingestion data.

`.clear` `table` *TableName* `data` 

> [!NOTE]
> * Requires [table admin permission](../management/access-control/role-based-authorization.md)

**Example** 

```kusto
.clear table LyricsAsTable data 
```
 
