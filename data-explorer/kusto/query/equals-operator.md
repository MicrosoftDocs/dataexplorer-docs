---
title: The =~ operators - Azure Data Explorer
description: This article describes the +` operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/29/2021
ms.localizationpriority: high
---
# +~ operators

Filters a record set based on the provided search term.

```kusto
Table1 | where col =~ ('value1')
```

> [!NOTE]
> * Adding '~' to the operator makes values' search case-insensitive: `col =~ (expression)` or `col !~ (expression)`.
 
## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `==`, not `=~`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 

For example, the first of these queries will run faster:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | where State has "North" | count;
StormEvents | where State contains "nor" | count
```

For more information, see [Query best practices](best-practices.md).

## Syntax

### Case insensitive syntax

*T* `|` `where` *col* `=~` `(`*expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use =~ operator  

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | where State =~ "kansas"
    | count 
```

|Count|
|---|
|3,166|  