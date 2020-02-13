---
title: tostring() - Azure Data Explorer | Microsoft Docs
description: This article describes tostring() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# tostring()

Converts input to a string representation.

```
tostring(123) == "123"
```

**Syntax**

`tostring(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to string. 

**Returns**

If *Expr* value is non-null result will be a string representation of *Expr*.
If *Expr* value is null, result will be empty string.
 