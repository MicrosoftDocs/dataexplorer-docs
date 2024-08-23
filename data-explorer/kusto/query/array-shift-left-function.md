---
title:  array_shift_left()
description: Learn how to use the array_shift_left() function to shift the values inside a dynamic array to the left.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# array_shift_left()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Shifts the values inside a [dynamic](../query/scalar-data-types/dynamic.md) array to the left.

## Syntax

`array_shift_left(`*array*, *shift_count* [`,` *default_value* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*array* | `dynamic` | :heavy_check_mark: | The array to shift.|
|*shift_count* | `int` |  :heavy_check_mark: | The number of positions that array elements are shifted to the left. If the value is negative, the elements are shifted to the right. |
|*default_value* | scalar | | The value used for an element that was shifted and removed. The default is null or an empty string depending on the type of elements in the *array*.|

## Returns

Returns a dynamic array containing the same number of elements as in the original array. Each element has been shifted according to *shift_count*. New elements that are added in place of removed elements have a value of *default_value*.

## Examples

Shifting to the left by two positions:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1eTlqlFIrShJzUsBKYkvzshMK7EFshIrIez4nNS0Eg2ggI6CkSYADEKYSUsAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4,5])
| extend arr_shift=array_shift_left(arr, 2)
```

**Output**

|arr|arr_shift|
|---|---|
|[1,2,3,4,5]|[3,4,5,null,null]|

Shifting to the left by two positions and adding default value:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1eTlqlFIrShJzUsBKYkvzshMK7EFshIrIez4nNS0Eg2ggI6CkY6CrqEmAA+qvHJPAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4,5])
| extend arr_shift=array_shift_left(arr, 2, -1)
```

**Output**

|arr|arr_shift|
|---|---|
|[1,2,3,4,5]|[3,4,5,-1,-1]|

Shifting to the right by two positions by using negative *shift_count* value:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1eTlqlFIrShJzUsBKYkvzshMK7EFshIrIez4nNS0Eg2ggI6CrhEQG2oCAIeuighQAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4,5])
| extend arr_shift=array_shift_left(arr, -2, -1)
```

**Output**

|arr|arr_shift|
|---|---|
|[1,2,3,4,5]|[-1,-1,1,2,3]|

## Related content

* To shift an array to the right, use [array_shift_right()](array-shift-right-function.md).
* To rotate an array to the right, use [array_rotate_right()](array-rotate-right-function.md).
* To rotate an array to the left, use [array_rotate_left()](array-rotate-left-function.md).
