---
title: make_set_if() (aggregation function) - Azure Data Explorer
description: This article describes make_set_if() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/25/2022
---
# make_set_if() (aggregation function)

Creates a `dynamic` JSON array of the set of distinct values that *Expr* takes in the group, for which *Predicate* evaluates to `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`make_set_if` `(`*Expr*`,` *Predicate* [`,` *MaxSize*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression that will be used for aggregation calculation. |
| *Predicate* | string | &check; | Predicate that has to evaluate to `true`, in order for *Expr* to be added to the result. |
| *MaxSize* | integer |  | The limit on the maximum number of elements returned. The default is *1048576* and can't exceed *1048576*. |

## Returns

Returns a `dynamic` (JSON) array of the set of distinct values that *Expr* takes in the group, for which *Predicate* evaluates to `true`.
The array's sort order is undefined.

> [!TIP]
> To only count the distinct values, use [dcountif()](dcountif-aggfunction.md)

## See also

[`make_set`](./makeset-aggfunction.md) function, which does the same, without predicate expression.

## Examples

This example shows a list of names with more than 4 letters.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAAy2OPQvCMBRF90D+w6WThSyKolZ0FZxEuomEFF/bYD4gTQfFH++jljudM1yOo4waRzxN5jWOFsF4qoacbOgU67eOrW5syn3lYuhKKe5SACgusQ+Fwl798WpGx7jczXymmDpis9rM5saPkcVWisdBilqKL4bRe5Psh+DNi/RAWdt2SlDgBkdhghInrMsfHHNqyKwAAAA=)**\]**

```kusto
let T = datatable(name:string, day_of_birth:long)
[
   "John", 9,
   "Paul", 18,
   "George", 25,
   "Ringo", 7
];
T
| summarize make_set_if(name, strlen(name) > 4)
```

**Results**

|set_name|
|----|
|["George", "Ringo"]|
