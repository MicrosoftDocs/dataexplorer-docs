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

*T* `|` `where` *col* `has_all` `(`*scalar_expr*`,` [*scalar_expr_2*`,` *scalar_expr3*`,` ... ]`)`
*T* `|` `where` *col* `has_all` `(`*tabular_expr*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_expr* | scalar | | An expression or list of expressions to search for in *col*.|
| *tabular_expr* | string | | A tabular expression that has a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used.|

> [!NOTE]
> At least one *scalar_expr* or a single *tabular_expr* is required.

## Returns

Rows in *T* for which the predicate is `true`.

> [!NOTE]
>
> * The expression list can produce up to `256` values.
> * For tabular expressions, the first column of the result set is selected.

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

The same result can be achieved using a dynamic array notation:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzWNsQrCQBBE+3zFclUCdpaSStLaaCcia241h3e3YW+TcOLHmwvYDDPDY8aTwpvywmITtGBzxOD6+mp69tbswCQVjq/i8KkkkTmWMKDz5tYcqrOyhG6mqAmqLywDCUE3usSWTiiC6maCAdMdvYf6/9WsbJpCQHEfgiNPUdu+aN3AI8M2eMkjrZjyCPtSbtQPqfuJjLEAAAA=" target="_blank">Run the query</a>

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
