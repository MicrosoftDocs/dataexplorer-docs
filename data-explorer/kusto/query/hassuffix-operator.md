---
title: hassuffix operators - Azure Data Explorer
description: This article describes hassuffix operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/29/2021
ms.localizationpriority: high
---
# hassuffix operators

Filters a record set based on a search value. The value represents a suffix for a term found in the searched column.

```kusto
Table1 | where col hassuffix ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example use `hassuffix_cs`, not `hassuffix`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`.
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `hassuffix` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use hassuffix operator

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