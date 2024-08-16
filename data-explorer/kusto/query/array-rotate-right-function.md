---
title:  array_rotate_right()
description: Learn how to use the array_rotate_right() function to rotate values inside a dynamic array to the right.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/20/2022
---
# array_rotate_right()

Rotates values inside a `dynamic` array to the right.

## Syntax

`array_rotate_right(`*array*, *rotate_count*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*array* | `dynamic` |  :heavy_check_mark:| The array to rotate.|
|*rotate_count*| integer |  :heavy_check_mark:| The number of positions that array elements will be rotated to the right. If the value is negative, the elements will be rotated to the Left.|

## Returns

Dynamic array containing the same elements as the original array with each element rotated according to *rotate_count*.

## Examples

Rotating to the right by two positions:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1eSqUUitKEnNSwGpiC/KL0ksSU2xBbITK6G8+KLM9IwSDaCQjoKRJgBslCYKTgAAAA==" target="_blank">Run the query</a>

```kusto
print arr=dynamic([1,2,3,4,5])
| extend arr_rotated=array_rotate_right(arr, 2)
```

**Output**

|arr|arr_rotated|
|---|---|
|[1,2,3,4,5]|[4,5,1,2,3]|

Rotating to the left by two positions by using negative rotate_count value:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1eSqUUitKEnNSwGpiC/KL0ksSU2xBbITK6G8+KLM9IwSDaCQjoKukSYA0VPyak8AAAA=" target="_blank">Run the query</a>

**Results**

```kusto
print arr=dynamic([1,2,3,4,5])
| extend arr_rotated=array_rotate_right(arr, -2)
```

**Output**

|arr|arr_rotated|
|---|---|
|[1,2,3,4,5]|[3,4,5,1,2]|

## Related content

* To rotate an array to the left, use [array_rotate_left()](array-rotate-left-function.md).
* To shift an array to the left, use [array_shift_left()](array-shift-left-function.md).
* To shift an array to the right, use [array_shift_right()](array-shift-right-function.md).
