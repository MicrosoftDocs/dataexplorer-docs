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

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use the case-sensitive [!startswith_cs](not-startswith-cs-operator.md).

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
