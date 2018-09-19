---
title: weekofyear() - Azure Data Explorer | Microsoft Docs
description: This article describes weekofyear() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# weekofyear()

Returns the integer number represents the week number.

Aligned with ISO 8601 standards, where first day of the week is Sunday.

```kusto
weekofyear(datetime("2015-12-14"))
```

**Syntax**

`weekofyear(`*a_date*`)`

**Arguments**

* `a_date`: A `datetime`.

**Returns**

`week number` - The week number that contains the given date.