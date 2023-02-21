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
> If the table does not exist, an error is returned. For creating a new table, see [`.create table`](create-table-command.md)

## Permission

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Examples

```kusto
.alter table MyTable folder "Updated folder"
```

```kusto
.alter table MyTable folder @"First Level\Second Level"
```
