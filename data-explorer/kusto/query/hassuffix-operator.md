---
title: The case-insensitive hassuffix string operator - Azure Data Explorer
description:  Learn how to use the hassuffix operator to filter data with a case-insensitive suffix string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# hassuffix operator

Filters a record set for data with a case-insensitive ending string. `has` searches for indexed terms, where a [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

[!INCLUDE [hassuffix-operator-comparison](../../includes/hassuffix-operator-comparison.md)]

Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](tolowerfunction.md) function.

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `hassuffix_cs` instead of `hassuffix`.

## Syntax

*T* `|` `where` *Column* `hassuffix` `(`*Expression*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *Column* - The column to filter.
* *Expression* - Scalar or literal expression.

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

**Output**

|State|event_count|
|-----|-----------|
|COLORADO|1654|
|OHIO|1233|
|GULF OF MEXICO|577|
|NEW MEXICO|527|
|IDAHO|247|
|PUERTO RICO|192|
|LAKE ONTARIO|8|
