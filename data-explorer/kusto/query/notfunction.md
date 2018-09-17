---
title: not() - Azure Data Explorer | Microsoft Docs
description: This article describes not() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
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