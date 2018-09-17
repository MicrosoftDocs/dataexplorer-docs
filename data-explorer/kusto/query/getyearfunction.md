---
title: getyear() - Azure Data Explorer | Microsoft Docs
description: This article describes getyear() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
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