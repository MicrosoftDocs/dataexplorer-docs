---
title: contains and notcontains operators - Azure Data Explorer
description: This article describes contains and notcontains operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# contains and !contains operators

Filters a record set based on the provided value with a search that is not case sensitive. The value represents a string contained in the searched column.

```kusto
Table1 | where col contains ('value1')
```
 
## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `contains` `(`*expression*`)`   
 
*T* `|` `where` *col* `!contains` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use 'contains' operator

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

### Use '!contains' operator

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

# contains_cs and !contains_cs operators

Filters a record set based on a value using a search that is case sensitive. The value represents a string contained in the searched column.

```kusto
Table1 | where col contains_cs ('value1')
```
 
## Syntax

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

### Use 'contains_cs' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State contains_cs "AS"
    | count
```

|Count|
|-----|
|8|

### Use '!contains_cs' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !contains_cs "AS"
    | count
```

|Count|
|-----|
|59|