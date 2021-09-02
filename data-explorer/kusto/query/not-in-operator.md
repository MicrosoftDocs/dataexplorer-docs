---
title: The !in~ operators - Azure Data Explorer
description: This article describes the !in~ operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---
# !in~ operators

Filters a record set based on the provided set of values. Data that does not match the string is retrieved from the searched column.

> [!NOTE]
>
> * Adding '~' to the operator makes values' search case-insensitive: `x in~ (expression)` or `x !in~ (expression)`.
> * In tabular expressions, the first column of the result set is selected.
> * The expression list can produce up to `1,000,000` values.
> * Nested arrays are flattened into a single list of values. For example, `x in (dynamic([1,[2,3]]))` becomes `x in (1,2,3)`.

The following table provides a comparison of the `has` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`in`](in-operator.md) |Equals to one of the elements |Yes |`"abc" in ("123", "345", "abc")`|
|[`!in`](not-in-cs-operator.md) |Not equals to any of the elements |Yes | `"bca" !in ("123", "345", "abc")` |
|[`in~`](in-operator.md) |Equals to any of the elements |Yes | `"abc" !in ("123", "345", "abc")` |
|[`!in~`](not-in-operator.md) |Not equals to any of the elements |Yes | `"bca" !in ("123", "345", "ABC")` |

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `==`, not `=~`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `!in~` `(`*list of scalar expressions*`)`  
*T* `|` `where` *col* `!in~` `(`*tabular expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *list of expressions* - A comma-separated list of tabular, scalar, or literal expressions.
* *tabular expression* - A tabular expression that has a set of values. If the expression has multiple columns, the first column is used.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples

### Use !in~ operator  

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where State !in~ ("Florida", "Georgia", "New York") 
| count
```

|Count|
|---|
|54,291|  
