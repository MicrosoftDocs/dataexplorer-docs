---
title: cursor_current() - Azure Data Explorer
description: Learn how to use the cursor_current() function to return a string type value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/10/2019
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# cursor_current()

::: zone pivot="azuredataexplorer"

Retrieves the current value of the cursor of the database in scope.

> **Deprecated aliases:** current_cursor()

## Syntax

`cursor_current()`

## Returns

Returns a single value of type `string` which encodes the current value of the
cursor of the database in scope.

**Notes**

See [database cursors](../management/databasecursor.md) for additional
details on database cursors.

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
