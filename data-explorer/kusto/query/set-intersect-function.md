---
title:  set_intersect()
description: Learn how to use the set_intersect() function to create a set of the distinct values that are in all the array inputs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# set_intersect()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a `dynamic` array of the set of all distinct values that are in all arrays - (arr1 ∩ arr2 ∩ ...).

## Syntax

`set_intersect(`*set1*`,` *set2* [`,` *set3*, ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *set1...setN* | `dynamic` |  :heavy_check_mark: | Arrays used to create an intersect set. A minimum of 2 arrays are required. See [pack_array](pack-array-function.md).|

## Returns

Returns a dynamic array of the set of all distinct values that are in all arrays.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA13MsQ7CMAwE0J2vuLFBWdLOfEtlFYMAkUSOpSYVH48zoTDeO/uE4p1RcZP0RoAmLCjKGeH0AVfleEXDxS7OmH90GLWRdqNjJApmmbbXSiLUpuqbr/5wHjT/N2idl5F3X53NZUlP3hSFdX1EZSmWJgp9pz+5L5hXyQHGAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 3 step 1
| extend y = x * 2
| extend z = y * 2
| extend w = z * 2
| extend a1 = pack_array(x,y,x,z), a2 = pack_array(x, y), a3 = pack_array(w,x)
| project set_intersect(a1, a2, a3)
```

**Output**

|Column1|
|---|
|[1]|
|[2]|
|[3]|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVShOLYkH8lKLilOTSzRSKvMSczOTNaINdRSMdBSMYzV1FOBiJjqmsZqaAI3W9uo9AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = set_intersect(dynamic([1, 2, 3]), dynamic([4,5]))
```

**Output**

|arr|
|---|
|[]|

## Related content

* [`set_union()`](set-union-function.md)
* [`set_difference()`](set-difference-function.md)
