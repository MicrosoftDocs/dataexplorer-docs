---
title: array_repeat() - Azure Data Explorer
description: This article describes array_repeat() in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 09/22/2022
---
# array_repeat()

Generates a dynamic array by duplicating input array.

## Syntax

`array_repeat(`*array*`,` *count*`)` 

## Arguments

* *array*: The input dynamic array to repeat into the resulting array.   
* *count*: The count of the elements in the resulting array. The *count* must be an integer number.
Note that *count* doesn't need to be an integer multiplier of the size of the input array. In that case resulting array shall contain fractional number of the input array.
If *count* is less than the size of the input array, the resulting array shall contain the first *count* elements of the input array.
If *count* is equal to zero, a empty array is returned.
If *count* is less than zero, a null value is returned. 

## Examples

The following example returns `['a', 'b', 'c', 'a', 'b', 'c', 'a']`:

```kusto
T | extend r = array_repeat(dynamic(['a', 'b', 'c']), 7)
```