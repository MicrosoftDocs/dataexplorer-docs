---
title: cursor_current(), current_cursor() - Azure Kusto | Microsoft Docs
description: This article describes cursor_current(), current_cursor() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# cursor_current(), current_cursor()

Retrieves the current value of the cursor of the database in scope. (The names `cursor_current`
and `current_cursor` are synonyms.)

**Syntax**

`cursor_current()`

**Returns**

Returns a single value of type `string` which encodes the current value of the
cursor of the database in scope.

**Remarks**

See [database cursors](../management/databasecursor.md) for additional
details on database cursors.