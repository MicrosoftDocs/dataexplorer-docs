---
title: isnotempty() - Azure Kusto | Microsoft Docs
description: This article describes isnotempty() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# isnotempty()

Returns `true` if the argument is not an empty string nor it is a null.

```kusto
isnotempty("") == false
```

**Syntax**

`isnotempty(`[*value*]`)`

`notempty(`[*value*]`)` -- alias of `isnotempty`