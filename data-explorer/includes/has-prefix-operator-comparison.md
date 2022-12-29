---
ms.topic: include
ms.date: 12/25/2022
---

The following table provides a comparison of the `hasprefix` operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`hasprefix`](../kusto/query/hasprefix-operator.md) |RHS is a term prefix in LHS |No |`"North America" hasprefix "ame"`|
|[`!hasprefix`](../kusto/query/not-hasprefix-operator.md) |RHS isn't a term prefix in LHS |No |`"North America" !hasprefix "mer"`|
|[`hasprefix_cs`](../kusto/query/hasprefix-cs-operator.md) |RHS is a term prefix in LHS |Yes |`"North America" hasprefix_cs "Ame"`|
|[`!hasprefix_cs`](../kusto/query/not-hasprefix-cs-operator.md) |RHS isn't a term prefix in LHS |Yes |`"North America" !hasprefix_cs "CA"`|

> [!NOTE]
> The following abbreviations are used in the table above:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression

For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](../kusto/query/datatypes-string-operators.md).

Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](../kusto/query/tolowerfunction.md) function.
