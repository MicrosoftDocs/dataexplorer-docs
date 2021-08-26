---
title: endswith operators - Azure Data Explorer
description: This article describes endswith operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/18/2019
ms.localizationpriority: high
---
# endswith and !endswith operators

Filters a record set based on the provided value with a search that is not case sensitive. The value represents an ending sequence of the string found in the searched column.

```kusto
Table1 | where col endswith ('value1')
```

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `endswith` `(`*expression*`)`   
 
*T* `|` `where` *col* `!endswith` `(`*expression*`)`   

### Case sensitive syntax

*T* `|` `where` *col* `endswith_cs` `(`*expression*`)`   

*T* `|` `where` *col* `!endswith_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use endswith operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State endswith "sas"
    | where event_count > 10
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|KANSAS|3166|
|ARKANSAS|1028|  

### Use !endswith operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !endswith "is"
    | where event_count > 2000
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|MISSOURI|2016|

### Use endswith_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State endswith_cs "IDA"
    | count
```

|Count|
|-----|
|1|

### Use !endswith_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !endswith_cs "New"
    | count
```

|Count|
|-----|
|66|

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `endswith_cs`, not `endswith`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. `has` works faster than `contains`, `startswith`, or `endswith`. 
For more information, see [Query best practices](best-practices.md).