---
ms.topic: include
ms.date: 12/28/2022
---

The following table provides a comparison of the `in` operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`in`](../query/in-cs-operator.md) |Equals to one of the elements |Yes |`"abc" in ("123", "345", "abc")`|
|[`!in`](../query/not-in-cs-operator.md) |Not equals to any of the elements |Yes | `"bca" !in ("123", "345", "abc")` |
|[`in~`](../query/in-operator.md) |Equals to any of the elements |No | `"Abc" in~ ("123", "345", "abc")` |
|[`!in~`](../query/not-in-operator.md) |Not equals to any of the elements |No | `"bCa" !in~ ("123", "345", "ABC")` |

> [!NOTE]
> Nested arrays are flattened into a single list of values. For example, `x in (dynamic([1,[2,3]]))` becomes `x in (1,2,3)`.

For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](../query/datatypes-string-operators.md).

Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](../query/tolower-function.md) function.
