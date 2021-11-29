---
title: rename column - Azure Data Explorer | Microsoft Docs
description: This article describes rename column in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/11/2020
---
# .rename column

Changes the name of an existing table column.
To change the name of multiple columns, see [below](#rename-columns).

**Syntax**

`.rename` `column` [*DatabaseName* `.`] *TableName* `.` *ColumnExistingName* `to` *ColumnNewName*

Where *DatabaseName*, *TableName*, *ColumnExistingName*, and *ColumnNewName*
are the names of the respective entities and follow the [identifier naming rules](../query/schema-entities/entity-names.md).

## rename columns

Changes the names of multiple existing columns in the same table.

**Syntax**

`.rename` `columns` *Col1* `=` [*DatabaseName* `.` [*TableName* `.` *Col2*]] `,` ...

The command can be used to swap the names of two columns (each is renamed as
the other's name.)