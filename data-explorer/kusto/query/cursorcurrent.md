---
title: cursor-current(), current-cursor() (Azure Kusto)
description: This article describes cursor-current(), current-cursor() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# cursor-current(), current-cursor()

Retrieves the current value of the cursor of the database in scope. (The names `cursor-current`
and `current-cursor` are synonyms.)

**Syntax**

`cursor-current()`

**Returns**

Returns a single value of type `string` which encodes the current value of the
cursor of the database in scope.

**Remarks**

Please see [Database Cursor](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_databasecursor.html) for additional
details on database cursors.