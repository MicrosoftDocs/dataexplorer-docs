---
title: make_list_if() (aggregation function) - Azure Data Explorer
description: This article describes make_list_if() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/25/2022
---
# make_list_if() (aggregation function)

Creates a `dynamic` JSON array of all the values of *Expr* in the group, for which *Predicate* evaluates to `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`make_list_if` `(`*Expr*`,` *Predicate* [`,` *MaxSize*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression that will be used for aggregation calculation. |
| *Predicate* | string | &check; | Predicate that has to evaluate to `true`, in order for *Expr* to be added to the result. |
| *MaxSize* | integer |  | The limit on the maximum number of elements returned. The default is *1048576* and can't exceed *1048576*. |

## Returns

Returns a `dynamic` JSON array of all the values of *Expr* in the group, for which *Predicate* evaluates to `true`.
If the input to the `summarize` operator is not sorted, the order of elements in the resulting array is undefined.
If the input to the `summarize` operator is sorted, the order of elements in the resulting array tracks that of the input.

## Examples

This example shows a list of names with more than 4 letters.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAAy2OsQrCMBRF90D+4dHJQhZFUSu6Ck4i3URCiq9p8CWBJB0UP95HLXc6Z7gcwgItHOFpCq8jXATjsckluWAV67eOve5cKkNDMdhairsUAFBd4hAqBXv1x6sZiXG5m/mMMVlks9rM5saPkcVWisdBilaKL+TRe5PcB8GbF2pyuWjXTw0KOIIwTFDDCdb1D5O20PKtAAAA)**\]**

```kusto
let T = datatable(name:string, day_of_birth:long)
[
   "John", 9,
   "Paul", 18,
   "George", 25,
   "Ringo", 7
];
T
| summarize make_list_if(name, strlen(name) > 4)
```

**Results**

|list_name|
|----|
|["George", "Ringo"]|

## See also

[`make_list`](./makelist-aggfunction.md) function, which does the same, without predicate expression.
