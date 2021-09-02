---
title: contains operator - Azure Data Explorer
description: This article describes the contains operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---

# contains operators

Filters a record set based on the provided value. The value represents a string contained in the searched column.

The following table provides a comparison of the `contains` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

> [!NOTE]
> The following abbreviations are used in the table below:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`contains`](contains-operator.md) |RHS occurs as a subsequence of LHS |No |`"FabriKam" contains "BRik"`|
|[`!contains`](not-contains-operator.md) |RHS doesn't occur in LHS |No |`"Fabrikam" !contains "xyz"`|
|[`contains_cs`](contains-cs-operator.md) |RHS occurs as a subsequence of LHS |Yes |`"FabriKam" contains_cs "Kam"`|
|[`!contains_cs`](not-contains-cs-operator.md)   |RHS doesn't occur in LHS |Yes |`"Fabrikam" !contains_cs "Kam"`|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example, use `contains_cs`, not `contains`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `contains` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use contains operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State contains "enn"
    | where event_count > 10
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|TENNESSEE|1125|