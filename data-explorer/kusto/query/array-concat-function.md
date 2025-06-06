---
title:  array_concat()
description: Learn how to use the array_concat() function to concatenate many dynamic arrays to a single array.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# array_concat()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Concatenates many dynamic arrays to a single array.

## Syntax

`array_concat(`*arr* [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *arr* | `dynamic` |  :heavy_check_mark: | The arrays to concatenate into a dynamic array.|

## Returns

Returns a dynamic array of all input arrays.

## Examples

The following example shows concatenated arrays.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA13LMQ6DMAxG4b1S7/CPBGUJnXsWZKUuEogkcj3EiMMTmCrWT+8JpYlR8ZW8IkAzXvgpF4TnYwdX5fSB4d2SHsOfbc3sZhQaForLSCJkXfXmN+dBw91h7vyK5Jmj4uIx5hRJOwrn4Q5bQXxcmgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 3 step 1
| extend y = x * 2
| extend z = y * 2
| extend a1 = pack_array(x,y,z), a2 = pack_array(x, y)
| project array_concat(a1, a2)
```

**Output**

|Column1|
|---|
|[1,2,4,1,2]|
|[2,4,8,2,4]|
|[3,6,12,3,6]|

## Related content

* [pack_array()](pack-array-function.md)
