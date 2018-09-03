---
title: asin() - Azure Kusto | Microsoft Docs
description: This article describes asin() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# asin()

Returns the angle whose sine is the specified number (the inverse operation of [`sin()`](sinfunction.md)) .

**Syntax**

`asin(`*x*`)`

**Arguments**

* *x*: A real number in range [-1, 1].

**Returns**

* The value of the arc sine of `x`
* `null` if `x` < -1 or `x` > 1