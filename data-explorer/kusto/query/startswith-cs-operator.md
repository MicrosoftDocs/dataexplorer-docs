---
title: The case-sensitive startswith string operator - Azure Data Explorer
description: This article describes the case-sensitive startswith string operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/19/2021
---
# startswith_cs operator

Filters a record set for data with a case-sensitive string starting sequence.

[!INCLUDE [startswith-operator-comparison](../../includes/startswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `hassuffix_cs` instead of `hassuffix`.

## Syntax

*T* `|` `where` *col* `startswith_cs` `(`*expression*`)`  

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
    | where State startswith_cs "I"
    | where event_count > 2000
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|IOWA|2337|
|ILLINOIS|2022|
