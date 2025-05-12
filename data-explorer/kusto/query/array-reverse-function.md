---
title:  array_reverse()
description: Learn how to use the array_reverse() function to reverse the order of the elements in a dynamic array.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/11/2024
---
# array_reverse()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Reverses the order of the elements in a dynamic array.

## Syntax

`array_reverse(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*value*| `dynamic` |  :heavy_check_mark:| The array to reverse.|

## Returns

Returns an array that contains the same elements as the input array in reverse order.

## Example

The following example shows an array of words reversed.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1ohWKsnILFbSUVCCkIl5IDK1IjG3ICdVKVZTgZerRqGgKD8rNblEISi1uDSnxBaoP7Eyvii1LLWoOFUDyNMEAKks9PlYAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic(["this", "is", "an", "example"]) 
| project Result=array_reverse(arr)
```

**Output**

|Result|
|---|
|["example","an","is","this"]|
