---
title: has_all operator - Azure Data Explorer
description: This article describes the has_all operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/05/2021
---
# has_all operator

The `has_all` operator filters a searched column for matching records based on the provided set of values (all values must be present).

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one. For example, use `==`, not `=~`.

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 

For more information, see [Query best practices](best-practices.md).

## Syntax

*T* `|` `where` *col* `has_all` `(`*list of scalar expressions*`)`   
*T* `|` `where` *col* `has_all` `(`*tabular expression*`)`   
 
## Arguments

* *T*: Tabular input whose records are to be filtered.
* *col*: Column to filter.
* *list of expressions*: Comma separated list of tabular, scalar, or literal expressions.  
* *tabular expression*: Tabular expression that has a set of values (if expression has multiple columns, the first column is used).

## Returns

Rows in *T* for which the predicate is `true`

> [!NOTE]
>
> * The expression list can produce up to `256` values.    
> * For tabular expressions, the first column of the result set is selected.   

## Examples

### Use has_all operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where EpisodeNarrative has_all ("cold", "strong", "afternoon", "hail")
| summarize Count=count() by EventType
| top 3 by Count
```

|EventType|Count|
|---|---|
|Thunderstorm Wind|517|
|Hail|392|
|Flash Flood|24|

### Use a dynamic array

The same result can be achieved using a dynamic array notation:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let keywords = dynamic(["cold", "strong", "afternoon", "hail"]);
StormEvents 
| where EpisodeNarrative has_all (keywords)
| summarize Count=count() by EventType
| top 3 by Count
```

|EventType|Count|
|---|---|
|Thunderstorm Wind|517|
|Hail|392|
|Flash Flood|24|