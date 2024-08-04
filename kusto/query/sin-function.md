---
title:  sin()
description: Learn how to use the sin() function to return the sine value of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# sin()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the sine function value of the specified angle. The angle is specified in radians.

## Syntax

`sin(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | `real` |  :heavy_check_mark: | The value in radians for which to calculate the sine.|

## Returns

The sine of *number* of radians.

## Example

```kusto
print sin(1)
```

**Output**

|result|
|--|
|0.841470984807897|
