---
title: The !hassuffix_cs operators - Azure Data Explorer
description: This article describes the !hassuffix_cs operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# !hassuffix_cs operators

Filters a record set based on a search value with a case-sensitive search. The value represents a suffix for a term in the searched column. Data that does not contain the suffix is retrieved.

```kusto
Table1 | where col !hassuffix_cs ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example use `hassuffix_cs`, not `hassuffix`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`.
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `!hassuffix_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

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