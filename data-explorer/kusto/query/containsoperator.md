---
title: contains operators - Azure Data Explorer
description: This article describes contains operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/29/2021
ms.localizationpriority: high
---

# contains and !contains operators

Filters a record set based on the provided value. The value represents a string contained in the searched column.

```kusto
Table1 | where col contains ('value1')
```

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `contains` `(`*expression*`)`   
 
*T* `|` `where` *col* `!contains` `(`*expression*`)`   

### Case-sensitive syntax

*T* `|` `where` *col* `contains_cs` `(`*expression*`)`   

*T* `|` `where` *col* `!contains_cs` `(`*expression*`)` 

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use contains operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State contains "enn"
    | where event_count > 10
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|TENNESSEE|1125|

### Use !contains operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !contains "tex"
    | where event_count > 3000
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|KANSAS|3,166| 

### Use contains_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State contains_cs "AS"
    | count
```

|Count|
|-----|
|8|

### Use !contains_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !contains_cs "AS"
    | count
```

|Count|
|-----|
|59|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `contains`, not `contains_cs`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. `has` works faster than `contains`, `startswith`, or `endswith`. 
For more information, see [Query best practices](best-practices.md).