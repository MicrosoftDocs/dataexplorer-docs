---
title: The decimal data type - Azure Data Explorer
description: This article describes The decimal data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/23/2018
---
# The decimal data type

The `decimal` data type represents a 128-bit wide, decimal number.

Literals of the `decimal` data type have the same representation
as .NET's `System.Data.SqlTypes.SqlDecimal`.

`decimal(1.0)`, `decimal(0.1)`, and `decimal(1e5)` are all literals of type `decimal`.

There are several special literal forms:
* `decimal(null)`: The is the [null value](null-values.md).

> [!NOTE]
> Math operations on `decimal` type are significantly slower than operations on [real](real.md) data type.
> If your use case doesn't require very high precision, it's advised to switch to `real`.

