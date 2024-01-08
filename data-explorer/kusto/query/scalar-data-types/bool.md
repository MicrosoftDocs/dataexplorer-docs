---
title:  The bool data type
description: This article describes the bool data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The bool data type

The `bool` data type can be: `true` (`1`), `false` (`0`), or null.

> The `bool` and `boolean` data types are equivalent.

## Literals

The literals for the bool data type include:

* `true` or `bool(true)` to represent trueness
* `false` or `bool(false)` to represent falsehood
* `bool(null)` to represent a [null value](/azure/data-explorer/kusto/query/scalar-data-types/null-values)

## Boolean operators

The `bool` data type supports all of the [logical operators](../logicaloperators.md): equality (`==`), inequality (`!=`), logical-and (`and`), and logical-or (`or`).

## Related content

* [tobool()](../../query/toboolfunction.md)
