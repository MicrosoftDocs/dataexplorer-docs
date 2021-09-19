---
title: The case-insensitive hassuffix string operator - Azure Data Explorer
description: This article describes the case-insensitive hassuffix string operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/19/2021
ms.localizationpriority: high
---
# hassuffix operator

Filters a record set for data with a case-insensitive ending string.

The following table provides a comparison of the `hassuffix` operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`hassuffix`](hassuffix-operator.md) |RHS is a term suffix in LHS |No |`"North America" hassuffix "ica"`|
|[`!hassuffix`](not-hassuffix-operator.md) |RHS isn't a term suffix in LHS |No |`"North America" !hassuffix "americ"`|
|[`hassuffix_cs`](hassuffix-cs-operator.md)  |RHS is a term suffix in LHS |Yes |`"North America" hassuffix_cs "ica"`|
|[`!hassuffix_cs`](not-hassuffix-cs-operator.md) |RHS isn't a term suffix in LHS |Yes |`"North America" !hassuffix_cs "icA"`|

> [!NOTE]
> The following abbreviations are used in the table above:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression

For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md). 

Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](tolowerfunction.md) function.

## Performance tips

For faster results, use the case-sensitive version of an operator, for example, `hassuffix_cs`, not `hassuffix`. 

If you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters at the start or end of a field, for faster results use `has` or `in`. 

For best practices, see [Query best practices](best-practices.md).

## Syntax

*T* `|` `where` *col* `hassuffix` `(`*expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hassuffix "o"
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|COLORADO|1654|
|OHIO|1233|
|GULF OF MEXICO|577|
|NEW MEXICO|527|
|IDAHO|247|
|PUERTO RICO|192|
|LAKE ONTARIO|8|