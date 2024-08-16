---
title:  Runaway queries
description:  This article describes Runaway queries.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---
# Runaway queries

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A *runaway query* is a kind of [partial query failure](partial-query-failures.md) that happens when some internal [query limit](query-limits.md) was exceeded during query execution.

For example, the following error may be reported:
`HashJoin operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete.`

There are several possible courses of action.

* Change the query to consume fewer resources. For example, if the error indicates that the query result set is too large, you can:
  * Limit the number of records returned by the query by
     * Using the [take operator](../query/take-operator.md)
     * Adding additional [where clauses](../query/where-operator.md)
  * Reduce the number of columns returned by the query by
     * Using the [project operator](../query/project-operator.md)
     * Using the [project-away operator](../query/project-away-operator.md)
     * Using the [project-keep operator](../query/project-keep-operator.md)
  * Use the [summarize operator](../query/summarize-operator.md) to get aggregated data.
:::moniker range="azure-data-explorer"
* Increase the relevant query limit temporarily for that query. For more information, see [query limits - limit on memory per iterator](query-limits.md). This method, however, isn't recommended. The limits exist to protect the cluster and to make sure that a single query doesn't disrupt concurrent queries running on the cluster.
::: moniker-end
:::moniker range="microsoft-fabric"
* Increase the relevant query limit temporarily for that query. For more information, see [query limits - limit on memory per iterator](query-limits.md). This method, however, isn't recommended. The limits exist to protect the Eventhouse and to make sure that a single query doesn't disrupt concurrent queries running on the Eventhouse.
::: moniker-end
