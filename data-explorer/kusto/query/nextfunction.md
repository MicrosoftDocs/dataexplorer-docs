---
title: next() - Azure Data Explorer
description: Learn how to use the next() function to return the value of the next column at an offset. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# next()

Returns the value of a column in a row that is at some offset following the
current row in a [serialized row set](./windowsfunctions.md#serialized-row-set).

## Syntax

`next(`*column*`,` [ *offset*`,` *default_value* ]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *column*| string |  &check; | The column to get the values from.|
| *offset*| int | | The amount of rows to move from the current row. Default is 1. |
| *default_value*| scalar | | The default value to be used when there's no next row to take the value from. When no default value is specified, `null` is used.|

## Examples

```kusto
Table | serialize | extend nextA = next(A,1)
| extend diff = A - nextA
| where diff > 1

Table | serialize nextA = next(A,1,10)
| extend diff = A - nextA
| where diff <= 10
```
