---
title: tobool() - Azure Data Explorer | Microsoft Docs
description: This article describes tobool() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# tobool()

Converts input to boolean (signed 8-bit) representation.

```kusto
tobool("true") == true
tobool("false") == false
tobool(1) == true
tobool(123) == true
```

**Syntax**

`tobool(`*Expr*`)`
`toboolean(`*Expr*`)` (alias)

**Arguments**

* *Expr*: Expression that will be converted to boolean. 

**Returns**

If conversion is successful, result will be a boolean.
If conversion is not successful, result will be `null`.
 