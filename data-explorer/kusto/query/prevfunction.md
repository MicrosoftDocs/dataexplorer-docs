---
title: prev() - Azure Data Explorer
description: Learn how to use the prev() function to return the value of a specific column in a specified row.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/12/2023
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

```kusto
Table | serialize | extend prevA = prev(A,1)
| extend diff = A - prevA
| where diff > 1

Table | serialize prevA = prev(A,1,10)
| extend diff = A - prevA
| where diff <= 10
```
