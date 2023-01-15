---
title: .alter table folder - Azure Data Explorer
description: This article describes .alter table folder in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2020
---
# .alter table folder

Alters the Folder value of an existing table. 

`.alter` `table` *TableName* `folder` *Folder*

> [!NOTE]
> * Requires [database admin permission](./access-control/role-based-access-control.md)
> * The [database user](./access-control/role-based-access-control.md) who originally created the table is also allowed to edit it
> * If the table does not exist, an error is returned. For creating a new table, see [`.create table`](create-table-command.md)

**Examples** 

```kusto
.alter table MyTable folder "Updated folder"
```

```kusto
.alter table MyTable folder @"First Level\Second Level"
```