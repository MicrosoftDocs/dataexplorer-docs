---
title: `hassuffix` and `nothassuffix` operators - Azure Data Explorer
description: This article describes `hassuffix` and `nothassuffix` operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# hassuffix and !suffix operators

Filters a record set based on the provided value with a search that is not case sensitive. The value represents a term suffix found in the searched column.

```kusto
Table1 | where col hassuffix ('value1')
```
 
## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `hassuffix` `(`*expression*`)`   
 
*T* `|` `where` *col* `!hassuffix` `(`*expression*`)`   

### Case-sensitive syntax

*T* `|` `where` *col* `hassuffix_cs` `(`*expression*`)`   

*T* `|` `where` *col* `!hassuffix_cs` `(`*expression*`)`  

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


### Use !hassuffix operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hassuffix "A"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|ILLINOIS|2022|
|MISSOURI|2016|

### Use hassuffix_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State hassuffix_cs "AS"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|

### Use !hassuffix_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hassuffix_cs "AS"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|IOWA|2337|
|ILLINOIS|2022|
|MISSOURI|2016|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `hassuffix_cs`, not `hassuffix`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
`has` works faster than `contains`, `startswith`, or `endswith`.

For more information, see [Query best practices](best-practices.md).