---
title: binary_xor() - Azure Kusto | Microsoft Docs
description: This article describes binary_xor() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# binary_xor()

Returns a result of the bitwise `xor` operation of the two values.

```kusto
binary_xor(x,y)
```

**Syntax**

`binary_xor(`*num1*`,` *num2* `)`

**Arguments**

* *num1*, *num2*: long numbers.

**Returns**

Returns logical XOR operation on a pair of numbers: num1 ^ num2.