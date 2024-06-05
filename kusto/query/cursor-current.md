---
title:  cursor_current()
description: Learn how to use the cursor_current() function to return a string type value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/08/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# cursor_current()

::: zone pivot="azuredataexplorer, fabric"

Retrieves the current value of the cursor of the database in scope.

> **Deprecated aliases:** current_cursor()

## Syntax

`cursor_current()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

Returns a single value of type `string` that encodes the current value of the
cursor of the database in scope.

## Related content

* [database cursors](../management/database-cursor.md)

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor

::: zone-end
