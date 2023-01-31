---
title: The case-insensitive has_all string operator - Azure Data Explorer
description: Learn how to use the has_all string operator to filter a record set for data with one or more case-insensitive search strings.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/18/2022
---
# has_all operator

Filters a record set for data with one or more case-insensitive search strings. `has_all` searches for indexed terms, where an indexed [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `has_all` `(`*scalar_value* [`,` *scalar_value_2*`,` *scalar_value_3*`,` ... ]`)`

*T* `|` `where` *col* `has_all` `((`*tabular_expr*`))`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_value* | scalar | &check; | A value or comma-separated set of values to search for in *col*.|
| *tabular_expr* | string | &check; | A tabular expression that produces a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used. The *tabular_expr* can produce up to 256 distinct results.|

## Returns

Rows in *T* for which the predicate is `true`.

## Examples

### Use has_all operator with a list

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx2NsQ7CMAxEd77CytRKbMxMqCsL7Mi0hkRK7Mh2i4r4eJoup7vT093NRcuwELvB4QefSEow1GQy0RVV0dNCENEemDN0YZQ8hSMEcxV+N4cvJ2URbiFiyqHfhmwuBTV9CS4ys5/Hpl0PzxX2t/taacNcKpxauVN/jkW/jI0AAAA=" target="_blank">Run the query</a>

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

### Use has_all operator with a dynamic array

The same result can be achieved using a dynamic array notation.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx2NsQoCMRBEe8F/WFJdwM7aSq610U4OWXOrF0h2j83eScSPl1wzzAyPmauJ5n4ltgL73Q8+EylBP8ciI11QFS2uBBOWB6YE3VgZcwzd3QVJozuAK6bC7+bwZaQswi1MGJMbvG+jZckZNX4JzrKwnULTzsOzwnZ9qzM1zmSGY2s37A8IXzPSmwAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where EpisodeNarrative has_all (dynamic(["cold", "strong", "afternoon", "hail"]))
| summarize Count=count() by EventType
| top 3 by Count
```

|EventType|Count|
|---|---|
|Thunderstorm Wind|517|
|Hail|392|
|Flash Flood|24|
