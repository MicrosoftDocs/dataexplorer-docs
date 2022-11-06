---
title: binary_not() - Azure Data Explorer
description: This article describes binary_not() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# binary_not()

Returns a bitwise negation of the input value.

```kusto
binary_not(x)
```

## Syntax

`binary_not(`*num1*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *num1* | long | &check; | A long number. |

## Returns

Returns logical NOT operation on a number: num1.
