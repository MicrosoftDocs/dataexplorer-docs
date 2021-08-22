---
title: matches regex operator - Azure Data Explorer
description: This article describes the matches regex operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# matches regex operator

Filters a record set based on the provided regex value. 

```kusto
Table1 | where col matches regex ('value1')
```
 
## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `matches` `regex` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use 'matches regex' operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State matches regex "K.*S"
    | where event_count > 10
    | project State, event_count
    | render table
```

|State|event_count|
|-----|-----------|
|KANSAS|3166|
|ARKANSAS|1028|
|LAKE SUPERIOR|34|
|LAKE ST CLAIR|32|  