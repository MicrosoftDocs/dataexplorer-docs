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

## bool literals

The `bool` data type has the following literals:

* `true` and `bool(true)`: Representing trueness
* `false` and `bool(false)`:  Representing falsehood
* `bool(null)`: See [Null values](/azure/data-explorer/kusto/query/scalar-data-types/null-values)

## bool operators

The `bool` data type supports all of the [logical operators](../logicaloperators.md): equality (`==`), inequality (`!=`), logical-and (`and`), and logical-or (`or`).

## Related content

* [tobool()](../../query/toboolfunction.md)
