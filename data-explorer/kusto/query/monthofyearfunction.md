---
title: monthofyear() - Azure Data Explorer
description: Learn how to use the monthofyear() function to get the integer representation of the month.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2023
---
# monthofyear()

Returns the integer number represents the month number of the given year.

> The `monthofyear()` and `getmonth()` functions are equivalent

## Syntax

`monthofyear(`*a_date*`)`

## Arguments

* `a_date`: A `datetime`.

## Returns

`month number` of the given year.

## Example

```kusto
monthofyear(datetime(2015-12-14))
```
