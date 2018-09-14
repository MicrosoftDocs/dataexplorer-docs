---
title: weekofyear() - Azure Kusto | Microsoft Docs
description: This article describes weekofyear() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# weekofyear()

Retunrs the integer number represents the week number.

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