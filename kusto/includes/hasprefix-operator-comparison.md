---
ms.topic: include
ms.date: 05/23/2024
---

The following table compares the `hasprefix` operators using the abbreviations provided:

* RHS = right-hand side of the expression
* LHS = left-hand side of the expression

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`hasprefix`](../kusto/query/hasprefix-operator.md) |RHS is a term prefix in LHS |No |`"North America" hasprefix "ame"`|
|[`!hasprefix`](../kusto/query/not-hasprefix-operator.md) |RHS isn't a term prefix in LHS |No |`"North America" !hasprefix "mer"`|
|[`hasprefix_cs`](../kusto/query/hasprefix-cs-operator.md) |RHS is a term prefix in LHS |Yes |`"North America" hasprefix_cs "Ame"`|
|[`!hasprefix_cs`](../kusto/query/not-hasprefix-cs-operator.md) |RHS isn't a term prefix in LHS |Yes |`"North America" !hasprefix_cs "CA"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](../query/datatypes-string-operators.md).
