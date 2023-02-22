---
title: todatetime() - Azure Data Explorer
description: Learn how to use the todatetime() function to convert the input expression to a datetime value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/20/2023
---
# todatetime()

Converts the input to a [datetime](./scalar-data-types/datetime.md) scalar value.

```kusto
todatetime("2015-12-24") == datetime(2015-12-24)
```

## Syntax

`todatetime(`*Expr*`)`

## Arguments

* *Expr*: An expression that will be converted to a [datetime](./scalar-data-types/datetime.md) value.

## Returns

If the conversion is successful, the result will be a [datetime](./scalar-data-types/datetime.md) value. Otherwise, the result will be `null`.

> [!NOTE]
> Use [datetime()](scalar-data-types/datetime.md#datetime-literals) when possible.
