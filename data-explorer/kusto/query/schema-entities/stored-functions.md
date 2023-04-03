---
title: Stored functions - Azure Data Explorer
description: This article describes Stored functions in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/03/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Stored functions

**Functions** are reusable queries or query parts. Functions can be stored as database
entities (similar to, for example, tables) called **stored functions**. Functions can
also be created in an ad-hoc fashion inside queries using a [let statement](../letstatement.md)
through a mechanism called **lambda expressions**.

For more information on function invocation syntax and rules, see [user-defined functions](../functions/user-defined-functions.md).
For more information on how to create and manage stored functions, see [managing functions](../../management/functions.md).

::: zone pivot="azuremonitor"

For more information on working with functions in Log Analytics, see [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions).

::: zone-end
