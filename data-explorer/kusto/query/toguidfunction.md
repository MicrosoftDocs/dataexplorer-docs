---
title: toguid() - Azure Data Explorer | Microsoft Docs
description: This article describes toguid() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 12/30/2021
---
# toguid()

Converts input to [`guid`](./scalar-data-types/guid.md) representation.

```kusto
toguid("70fc66f7-8279-44fc-9092-d364d70fce44") == guid("70fc66f7-8279-44fc-9092-d364d70fce44")
```

> [!NOTE]
> If you have a hard-coded guid, then the recommendation is to use [guid()](./scalar-data-types/guid.md).

## Syntax

`toguid(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be converted to [`guid`](./scalar-data-types/guid.md) scalar. 

## Returns

The conversion process takes the first 32 characters of the input (hyphens are skipped, if they are located correctly), validates they are between 0-9 or a-f, and then converts the string into a [`guid`](./scalar-data-types/guid.md) scalar. The rest of the string is ignored.

* If the conversion is successful, the result will be a [`guid`](./scalar-data-types/guid.md) scalar
* Otherwise, the result will be `null`
