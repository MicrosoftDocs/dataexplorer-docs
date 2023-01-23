---
title: The case-sensitive match regex string operator - Azure Data Explorer
description: Learn how to use the match regex string operator to filter a record set based on a case-sensitive regex value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2023
---
# match regex operator

Filters a record set based on a case-sensitive regex value.

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `matches` `regex` `(`*expression*`)`

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
    | where State matches regex "K.*S"
    | where event_count > 10
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|KANSAS|3166|
|ARKANSAS|1028|
|LAKE SUPERIOR|34|
|LAKE ST CLAIR|32|  
