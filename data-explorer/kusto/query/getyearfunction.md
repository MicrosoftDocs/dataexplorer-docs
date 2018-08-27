---
title: getyear() (Azure Kusto)
description: This article describes getyear() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# getyear()

Returns the year part of the `datetime` argument.

**Example**

```kusto
T
| extend year = getyear(datetime(2015-10-12))
// year == 2015
```