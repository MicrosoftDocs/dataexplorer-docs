---
title:  cursor_current()
description: Learn how to use the cursor_current() function to return a string type value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# cursor_current()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Retrieves the current value of the cursor of the database in scope.

> **Deprecated aliases:** current_cursor()

## Syntax

`cursor_current()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

Returns a single value of type `string` that encodes the current value of the
cursor of the database in scope.

## Examples

```kusto
// Retrieve the current cursor value for the database
print CurrentCursor = cursor_current() 
```

## Related content

* [database cursors](../management/database-cursor.md)
