---
title: Materialized views behind the scenes - Azure Data Explorer
description: This article describes the behind the scenes of materialized views in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Materialized views: behind the scenes

A materialized view is made of 2 "parts":

1. A *materialized* part - a physical Azure Data Explorer table holding aggregated records from the source table, 
which have already been processed.  This table always holds the minimal possible number of records - a single record per the dimension's combination (as in the actual 
aggregation result).
2. A *delta* - the newly ingested records in the source table, which haven't been processed yet. 

Querying the Materialized View *combines* the materialized part with the delta part, providing an up-to-date result of the aggregation query. 

The offline materialization process ingests new records from the delta part to the materialized table and replaces 
existing records. The latter is done by rebuilding extents which hold records to replace. 
Both processes (ingestion and extents rebuild) require available ingestion capacity. Therefore, clusters in which the 
available ingestion capacity is low may not be able to materialize the view frequently enough, which will negatively 
impact the materialized view performance (queries will perform slower, as the delta part becomes bigger). 

If records in the *delta* part constantly intersect with all data shards in the *materialized* part, each materialization cycle 
will require rebuilding the entire *materialized* part, and may not keep up with the pace (the ingestion rate will be higher than the materialization
 rate). In that case, the view will become unhealthy and the *delta* part will constantly grow. You can monitor the number of extent rebuilds in each 
materialization cycle using metrics, described in the [Materialized views monitoring](materialized-view-monitoring.md) article.