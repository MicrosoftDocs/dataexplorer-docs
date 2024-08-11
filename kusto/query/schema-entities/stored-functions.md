---
title:  Stored functions
description:  This article describes Stored functions.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Stored functions

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"

Functions are reusable queries or query parts. Functions can be stored as database entities, similar to tables, called *stored functions*. Alternatively, functions can be created in an ad-hoc fashion with a [let statement](../let-statement.md), called *query-defined functions*. For more information, see [user-defined functions](../functions/user-defined-functions.md).

To create and manage stored functions, see the [Stored functions management overview](../../management/functions.md).

> [!NOTE]
> For the function to participate in `search *` and `union *` scenarios, define the stored function as a [view](../../query/schema-entities/views.md).

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

For more information on working with functions in Log Analytics, see [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions).

::: moniker-end
