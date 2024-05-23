---
ms.topic: include
ms.date: 05/23/2024
---

The following table compares the `hassuffix` operators using the abbreviations provided:

* RHS = right-hand side of the expression
* LHS = left-hand side of the expression

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`hassuffix`](../kusto/query/hassuffix-operator.md) |RHS is a term suffix in LHS |No |`"North America" hassuffix "ica"`|
|[`!hassuffix`](../kusto/query/not-hassuffix-operator.md) |RHS isn't a term suffix in LHS |No |`"North America" !hassuffix "americ"`|
|[`hassuffix_cs`](../kusto/query/hassuffix-cs-operator.md)  |RHS is a term suffix in LHS |Yes |`"North America" hassuffix_cs "ica"`|
|[`!hassuffix_cs`](../kusto/query/not-hassuffix-cs-operator.md) |RHS isn't a term suffix in LHS |Yes |`"North America" !hassuffix_cs "icA"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](../kusto/datatypes-string-operators.md).
