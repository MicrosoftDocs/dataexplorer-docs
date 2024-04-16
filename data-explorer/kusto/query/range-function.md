---
title:  range()
description: Learn how to use the range() function to generate a dynamic array holding a series of equally spaced values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/15/2024
---
# range()

Generates a dynamic array holding a series of equally spaced values.

## Syntax

`range(`*start*`,` *stop* [`,` *step*]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*start*|scalar| :heavy_check_mark:| The value of the first element in the resulting array. |
|*stop*|scalar| :heavy_check_mark:| The maximum value of the last element in the resulting array, such that the last value in the series is less than or equal to the stop value. |
|*step*|scalar||The difference between two consecutive elements of the array. The default value for *step* is `1` for numeric and `1h` for `timespan` or `datetime`.|

## Returns

A dynamic array whose values are: *start*, *start* + *step*, ... up to and including *stop*. The array is truncated if the maximum number of results allowed is reached.  

> [!NOTE]
> The range function supports a maximum of 1,048,576 (2^20) results.

## Examples

The following example returns an array of numbers from one to eight, with an increment of three.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShSsFUoSsxLT9Uw1FGw0FEw1gQAs67sWxgAAAA%3D" target="_blank">Run the query</a>

```kusto
print r = range(1, 8, 3)
```

**Output**

|r  |
|---------|
| [1,4,7] |

The following example returns an array with all dates from the year 2007.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShSsFUoSsxLT9VISSxJLcnMTdUwMjAw1zUwBCJNHQVUUUMjXWOQqGGKJgDOx0s4PwAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print r = range(datetime(2007-01-01), datetime(2007-12-31), 1d)
```

*Output*

|r|
|---|
|["2007-01-01T00:00:00.0000000Z","2007-01-02T00:00:00.0000000Z","2007-01-03T00:00:00.0000000Z",.....,"2007-12-31T00:00:00.0000000Z"]|

The following example returns an array with numbers between one and three.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKzEtP1TDUUTDWBACGRU%2F4EQAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print range(1, 3)
```
*Output*

|print_0|
|---|
|[1,2,3]|

The following example returns a range of hours between one hour and five hours.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKzEtP1TDM0FEwzdAEAL8eicMTAAAA" target="_blank">Run the query</a>

```kusto
print range(1h, 5h)
```

*Output*

|print_0|
|---|
|1,000,000|
|`["01:00:00","02:00:00","03:00:00","04:00:00","05:00:00"]`:|

The following example exceeds the maximum range value limit and is truncated to that limit. The `mv-expand` expands the results into different records up to the maximum range value limit, and returns a count up until that limit.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShSsFUoSsxLT9Uw1DE0gAFNBV6uGoXcMt3UioLEvBSgKhA%2FOb80rwQAsKWN4TcAAAA%3D
" target="_blank">Run the query</a>

```kusto
print r = range(1,1000000000) 
| mv-expand r 
| count
```

*Output*

|Count|
|---|
|1,048,576|
