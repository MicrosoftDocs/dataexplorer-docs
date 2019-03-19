---
title: Runaway queries - Azure Data Explorer | Microsoft Docs
description: This article describes Runaway queries in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# Runaway queries

A *runaway query* is a kind of [partial query failure](partialqueryfailures.md)
that happens when some internal [query limit](querylimits.md) was exceeded
during query execution.

For example, the following error may be reported:
`HashJoin operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete.`

There are several possible courses of action when this happens:
* Change the query to consume fewer resources. For example, if the error indicates
  that the query result set is too large, you can try to limit the number of
  records returned by the query (using the [take operator](../query/takeoperator.md)
  or by adding additional [where clauses](../query/whereoperator.md)),
  or reduce the number of columns returned by the query (using either the
  [project operator](../query/projectoperator.md)
  or the [project-away operator](../query/projectawayoperator.md)),
  or use the [summarize operator](../query/summarizeoperator.md)
  to get aggregated data, etc.
* Increase the relevant query limit temporarily for that query
  (see **Max memory per result set iterator** under [query limits](querylimits.md)).  
  Note that this is not recommended in general, as the limits exist to protect 
  the cluster specifically to make sure that a single query doesn't disrupt 
  concurrent queries running on the cluster.
  
  
  