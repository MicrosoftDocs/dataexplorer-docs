---
title: dayofyear() - Azure Kusto | Microsoft Docs
description: This article describes dayofyear() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# dayofyear()

Returns the integer number represents the day number of the given year.

```kusto
dayofyear(datetime(2015-12-14))
```

**Syntax**

`dayofweek(`*a_date*`)`

**Arguments**

* `a_date`: A `datetime`.

**Returns**

`day number` of the given year.