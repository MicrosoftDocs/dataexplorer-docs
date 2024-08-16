---
ms.topic: include
ms.date: 08/11/2024
---

The following table compares the `has` operators using the abbreviations provided:

* RHS = right-hand side of the expression
* LHS = left-hand side of the expression

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`has`](../query/has-operator.md) |Right-hand-side (RHS) is a whole term in left-hand-side (LHS) |No |`"North America" has "america"`|
|[`!has`](../query/not-has-operator.md) |RHS isn't a full term in LHS |No |`"North America" !has "amer"`|
|[`has_cs`](../query/has-cs-operator.md) |RHS is a whole term in LHS |Yes |`"North America" has_cs "America"`|
|[`!has_cs`](../query/not-has-cs-operator.md) |RHS isn't a full term in LHS |Yes |`"North America" !has_cs "amer"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](../query/datatypes-string-operators.md).
