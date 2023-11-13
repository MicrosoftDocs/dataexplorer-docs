---
title:  make_list_if() (aggregation function)
description: Learn how to use the make_list_if() aggregation function to create a dynamic JSON object of expression values where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# make_list_if() (aggregation function)

Creates a `dynamic` array of *expr* values in the group for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`make_list_if(`*expr*`,` *predicate* [`,` *maxSize*]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | string | &check; | The expression used for the aggregation calculation. |
| *predicate* | string | &check; | A predicate that has to evaluate to `true` in order for *expr* to be added to the result. |
| *maxSize* | integer |  | The maximum number of elements returned. The default and max value is 1048576. |

## Returns

Returns a `dynamic` array of *expr* vlaues in the group for which *predicate* evaluates to `true`.
If the input to the `summarize` operator isn't sorted, the order of elements in the resulting array is undefined.
If the input to the `summarize` operator is sorted, the order of elements in the resulting array tracks that of the input.

## Example

The following example shows a list of names with more than 4 letters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2OsQrCMBRF90D+4dHJQhZFUSu6Ck4i3URCiq9p8CWBJB0UP95HLXc6Z7gcwgItHOFpCq8jXATjsckluWAV67eOve5cKkNDMdhairsUAFBd4hAqBXv1x6sZiXG5m/mMMVlks9rM5saPkcVWisdBilaKL+TRe5PcB8GbF2pyuWjXTw0KOIIwTFDDCdb1D5O20PKtAAAA" target="_blank">Run the query</a>

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

**Output**

|list_name|
|----|
|["George", "Ringo"]|

## See also

[`make_list`](./makelist-aggfunction.md) function, which does the same, without predicate expression.
