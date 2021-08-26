---
title: equals operators - Azure Data Explorer
description: This article describes equals operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# equals and !equals operators

Filters a record set based on the provided search term.

```kusto
Table1 | where col == ('value1')
```

> [!NOTE]
> * Adding '~' to the operator makes values' search case-insensitive: `col =~ (expression)` or `col !~ (expression)`.
 
## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `==` `(`*expressions`)`   
 
*T* `|` `where` *col* `!=` `(`*list of scalar expressions*`)`

### Case insensitive syntax

*T* `|` `where` *col* `=~` `(`*expression*`)`   
 
*T* `|` `where` *col* `!~` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use == operator

```kusto
StormEvents
    | where State == "kansas"
    | count 
```

|Count|
|---|
|0|  

### Use =~ operator  

```kusto
StormEvents
    | where State =~ "kansas"
    | count 
```

|Count|
|---|
|3,166|  

### Use != operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where (State != "FLORIDA") and (event_count > 4000)
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4,701|

### Use !~ operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where (State !~ "texas") and (event_count > 3000)
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|KANSAS|3,166|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `==`, not `=~`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
For more information, see [Query best practices](best-practices.md).