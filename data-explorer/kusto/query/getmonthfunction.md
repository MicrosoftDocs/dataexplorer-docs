---
title: getmonth() - Azure Data Explorer | Microsoft Docs
description: This article describes getmonth() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# getmonth()

Get the month number (1-12) from a datetime.

**Example**

```kusto
T 
| extend month = getmonth(datetime(2015-10-12))
// month == 10
```