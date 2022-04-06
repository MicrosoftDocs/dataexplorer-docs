---
title: .clear table data - Azure Data Explorer
description: This article describes the `.clear table data` command in Azure Data Explorer.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 10/01/2020
---
# .clear table data

Clears the data of an existing table, including streaming ingestion data.

`.clear` `table` *TableName* `data` 

> [!NOTE]
> * Requires [table admin permission](../management/access-control/role-based-authorization.md)

> [!NOTE]
> * In case of partial success or failure an exception with the details will be thrown.

**Example** 

```kusto
.clear table LyricsAsTable data 
```
 
