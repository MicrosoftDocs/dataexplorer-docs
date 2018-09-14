---
title: todouble()/toreal() - Azure Kusto | Microsoft Docs
description: This article describes todouble()/toreal() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# todouble()/toreal()

Converts the input to a value of type `real`. (`todouble()` and `toreal()` are synonyms.)

```kusto
toreal("123.4") == 123.4
```

**Syntax**

`toreal(`*Expr*`)`
`todouble(`*Expr*`)`

**Arguments**

* *Expr*: An expression whose value will be converted to a value of type `real`.

**Returns**

If conversion is successful, the result is a value of type `real`.
If conversion is not successful, the result is the value `real(null)`.

*Note*: Prefer using [double() or real()](./scalar-data-types/real.md) when possible.