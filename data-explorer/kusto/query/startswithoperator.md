---
title: startswith operators - Azure Data Explorer
description: This article describes startswith operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# startswith and !startswith operators

Filters a record set based on a search value. The value represents a starting sequence for the string found in the searched column.

```kusto
Table1 | where col startswith ('value1')
```

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `startswith` `(`*expression*`)`

*T* `|` `where` *col* `!startswith` `(`*expression*`)`

### Case-sensitive syntax

*T* `|` `where` *col* `startswith_cs` `(`*expression*`)`

*T* `|` `where` *col* `!startswith_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use case insensitive operators

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State startswith "Lo"
    | where event_count > 10
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|LOUISIANA|463|  

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !startswith "i"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|MISSOURI|2016|

### case sensitive operators

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State startswith_cs "I"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|IOWA|2337|
|ILLINOIS|2022|

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !startswith_cs "I"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|MISSOURI|2016|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example, use `startswith_cs`, not `startswith`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`; `has` works faster than `startswith`. 
For more information, see [Query best practices](best-practices.md).
