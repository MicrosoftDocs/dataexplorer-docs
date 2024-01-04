---
title: Runaway queries - Azure Data Explorer
description: This article describes Runaway queries in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/23/2018
---
# Runaway queries

A *runaway query* is a kind of [partial query failure](partialqueryfailures.md)
that happens when some internal [query limit](querylimits.md) was exceeded
during query execution. 

For example, the following error may be reported:
`HashJoin operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete.`

There are several possible courses of action.
* Change the query to consume fewer resources. For example, if the error indicates
  that the query result set is too large, you can:
  * Limit the number of records returned by the query by
     * Using the [take operator](../query/take-operator.md)
     * Adding additional [where clauses](../query/where-operator.md)
  * Reduce the number of columns returned by the query by
     * Using the [project operator](../query/project-operator.md)
     * Using the [project-away operator](../query/project-away-operator.md)
     * Using the [project-keep operator](../query/project-keep-operator.md)
  * Use the [summarize operator](../query/summarize-operator.md) to get aggregated data.
* Increase the relevant query limit temporarily for that query. For more information, see [query limits - limit on memory per iterator](querylimits.md). This method, however, isn't recommended. The limits exist to protect the cluster and to make sure that a single query doesn't disrupt concurrent queries running on the cluster.
