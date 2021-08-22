---
title: hasprefix and nothasprefix operators - Azure Data Explorer
description: This article describes hasprefix and nothasprefix operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# hasprefix and !hasprefix operators

Filters a record set based on the provided value with a search that is not case sensitive. The value represents a term prefix found in the searched column.

```kusto
Table1 | where col hasprefix ('value1')
```
 
## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `hasprefix` `(`*expression*`)`   
 
*T* `|` `where` *col* `!hasprefix` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use 'hasprefix' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix "la"
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|LAKE MICHIGAN|182|
|LAKE HURON|63|
|LAKE SUPERIOR|34|
|LAKE ST CLAIR|32|
|LAKE ERIE|27|
|LAKE ONTARIO|8|

### Use '!hasprefix' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hasprefix "N"
    | where event_count > 2000
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|ILLINOIS|2022|
|MISSOURI|2016|

# hasprefix_cs and !hasprefix_cs operators

Filters a record set based on a value using a search that is case sensitive. The value represents a term prefix found in the searched column.

```kusto
Table1 | where col hasprefix_cs ('value1')
```
 
## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `hasprefix_cs` `(`*expression*`)`   

*T* `|` `where` *col* `!hasprefix_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use 'hasprefix_cs' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | count 
```

|Count|
|-----|
|3|

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hasprefix_cs "P"
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|PUERTO RICO|192|
|E PACIFIC|10|

### Use '!hasprefix_cs' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hasprefix_cs "P"
    | count
```

|Count|
|-----|
|64|