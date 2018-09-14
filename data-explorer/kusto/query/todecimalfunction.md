---
title: todecimal() - Azure Kusto | Microsoft Docs
description: This article describes todecimal() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# todecimal()

Converts input to decimal number representation.

```kusto
todecimal("123.45678") == decimal(123.45678)
```

**Syntax**

`todecimal(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to decimal. 

**Returns**

If conversion is successful, result will be a decimal number.
If conversion is not successful, result will be `null`.
 
*Note*: Prefer using [real()](./scalar-data-types/real.md) when possible.