---
title: binary-shift-right() (Azure Kusto)
description: This article describes binary-shift-right() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# binary-shift-right()

eturns binary shift right operation on a pair of numbers

    binary-shift-right(x,y)	

**Syntax**

`binary-shift-right(`*num1*`,` *num2* `)`

**Arguments**

* *num1*, *num2*: long numbers.

**Returns**

Returns binary shift right operation on a pair of numbers: num1 >> (num2%64).
If n is negative a NULL value is returned.