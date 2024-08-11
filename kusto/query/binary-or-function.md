---
title:  binary_or()
description: Learn how to use the bianry_or() function to perform a bitwise OR operation of the two values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_or()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a result of the bitwise `or` operation of the two values.

## Syntax

`binary_or(`*value1*`,` *value2* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | `long` |  :heavy_check_mark: | The left-hand value of the bitwise `OR` operation. |
| *value2* | `long` |  :heavy_check_mark: | The right-hand value of the bitwise `OR` operation. |

## Returns

Returns logical OR operation on a pair of numbers: value1 | value2.
