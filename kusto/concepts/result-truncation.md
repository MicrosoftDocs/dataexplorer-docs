---
title: Kusto query result set exceeds internal limit
description: This article describes Query result set has exceeded the internal.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Query result set has exceeded the internal ... limit

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 

A *query result set has exceeded the internal ... limit* is a kind of
[partial query failure](partial-query-failures.md) that happens when the
query's result has exceeded one of two limits:

* A limit on the number of records (`record count limit`, set by default to
  500,000)
* A limit on the total amount of data (`data size limit`, set by default
to  67,108,864 (64MB))

There are several possible courses of action:

* Change the query to consume fewer resources. For example, you can:
  * Limit the number of records returned by the query using the [take operator](../query/take-operator.md) or adding additional [where clauses](../query/where-operator.md).
  * Try to reduce the number of columns returned by the query. Use the [project operator](../query/project-operator.md), the [project-away operator](../query/project-away-operator.md), or the [project-keep operator](../query/project-keep-operator.md).
  * Use the [summarize operator](../query/summarize-operator.md) to get aggregated data
* Increase the relevant query limit temporarily for that query. For more information, see **Result truncation** under [query limits](query-limits.md).

 > [!NOTE]
 > We don't recommend that you increase the query limit, since the limits exist to protect the database. The limits make sure that a single query doesn't disrupt concurrent queries running on the database.
