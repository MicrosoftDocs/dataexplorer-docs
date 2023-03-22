---
title: prev() - Azure Data Explorer
description: Learn how to use the prev() function to return the value of a specific column in a specified row.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/22/2023
---
# prev()

Returns the value of a specific column in a specified row.
The specified row is at a specified offset from the current row in a [serialized row set](./windowsfunctions.md#serialized-row-set).

## Syntax

`prev(`*column*`,` [ *offset* ]`,` [ *default_value* ] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *column*| string | &check; | The column from which to get the values.|
| *offset*| int | | The offset to go back in rows. The default is 1.|
| *default_value*| scalar | | The default value to be used when there are no previous rows from which to take the value. The default is `null`.|

## Examples

### Extend row with data from the previous row

In the following query, a new column called `prevA` is added to the table with data from column `A` of the previous row. A default value of 10 is used for rows without any data in column `A`. Then, the difference between the values in column `A` and the corresponding value in `prevA` is calculated and stored in a new column called `diff`. Finally, the table is filtered based on whether the value in column `A` is 1 greater than the corresponding value in `prevA`.

```kusto
Table | serialize | extend prevA = prev(A,1,10)
| extend diff = A - prevA
| where diff > 1
```
