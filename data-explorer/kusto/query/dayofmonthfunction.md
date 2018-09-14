---
title: dayofmonth() - Azure Kusto | Microsoft Docs
description: This article describes dayofmonth() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# dayofmonth()

Returns the integer number representing the day number of the given month

```kusto
dayofmonth(datetime(2015-12-14)) == 14
```

**Syntax**

`dayofmonth(`*a_date*`)`

**Arguments**

* `a_date`: A `datetime`.

**Returns**

`day number` of the given month.