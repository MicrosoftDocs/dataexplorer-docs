---
title: The !in operators - Azure Data Explorer
description: This article describes the !in operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# !in operators

Filters a record set based on the provided set of values with a case-sensitive search. Data not matching the string is retrieved from the searched column.

```kusto
Table1 | where col !in ('value1', 'value2')
```

> [!NOTE]
> * Adding '~' to the operator makes values' search case-insensitive: `x in~ (expression)` or `x !in~ (expression)`.
> * In tabular expressions, the first column of the result set is selected.
> * The expression list can produce up to `1,000,000` values.
> * Nested arrays are flattened into a single list of values. For example, `x in (dynamic([1,[2,3]]))` becomes `x in (1,2,3)`.

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `==`, not `=~`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case sensitive syntax

*T* `|` `where` *col* `!in` `(`*list of scalar expressions*`)`
*T* `|` `where` *col* `!in` `(`*tabular expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *list of expressions* - A comma-separated list of tabular, scalar, or literal expressions.
* *tabular expression* - A tabular expression that has a set of values. If the expression has multiple columns, the first column is used.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use !in operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where State !in ("FLORIDA", "GEORGIA", "NEW YORK") 
| count
```

|Count|
|---|
|54291|