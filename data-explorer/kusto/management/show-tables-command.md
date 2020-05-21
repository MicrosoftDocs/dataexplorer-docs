---
title: .show tables - Azure Data Explorer | Microsoft Docs
description: This article describes .show tables in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .show tables

Returns a set that contains the specified table or all tables in the database.

Requires [Database viewer permission](../management/access-control/role-based-authorization.md).

```kusto
.show tables
.show tables (T1, ..., Tn)
```

**Output**

|Output parameter |Type |Description
|---|---|---
|TableName  |String |The name of the table.
|DatabaseName  |String |The database that the table belongs to.
|Folder |String |The table's folder.
|DocString |String |A string documenting the table.

**Output example**

|Table Name |Database Name |Folder | DocString
|---|---|---|---
|Table1 |DB1 |Logs |Contains services logs
|Table2 |DB1 | Reporting |
|Table3 |DB1 | | Extended info |
|Table4 |DB2 | Metrics| Contains services performance information
