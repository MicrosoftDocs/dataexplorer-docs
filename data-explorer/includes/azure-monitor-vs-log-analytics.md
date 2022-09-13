---
title: include file
description: include file
ms.topic: include
ms.date: 09/08/2022
ms.reviewer: orhasban
ms.custom: include file
---
> [!NOTE]
> In the Azure portal, the raw metrics data for the *Metrics* and *Insights* pages are stored in Azure Monitor. The queries on these pages query the raw metrics data directly to provide the most accurate results.
> When using the diagnostics settings feature, you can migrate the raw metrics data to the Log Analytics workspace. During the migration, some data precision may be lost due to rounding; hence, query results may vary slightly from the original data. The margin for error is less than one percent.