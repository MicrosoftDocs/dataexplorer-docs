---
title:  array_sort_desc()
description: Learn how to use the array_sort_desc() function to sort arrays in descending order.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 02/02/2025
---
# array_sort_desc()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Receives one or more arrays. Sorts the first array in descending order. Orders the remaining arrays to match the reordered first array.

## Syntax

`array_sort_desc(`*array1*[, ..., *argumentN*]`)`

`array_sort_desc(`*array1*[, ..., *argumentN*]`,`*nulls_last*`)`

If *nulls_last* isn't provided, a default value of `true` is used.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*array1...arrayN*| `dynamic` |  :heavy_check_mark: | The array or list of arrays to sort.|
| *nulls_last* | `bool` |  | Determines whether `null`s should be last.|

## Returns

Returns the same number of arrays as in the input, with the first array sorted in ascending order, and the remaining arrays ordered to match the reordered first array.

`null` is returned for every array that differs in length from the first one.

An array which contains elements of different types, is sorted in the following order:

* Numeric, `datetime`, and `timespan` elements
* String elements
* Guid elements
* All other elements

## Examples

The following example sorts the initial array, `array1`, in descending order. It then sorts `array2` to match the new order of `array1`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFILCpKrDRUsFVIqcxLzM1M1og21DHWMdEx1TGK1bTmyoEpMUJWopSopKOUBMTJQJwCxKlKIMUFRZl5UOXxxflFJfEpqcXJGhAbdCCmaAIAmTiTMnQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let array1 = dynamic([1,3,4,5,2]);
let array2 = dynamic(["a","b","c","d","e"]);
print array_sort_desc(array1,array2)
```

**Output**

|array1_sorted|array2_sorted|
|---|---|
|[5,4,3,2,1]|["d","c","b","e","a"]|

> [!NOTE]
> The output column names are generated automatically, based on the arguments to the function. To assign different names to the output columns, use the following syntax: `... | extend (out1, out2) = array_sort_desc(array1,array2)`.


The following example sorts a list of names in descending order. It saves a list of names to a variable, `Names`, which is then splits into an array and sorted in descending order. The query returns the names in descending order.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHwS8xNLVawVVDyys%2FI0wlILM3R8UrMS9XxTqzMV7Lm5coBqgnOLypJTYGpLC4pSk4siU8sKkqs1ACT8cVABfEpqcXJGsUFOZklGmClOgpKOkqamhAKaFJBUWZeiUJRanFpTgnQGCRDAeUAGb%2BIAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Names = "John,Paul,Jane,Kayo";
let SortedNames = strcat_array(array_sort_desc(split(Names, ",")), ",");
print result = SortedNames
```

**Output**

|result|
|---|
|Paul,Kayo,John,Jane|


The following example uses the `summarize` operator and the `array_sort_asc` function to organize and sort commands by user in descending chronological order.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WR0WoDIRBF3/crJC9ZYQO7tiU00C8JQYwOiY2uy4yhpPTjq23sFmIK1ZdxOPdy5RoV0907aHXwXo1mQxHteOjY9S2j9bAxKkIeOnYmQGkLxpttw9JZ6qMPZtmlsaCt6IfnVb9eDU887xdZOSy6b97RF1zje1HhjcWr4IYXNd6fiuI2z2OFR383j1hX+OnN3M1T++9f/g8zL/7pn/ld88HonMpC+w4soxSVn4i9MK9OIJ2l2P5uk/+UW2U4219Kzcl6wvAKOpbNrJV2lPqIYQwuHKxWTgY0gMlSIaqLpIBRGiDdzplmNd8Ou0832AsNfQIAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(command:string, command_time:datetime, user_id:string)
[
    'chmod',   datetime(2019-07-15),   "user1",
    'ls',      datetime(2019-07-02),   "user1",
    'dir',     datetime(2019-07-22),   "user1",
    'mkdir',   datetime(2019-07-14),   "user1",
    'rm',      datetime(2019-07-27),   "user1",
    'pwd',     datetime(2019-07-25),   "user1",
    'rm',      datetime(2019-07-23),   "user2",
    'pwd',     datetime(2019-07-25),   "user2",
]
| summarize timestamps = make_list(command_time), commands = make_list(command) by user_id
| project user_id, commands_in_chronological_order = array_sort_desc(timestamps, commands)[1]
```

**Output**

|user_id|commands_in_chronological_order|
|---|---|
|user1|[<br>  "rm",<br>  "pwd",<br>  "dir",<br>  "chmod",<br>  "mkdir",<br>  "ls"<br>]|
|user2|[<br>  "pwd",<br>  "rm"<br>]|

> [!NOTE]
> If your data can contain `null` values, use [make_list_with_nulls](make-list-with-nulls-aggregation-function.md) instead of [make_list](make-list-aggregation-function.md).


By default, `null` values are put last in the sorted array. However, you can control it explicitly by adding a `bool` value as the last argument to `array_sort_asc()`.

The following example shows the default behavior:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbFNLCpKrIwvzi8qiU9JLU7WSKnMS8zNTNaIzivNydFRSsopTVXSUapMzcnJLwcy0otSU%2FOUdECSsZqaAAa5vexKAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=array_sort_desc(dynamic([null,"blue","yellow","green",null]))
```

**Output**

|result|
|---|
|["yellow","green","blue",null,null]|

The following example shows nondefault behavior using the `false` parameter, which specifies that nulls are placed at the beginning of the array.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAxXJUQqAIAwA0KvIvhR2hU4SIaYrhDVjU8LbV38P3q1VulOywX1JqmlGa9pjIcu%2BTElXzX6VwYyw8yBAmMTcng%2BnEgngn1tAdyQ2Ci%2Bihlo3UQAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=array_sort_desc(dynamic([null,"blue","yellow","green",null]), false)
```

**Output**

|result|
|---|
|[null,null,"yellow","green","blue"]|

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [array_sort_asc()](array-sort-asc-function.md)
* [strcat_array()](strcat-array-function.md)
