---
title:  sqrt()
description: Learn how to use the sqrt() function to return the square root of the input,
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/31/2023
---
# sqrt()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the square root of the input.

## Syntax

`sqrt(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | int, long, or real |  :heavy_check_mark: | The number for which to calculate the square root.|

## Returns

* A positive number such that `sqrt(x) * sqrt(x) == x`
* `null` if the argument is negative or can't be converted to a `real` value.
