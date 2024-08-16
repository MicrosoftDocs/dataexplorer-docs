---
title:  The bool data type
description:  This article describes the bool data type.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# The bool data type

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

The `bool` data type can be: `true` (`1`), `false` (`0`), or null.

> The `bool` and `boolean` data types are equivalent.

## `bool` literals

To specify a bool literal, use one of the following syntax options: 

|Syntax|Description|
|--|--|--|
|`true` or `bool(true)`|Represents trueness.|
|`false` or `bool(false)`|Represents falsehood.|
|`bool(null)`|Represents the [null value](/azure/data-explorer/kusto/query/scalar-data-types/null-values).|

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Boolean operators

The `bool` data type supports all of the [logical operators](../logical-operators.md): equality (`==`), inequality (`!=`), logical-and (`and`), and logical-or (`or`).

## Related content

* [tobool()](../tobool-function.md)
