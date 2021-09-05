---
title: The =~ operators - Azure Data Explorer
description: This article describes the +` operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---
# =~ operators

Filters a record set based on the provided search term.

> [!NOTE]
>
> * Adding `~` to the operator makes values' search case-insensitive: `col =~ (expression)` or `col !~ (expression)`.
> * Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](tolowerfunction.md) function.

The following table provides a comparison of the `==` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`==`](equals-cs-operator.md)|Equals |Yes|`"aBc" == "aBc"`|
|[`!=`](not-equals-cs-operator.md)|Not equals |Yes |`"abc" != "ABC"`|
|[`=~`](equals-operator.md) |Equals |No |`"abc" =~ "ABC"`|
|[`!~`](not-equals-operator.md) |Not equals |No |`"aBc" !~ "xyz"`|
 
## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `==`, not `=~`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `=~` `(`*expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use =~ operator  

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | where State =~ "kansas"
    | count 
```

|Count|
|---|
|3,166|  