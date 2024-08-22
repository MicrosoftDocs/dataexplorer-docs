---
title:  binary_and()
description: Learn how to use the binary_and() function to compare bits in corresponding operands. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_and()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a result of the bitwise `AND` operation between two values.

## Syntax

`binary_and(`*value1*`,`*value2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | `long` |  :heavy_check_mark: | The left-hand value of the bitwise `AND` operation. |
| *value2* | `long` |  :heavy_check_mark: | The right-hand value of the bitwise `AND` operation. |

## Returns

Returns logical `AND` operation on a pair of numbers: value1 & value2.
