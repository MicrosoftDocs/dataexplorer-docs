---
title: The case-sensitive !startswith_cs string operator - Azure Data Explorer
description: Learn how to use the !startswith_cs string operator to filter records for data that doesn't start with a case-sensitive search string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# !startswith_cs operators

Filters a record set for data that doesn't start with a case-sensitive search string.

[!INCLUDE [startswith-operator-comparison](../../includes/startswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `hassuffix_cs` instead of `hassuffix`.

If you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters at the start or end of a field, for faster results use `has` or `in`.

## Syntax

*T* `|` `where` *col* `!startswith_cs` `(`*expression*`)`  

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
    | where State !startswith_cs "I"
    | where event_count > 2000
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|MISSOURI|2016|
