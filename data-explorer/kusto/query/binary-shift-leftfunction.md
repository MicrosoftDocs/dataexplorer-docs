---
title: binary_shift_left() - Azure Kusto | Microsoft Docs
description: This article describes binary_shift_left() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# binary_shift_left()

Returns binary shift left operation on a pair of numbers.

```kusto
binary_shift_left(x,y)	
```

**Syntax**

`binary_shift_left(`*num1*`,` *num2* `)`

**Arguments**

* *num1*, *num2*: int numbers.

**Returns**

Returns binary shift left operation on a pair of numbers: num1 << (num2%64).
If n is negative a NULL value is returned.