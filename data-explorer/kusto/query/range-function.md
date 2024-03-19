---
title:  range()
description: Learn how to use the range() function to generate a dynamic array holding a series of equally spaced values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
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

A dynamic array whose values are: *start*, *start* + *step*, ... up to and including *stop*.  The array will be truncated if the maximum number of values is reached.  

> [!NOTE]
> The maximum number of values is 1,048,576 (2^20).

## Examples

The following example returns `[1, 4, 7]`:

```kusto
T | extend r = range(1, 8, 3)
```

The following example returns an array holding all days
in the year 2015:

```kusto
T | extend r = range(datetime(2015-01-01), datetime(2015-12-31), 1d)
```

The following example returns `[1,2,3]`:

```kusto
range(1, 3)
```

The following example returns `["01:00:00","02:00:00","03:00:00","04:00:00","05:00:00"]`:

```kusto
range(1h, 5h)
```

The following example returns `1048576`:

```kusto
print r = range(1,1000000000) | mv-expand r | count
```
