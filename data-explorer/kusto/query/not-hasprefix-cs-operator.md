---
title: The !hasprefix_cs operators - Azure Data Explorer
description: This article describes the !hasprefix_cs operators in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# !hasprefix_cs operators

Filters a record set based on the provided value with a case-sensitive search. Data that does not contain the prefix is retrieved from the searched column.

```kusto
Table1 | where col !hasprefix_cs ('value1')
```

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `hasprefix_cs`, not `hasprefix`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`; `has` works faster than `hasprefix`.
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `!hasprefix_cs` `(`*expression*`)`  

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use !hasprefix_cs operator

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State !hasprefix_cs "P"
    | count
```

|Count|
|-----|
|64|