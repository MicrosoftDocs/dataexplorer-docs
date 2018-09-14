---
title: binary_or() - Azure Kusto | Microsoft Docs
description: This article describes binary_or() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# binary_or()

Returns a result of the bitwise `or` operation of the two values. 

```kusto
binary_or(x,y)
```

**Syntax**

`binary_or(`*num1*`,` *num2* `)`

**Arguments**

* *num1*, *num2*: long numbers.

**Returns**

Returns logical OR operation on a pair of numbers: num1 | num2.