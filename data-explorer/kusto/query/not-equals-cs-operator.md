---
title: The != operator - Azure Data Explorer
description: This article describes the != operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/31/2021
ms.localizationpriority: high
---
# != operators

Filters a record set based on the provided search term with a case-sensitive search. Data that does not match the string is retrieved from the searched column.

```kusto
Table1 | where col != ('value1')
```

> [!NOTE]
> * Adding '~' to the operator makes values' search case-insensitive: `col =~ (expression)` or `col !~ (expression)`.


## Syntax

### Case-sensitive syntax

*T* `|` `where` *col* `!=` `(`*list of scalar expressions*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use != operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where (State != "FLORIDA") and (event_count > 4000)
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|TEXAS|4,701|