---
title: cursor_after() - Azure Kusto | Microsoft Docs
description: This article describes cursor_after() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# cursor_after()

A predicate over the records of a table to compare their ingestion time
against a database cursor.

**Syntax**

`cursor_after` `(` *RHS* `)`

**Arguments**

* *RHS*: Either an empty string literal, or a valid database cursor value.

**Returns**

A scalar value of type `bool` that indicates whether the record was ingested
after the database cursor *RHS* (`true`) or not (`false`).

**Comments**

See [Database Cursor](https://kusdoc2.azurewebsites.net/docs/concepts/databasecursor.html) for a detailed
explanation of this function, the scenario in which it should be used, its
restrictions, and side-effects.

This function can only be invoked on records of a table which has the
[IngestionTime policy](https://kusdoc2.azurewebsites.net/docs/concepts/ingestiontimepolicy.html) enabled.