---
title: has and nothas operators - Azure Data Explorer
description: This article describes has and nothas operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# has and !has operators

Filters a record set based on the provided value with a search that is not case sensitive. The value represents a term found in the searched column.

```kusto
Table1 | where col has ('value1')
```
 
## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `has` `(`*expression*`)`   
 
*T* `|` `where` *col* `!has` `(`*expression*`)`   

### Case-sensitive syntax

*T* `|` `where` *col* `has_cs` `(`*expression*`)`   

*T* `|` `where` *col* `!has_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use has operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State has "New"
    | where event_count > 10
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|NEW YORK|1,750|
|NEW JERSEY|1,044|
|NEW MEXICO|527|
|NEW HAMPSHIRE|394|  

### Use !has operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !has "NEW"
    | where event_count > 3000
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|TEXAS|4,701|
|KANSAS|3,166| 

### Use has_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State has_cs "New"
    | count
```

|Count|
|-----|
|0|

### Use !has_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !has_cs "New"
    | count
```

|Count|
|-----|
|67|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* instead of `has`, use `has_cs`
* instead of `in~`, use `in`
* instead of `contains`, use `contains_cs`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For more information, see [Query best practices](best-practices.md).
