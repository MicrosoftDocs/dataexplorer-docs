---
title: Columns management - Azure Data Explorer | Microsoft Docs
description: This article describes Columns management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# Columns management

This section describes the following control commands used for managing table columns:

|Command |Description |
|------- | -------|
|[alter column](alter-column.md) |Alters the data type of an existing table column |
|[alter-merge table column](alter-merge-table-column.md) and [alter table column-docstrings](alter-merge-table-column.md#alter-table-column-docstrings) | Sets the `docstring` property of one or more columns of the specified table
|[`.alter table`](alter-table-command.md), [`.alter-merge table`](alter-table-command.md) | Modify the schema of a table (add/remove columns) |
|[drop column and drop table columns](drop-column.md) |Removes one or multiple columns from a table |
|[rename column or columns](rename-column.md) |Changes the name of an existing or multiple table columns |
