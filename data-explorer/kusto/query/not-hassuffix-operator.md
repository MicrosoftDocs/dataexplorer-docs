---
title: The case-insensitive !hassuffix string operator - Azure Data Explorer
description: Learn how to use the !hassuffix string operator to filter records for data that doesn't have a case-insensitive suffix.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# !hassuffix operator

Filters a record set for data that doesn't have a case-insensitive ending string. `!hassuffix` returns `true` if there is no [term](datatypes-string-operators.md#what-is-a-term) inside string column ending with the specified string expression.

[!INCLUDE [hassuffix-operator-comparison](../../includes/hassuffix-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use [!hassuffix_cs](not-hassuffix-cs-operator.md) - a case-sensitive version of the operator.

> [!NOTE]
> Text index cannot be fully utilized for this function, therefore the performance of this function is comparable to [!endswith](not-endswith-operator.md) function, though the semantics is different.

## Syntax

*T* `|` `where` *Column* `!hassuffix` `(`*Expression*`)`

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
    | where State !hassuffix "A"
    | where event_count > 2000
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|ILLINOIS|2022|
|MISSOURI|2016|
