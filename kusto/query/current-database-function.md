---
title:  current_database()
description: Learn how to use the current_database() function to return the name of the database in scope as a string type value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# current_database()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the name of the database in scope (database that all query
entities are resolved against if no other database is specified).

## Syntax

`current_database()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

The name of the database in scope as a value of type `string`.

## Example

```kusto
print strcat("Database in scope: ", current_database())
```
