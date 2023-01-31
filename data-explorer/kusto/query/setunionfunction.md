---
title: set_union() - Azure Data Explorer
description: This article describes set_union() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/02/2019
---
# set_union()

Returns a `dynamic` array of the set of all distinct values that are in any of arrays - (arr1 ∪ arr2 ∪ ...).

## Syntax

`set_union(`*set1*`,` *set2* [`,` *set3*, ...]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *set1...setN* | dynamic | &check; | Arrays used to create a union set. A minimum of 2 arrays are required. See [pack_array](packarrayfunction.md).|

## Returns

Returns a dynamic array of the set of all distinct values that are in any of arrays.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA13MwQ7CIBCE4btPMcdiuNCefZZmU1djjUC2mLKkDy+cDL1+M/mF/JOR8ZDwgUMKmLAljnCXA5wT+zsUt/q4YvxTqaQ97ZVKT+SqRVreM4mQDtmqzbYYCxrPC7Tx1PNuaixKWHlJ2DjNX/8KfiDXCu1ufsyJVeDAAAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 3 step 1
| extend y = x * 2
| extend z = y * 2
| extend w = z * 2
| extend a1 = pack_array(x,y,x,z), a2 = pack_array(x, y), a3 = pack_array(w)
| project set_union(a1, a2, a3)
```

**Output**

|Column1|
|---|
|[1,2,4,8]|
|[2,4,8,16]|
|[3,6,12,24]|

## See also

* [`set_intersect()`](setintersectfunction.md)
* [`set_difference()`](setdifferencefunction.md)
