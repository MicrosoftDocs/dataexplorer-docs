---
title:  Stored functions
description: This article describes Stored functions in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/05/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Stored functions

::: zone pivot="azuredataexplorer, azuremonitor"

Functions are reusable queries or query parts. Functions can be stored as database entities, similar to tables, called *stored functions*. Alternatively, functions can be created in an ad-hoc fashion with a [let statement](../let-statement.md), called *query-defined functions*. For more information, see [user-defined functions](../functions/user-defined-functions.md).

To create and manage stored functions, see the [Stored functions management overview](../../management/functions.md).

> [!NOTE]
> For the function to participate in `search *` and `union *` scenarios, define the stored function as a [view](../../query/schema-entities/views.md).

::: zone-end

::: zone pivot="azuremonitor"

For more information on working with functions in Log Analytics, see [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions).

::: zone-end
