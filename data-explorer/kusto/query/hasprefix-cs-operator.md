---
title: hasprefix_cs operators - Azure Data Explorer
description: This article describes the hasprefix_cs operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# hasprefix operators

Filters a record set based on the provided value with a case-sensitive search. The value represents a prefix for a term found in the searched column.

```kusto
Table1 | where col hasprefix_cs ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `hasprefix_cs`, not `hasprefix`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`; `has` works faster than `hasprefix`.
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `hasprefix_cs` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use hasprefix_cs operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | count 
```

|Count|
|-----|
|3|

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|PUERTO RICO|192|
|E PACIFIC|10|