---
title: The case-sensitive hassuffix_cs string operator - Azure Data Explorer
description: Learn how to use the hassuffix_cs operator to filter data with a case-sensitive suffix string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# hassuffix_cs operator

Filters a record set for data with a case-insensitive ending string. `hassuffix_cs` returns `true` if there is a [term](datatypes-string-operators.md#what-is-a-term) inside the filtered string column ending with the specified string expression.

[!INCLUDE [hassuffix-operator-comparison](../../includes/hassuffix-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

> [!NOTE]
> Text index cannot be fully utilized for this function, therefore the performance of this function is comparable to [endswith_cs](endswith-cs-operator.md) function, though the semantics is different.

## Syntax

*T* `|` `where` *col* `hassuffix_cs` `(` *expression* `)`

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
