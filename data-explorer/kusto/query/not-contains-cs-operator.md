---
title: The !contains_cs operator - Azure Data Explorer
description: This article describes the !contains_cs operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---

# !contains_cs operator

Filters a record set based on excluding the provided value using a case sensitive search. Data that does not contain the searched string is retrieved from the searched column.

```kusto
Table1 | where col !contains_cs ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example, use [`contains_cs`](contains_cs_operator.md), not `contains`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For example, the first of these queries will run faster:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | where State has "North" | count;
StormEvents | where State contains "nor" | count
```

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `!contains_cs` `(`*expression*`)` 

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use !contains_cs operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !contains_cs "AS"
    | count
```

|Count|
|-----|
|59|

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !contains_cs "TEX"
    | where event_count > 3000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|KANSAS|3,166|