---
title: totimespan() - Azure Data Explorer
description: Learn how to use the totimespan() function to convert the input to a `timespan` scalar value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/23/2023
---
# totimespan()

Converts the input to a [timespan](./scalar-data-types/timespan.md) scalar value.

```kusto
totimespan("0.00:01:00") == time(1min)
```

> **Deprecated aliases:** totime()

## Syntax

`totimespan(Expr)`

## Arguments

* *`Expr`*: Expression that will be converted to [timespan](./scalar-data-types/timespan.md).

## Returns

If the conversion is successful, the result will be a [timespan](./scalar-data-types/timespan.md) value. Otherwise, the result will be null.
