---
title: monthofyear() (Azure Kusto)
description: This article describes monthofyear() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# monthofyear()

Returns the integer number represents the month number of the given year.

    monthofyear(datetime("2015-12-14"))

**Syntax**

`monthofyear(`*a-date*`)`

**Arguments**

* `a-date`: A `datetime`.

**Returns**

`month number` of the given year.