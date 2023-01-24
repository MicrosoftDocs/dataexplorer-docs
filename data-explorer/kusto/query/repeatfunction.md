---
title: repeat() - Azure Data Explorer
description: Learn how to use the repeat() function to generate a dynamic array containing a series comprised of repeated numbers.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/23/2023
---
# repeat()

Generates a dynamic array containing a series comprised of repeated numbers.

## Syntax

`repeat(`*value*`,` *count*`)`

## Arguments

* *value*: The value of the element in the resulting array. The type of *value* can be boolean, integer, long, real, datetime, or timespan.
* *count*: The count of the elements in the resulting array. The *count* must be an integer number.
If *count* is equal to zero, an empty array is returned.
If *count* is less than zero, a null value is returned.

## Examples

The following example returns `[1, 1, 1]`:

```kusto
T | extend r = repeat(1, 3)
```
