---
title: ceiling() - Azure Data Explorer
description: This article describes ceiling() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/10/2022
---
# ceiling()

Calculates the smallest integer greater than, or equal to, the specified numeric expression.

## Syntax

`ceiling(`*x*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | int, long, or real | &check; | A number. |

## Returns

* The smallest integer greater than, or equal to, the specified numeric expression.

## Examples

```kusto
print c1 = ceiling(-1.1), c2 = ceiling(0), c3 = ceiling(0.9)
```

|c1|c2|c3|
|---|---|---|
|-1|0|1|
