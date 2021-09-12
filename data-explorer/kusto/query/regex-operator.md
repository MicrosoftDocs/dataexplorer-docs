---
title: regex string operator - Azure Data Explorer
description: This article describes the regex string operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---
# regex operator

Filters a record set based on a case-sensitive regex value. 

For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

For better performance, see [Query best practices](best-practices.md).

## Syntax

*T* `|` `where` *col* `matches` `regex` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where State matches regex "K.*S"
    | where event_count > 10
    | project State, event_count
```

|State|event_count|
|-----|-----------|
|KANSAS|3166|
|ARKANSAS|1028|
|LAKE SUPERIOR|34|
|LAKE ST CLAIR|32|  