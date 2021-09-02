---
title: The !endswith operators - Azure Data Explorer
description: This article describes the !endswith operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# !endswith operators

Filters a record set based on a search value. Data that does not end with the sequence is retrieved from the searched column.

The following table provides a comparison of the `endswith` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

> [!NOTE]
> The following abbreviations are used in the table below:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`endswith`](endswithoperator.md) |RHS is a closing subsequence of LHS |No |`"Fabrikam" endswith "Kam"`|
|[`!endswith`](endswithoperator.md) |RHS isn't a closing subsequence of LHS |No |`"Fabrikam" !endswith "brik"`|
|[`endswith_cs`](endswithoperator.md) |RHS is a closing subsequence of LHS |Yes |`"Fabrikam" endswith_cs "kam"`|
|[`!endswith_cs`](endswithoperator.md) |RHS isn't a closing subsequence of LHS |Yes |`"Fabrikam" !endswith_cs "brik"`|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example, use `endswith_cs`, not `endswith`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`;`has` works faster than `endswith`. 

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `!endswith` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use !endswith operator
 
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !endswith "is"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|MISSOURI|2016|