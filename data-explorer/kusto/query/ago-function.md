---
title:  ago()
description: Learn how to use the ago() function to subtract a given timespan from the current UTC clock time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/20/2022
---
# ago()

Subtracts the given [timespan](scalar-data-types/timespan.md) from the current UTC time.

Like `now()`, if you use `ago()` multiple times in a single query statement, the current UTC time
being referenced is the same across all uses.

## Syntax

`ago(`*timespan*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *timespan* | `timespan` |  :heavy_check_mark: | The interval to subtract from the current UTC clock time `now()`. For a full list of possible timespan values, see [timespan literals](scalar-data-types/timespan.md#timespan-literals).|

## Returns

A [datetime](./scalar-data-types/datetime.md) value equal to the current time minus the timespan.

## Example

All rows with a timestamp in the past hour:

```kusto
T | where Timestamp > ago(1h)
```
