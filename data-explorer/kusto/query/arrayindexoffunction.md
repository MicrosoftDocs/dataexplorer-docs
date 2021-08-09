---
title: array_index_of() - Azure Data Explorer
description: This article describes array_index_of() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 01/22/2020
---
# array_index_of()

Searches the array for the specified item, and returns its position.

## Syntax

`array_index_of(`*array*,*lookup*`)`

## Arguments

* *array*: Input array to search.
* *lookup*: Value to lookup. The value should be of type long, integer, double, datetime, timespan, decimal, string, or guid.
* *start_index*: Search start position. A negative value will offset the starting search position from the end of the *array* by this many steps: abs(*start_index*). Optional.
* *length*: Number of values to examine. A value of -1 means unlimited length. Optional.
* *occurrence*: The number of the occurrence. Default 1. Optional.

## Returns

Zero-based index position of lookup.
Returns -1 if the value isn't found in the array.

For irrelevant inputs (*occurrence* < 0 or  *length* < -1) - returns *null*.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print arr=dynamic(["this", "is", "an", "example"]) 
| project Result=array_index_of(arr, "example")
```

|Result|
|---|
|3|

## See also

If you only want to check whether a value exists in an array,
but you are not interested in its position, you can use
[set_has_element(`arr`, `value`)](sethaselementfunction.md). This function will improve the readability of your query. Both functions have the same performance.
