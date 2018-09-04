---
title: acos() - Azure Kusto | Microsoft Docs
description: This article describes acos() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# acos()

Returns the angle whose cosine is the specified number (the inverse operation of [`cos()`](cosfunction.md)) .

**Syntax**

`acos(`*x*`)`

**Arguments**

* *x*: A real number in range [-1, 1].

**Returns**

* The value of the arc cosine of `x`
* `null` if `x` < -1 or `x` > 1