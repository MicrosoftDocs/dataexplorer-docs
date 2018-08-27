---
title: binary-shift-left() (Azure Kusto)
description: This article describes binary-shift-left() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# binary-shift-left()

Returns binary shift left operation on a pair of numbers

    binary-shift-left(x,y)	

**Syntax**

`binary-shift-left(`*num1*`,` *num2* `)`

**Arguments**

* *num1*, *num2*: int numbers.

**Returns**

Returns binary shift left operation on a pair of numbers: num1 << (num2%64).
If n is negative a NULL value is returned.