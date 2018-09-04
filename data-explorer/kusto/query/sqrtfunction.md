---
title: sqrt() - Azure Kusto | Microsoft Docs
description: This article describes sqrt() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# sqrt()

Returns the square root function.  

**Syntax**

`sqrt(`*x*`)`

**Arguments**

* *x*: A real number >= 0.

**Returns**

* A positive number such that `sqrt(x) * sqrt(x) == x`
* `null` if the argument is negative or cannot be converted to a `real` value. 