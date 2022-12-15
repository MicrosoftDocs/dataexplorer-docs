---
title: monthofyear(), getmonth() - Azure Data Explorer
description: Learn how to use the monthofyear() and getmonth() functions to get the integer representation of the month.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# monthofyear(), getmonth()

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
