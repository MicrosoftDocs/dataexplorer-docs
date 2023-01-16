---
title: The case-insensitive !startswith string operators - Azure Data Explorer
description: Learn how to use the !startswith string operator to filter records for data that doesn't start with a case-insensitive search string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# !startswith operator

Filters a record set for data that doesn't start with a case-insensitive search string.

[!INCLUDE [startswith-operator-comparison](../../includes/startswith-operator-comparison.md)]

Case-insensitive operators are currently supported only for ASCII-text. For non-ASCII comparison, use the [tolower()](tolowerfunction.md) function.

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `hassuffix_cs` instead of `hassuffix`.

If you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters at the start or end of a field, for faster results use `has` or `in`.

## Syntax

*T* `|` `where` *col* `!startswith` `(`*expression*`)` 

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
    | where State !startswith "i"
    | where event_count > 2000
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|MISSOURI|2016|
