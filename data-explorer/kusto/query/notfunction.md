---
title: not() - Azure Kusto | Microsoft Docs
description: This article describes not() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# not()

Reverses the value of its `bool` argument.

```kusto
not(false) == true
```

**Syntax**

`not(`*expr*`)`

**Arguments**

* *expr*: A `bool` expression to be reversed.

**Returns**

Returns the reversed logical value of its `bool` argument.