---
title: The case-sensitive hassuffix_cs string operator - Azure Data Explorer
description: Learn how to use the hassuffix_cs operator to filter data with a case-sensitive suffix string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# hassuffix_cs operator

Filters a record set for data with a case-sensitive ending string. `has` searches for indexed terms, where a [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

[!INCLUDE [hassuffix-operator-comparison](../../includes/hassuffix-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `hassuffix_cs` instead of `hassuffix`.

## Syntax

*T* `|` `where` *col* `hassuffix_cs` `(`*expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hassuffix_cs "AS"
    | where event_count > 2000
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
