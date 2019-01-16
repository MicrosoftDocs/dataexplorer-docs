---
title: monthofyear() - Azure Data Explorer | Microsoft Docs
description: This article describes monthofyear() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# monthofyear()

Returns the integer number represents the month number of the given year.

```kusto
monthofyear(datetime("2015-12-14"))
```

**Syntax**

`monthofyear(`*a_date*`)`

**Arguments**

* `a_date`: A `datetime`.

**Returns**

`month number` of the given year.