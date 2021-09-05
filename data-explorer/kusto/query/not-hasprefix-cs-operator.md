---
title: The !hasprefix_cs operators - Azure Data Explorer
description: This article describes the !hasprefix_cs operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---
# !hasprefix_cs operators

Filters a record set based on the provided value with a case-sensitive search. Data that does not contain the prefix is retrieved from the searched column.

The following table provides a comparison of the `has` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

> [!NOTE]
> The following abbreviations are used in the table below:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression
> 
> Operators with an `_cs` suffix are case sensitive.

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`has`](has-operator.md) |Right-hand-side (RHS) is a whole term in left-hand-side (LHS) |No |`"North America" has "america"`|
|[`!has`](not-has-operator.md) |RHS isn't a full term in LHS |No |`"North America" !has "amer"`|
|[`has_all`](has-all-operator.md) |Same as `has` but works on all of the elements |No |`"North and South America" has_all("south", "north")`|
|[`has_any`](has-anyoperator.md) |Same as `has` but works on any of the elements |No |`"North America" has_any("south", "north")`|
|[`has_cs`](has-cs-operator.md) |RHS is a whole term in LHS |Yes |`"North America" has_cs "America"`|
|[`!has_cs`](not-has-cs-operator.md) |RHS isn't a full term in LHS |Yes |`"North America" !has_cs "amer"`|
|[`hasprefix`](hasprefix-operator.md) |RHS is a term prefix in LHS |No |`"North America" hasprefix "ame"`|
|[`!hasprefix`](not-hasprefix-operator.md) |RHS isn't a term prefix in LHS |No |`"North America" !hasprefix "mer"`|
|[`hasprefix_cs`](hasprefix-cs-operator.md) |RHS is a term prefix in LHS |Yes |`"North America" hasprefix_cs "Ame"`|
|[`!hasprefix_cs`](not-hasprefix-cs-operator.md) |RHS isn't a term prefix in LHS |Yes |`"North America" !hasprefix_cs "CA"`|
|[`hassuffix`](hassuffix-operator.md) |RHS is a term suffix in LHS |No |`"North America" hassuffix "ica"`|
|[`!hassuffix`](not-hassuffix-operator.md) |RHS isn't a term suffix in LHS |No |`"North America" !hassuffix "americ"`|
|[`hassuffix_cs`](hassuffix-cs-operator.md)  |RHS is a term suffix in LHS |Yes |`"North America" hassuffix_cs "ica"`|
|[`!hassuffix_cs`](not-hassuffix-cs-operator.md) |RHS isn't a term suffix in LHS |Yes |`"North America" !hassuffix_cs "icA"`|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `has_cs`, not `has`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. `has` works faster than `contains`, `startswith`, or `endswith`. 

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `!hasprefix_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use !hasprefix_cs operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hasprefix_cs "P"
    | count
```

|Count|
|-----|
|64|