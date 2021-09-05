---
title: hasprefix_cs operators - Azure Data Explorer
description: This article describes the hasprefix_cs operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/05/2021
ms.localizationpriority: high
---
# hasprefix_cs operators

Filters a record set based on the provided value with a case-sensitive search. The value represents a prefix for a term found in the searched column.

The following table provides a comparison of the `has` operators. For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

> [!NOTE]
> The following abbreviations are used in the table below:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression
> 
> Operators with an `_cs` suffix are case-sensitive.

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`hasprefix`](hasprefix-operator.md) |RHS is a term prefix in LHS |No |`"North America" hasprefix "ame"`|
|[`!hasprefix`](not-hasprefix-operator.md) |RHS isn't a term prefix in LHS |No |`"North America" !hasprefix "mer"`|
|[`hasprefix_cs`](hasprefix-cs-operator.md) |RHS is a term prefix in LHS |Yes |`"North America" hasprefix_cs "Ame"`|
|[`!hasprefix_cs`](not-hasprefix-cs-operator.md) |RHS isn't a term prefix in LHS |Yes |`"North America" !hasprefix_cs "CA"`|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `hasprefix_cs`, not `hasprefix`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`; `has` works faster than `hasprefix`.
For more information, see [Query best practices](best-practices.md).

## Syntax

*T* `|` `where` *col* `hasprefix_cs` `(`*expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use hasprefix_cs operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | count 
```

|Count|
|-----|
|3|

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|PUERTO RICO|192|
|E PACIFIC|10|