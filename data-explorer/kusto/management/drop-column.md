---
title: drop column - Azure Data Explorer | Microsoft Docs
description: This article describes drop column in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/11/2020
---
# .drop column

Removes a column from a table.
To drop multiple columns from a table, see [below](#drop-table-columns).

> [!WARNING]
> This command is irreversible. All data in the column that is removed will be deleted.
> Future commands to add that column back will not be able to restore the data.

**Syntax**

`.drop` `column` *TableName* `.` *ColumnName*

## drop table columns

Removes a number of columns from a table.

> [!WARNING]
> This command is irreversible. All data in the columns that are removed will be deleted.
> Future commands to add those columns back will not be able to restore the data.

**Syntax**

`.drop` `table` *TableName* `columns` `(` *Col1* [`,` *Col2*]... `)`