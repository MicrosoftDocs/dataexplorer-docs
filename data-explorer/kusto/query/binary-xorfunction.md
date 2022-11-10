---
title: binary_xor() - Azure Data Explorer
description: This article describes binary_xor() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# binary_xor()

Returns a result of the bitwise `xor` operation of the two values.

```kusto
binary_xor(x,y)
```

## Syntax

`binary_xor(`*value1*`,` *value2* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | int | &check; | An integer. |
| *value2* | int | &check; | An integer. |

## Returns

Returns logical XOR operation on a pair of numbers: num1 ^ num2.
