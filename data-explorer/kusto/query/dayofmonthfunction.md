---
title: dayofmonth() - Azure Data Explorer | Microsoft Docs
description: This article describes dayofmonth() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
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