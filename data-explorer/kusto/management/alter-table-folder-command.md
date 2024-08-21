---
title:  .alter table folder command
description: Learn how to use the `.alter table folder` command to alter the folder value of an existing table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# .alter table folder command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters the folder value of an existing table.

> [!NOTE]
> If the table does not exist, an error is returned. For creating a new table, see [`.create table`](create-table-command.md)

## Permission

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `folder` *Folder*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table to alter.|
| *Folder* | `string` |  :heavy_check_mark: | The new folder for the table.|

## Examples

```kusto
.alter table MyTable folder "Updated folder"
```

```kusto
.alter table MyTable folder @"First Level\Second Level"
```
