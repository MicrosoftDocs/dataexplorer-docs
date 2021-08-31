---
title: The !has_cs operators - Azure Data Explorer
description: This article describes the !has_cs operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/29/2021
ms.localizationpriority: high
---
# !has_cs operators

Filters a record set based on the provided value using a case-sensitive search. Data that does not have the term is retrieved from the searched column.

```kusto
Table1 | where col !has_cs ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `has_cs`, not `has`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. `has` works faster than `contains`, `startswith`, or `endswith`. For more information, see [Query best practices](best-practices.md).

## Syntax

### Case sensitive syntax

*T* `|` `where` *col* `!has_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use has_cs operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State has_cs "New"
    | count
```

|Count|
|-----|
|0|