---
title: 'Azure Data Explorer Kusto EngineV3 Preview'
description: 'Azure Data Explorer, Kusto EngineV3 Introduction'
author: orspod
ms.author: orspodek
ms.reviewer: avnera
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/11/2020
---

# EngineV3 Preview

## Overview

Kusto EngineV3 is the next generation of Azure Data Explorer’s storage and query engine. It is designed from the ground-up to provide unparalleled performance for ingesting and querying telemetry, logs, and time series data, and represents a quantum leap of Kusto’s capabilities.

Among its many improvements, EngineV3 includes a new optimized storage format and indexes. It uses advanced data statistics query optimizations to create optimal query plan, and just-in-time compiled query execution. EngineV3 also includes an improved disk cache, and countless of other improvements, resulting in query performance that can be an order of magnitude-level improvement compared with the current engine (EngineV2). In addition to the enhanced performance, EngineV3 lays the foundation for the next wave of innovations of the Azure Data Explorer service.

Azure Data Explorer cluster running in EngineV3 mode is fully compatible with the EngineV2, thus no data migration is required.

## EngineV3: Release Plan

Azure Data Explorer will make EngineV3 available in three stages:

1. Public Preview: Users can create new clusters in EngineV3 mode.
2. General Availability (GA): All new clusters are created in EngineV3 mode by default.
3. Post GA: We will migrate existing workloads running on EngineV2 to EngineV3.

## Public Preview Phase

During the public preview period, users will be able to create new ADX clusters in EngineV3 mode. Such clusters will not be under SLA and will not be charged for the Azure Data Explorer markup. The infrastructure costs will be charged as usual.
Azure Data Explorer markup charge will be applied two months after GA.

## EngineV3: Performance

The performance impact of EngineV3 will vary depending on the dataset, query patterns, concurrency, and VM SKUs used. For our internal performance testing, we have used 100-TB dataset, and explored different scenarios that involve analytics over structured, unstructured, and semi-structured data.
With the same level of concurrency and using the same HW configuration - the performance improvement varied from 2X to 113X.

## EngineV3: Technical Information

EngineV3 is an additional column store storage engine running in parallel with the existing column store (Column Store v2) and Row Store (used for streaming ingestion). Kusto tables can incorporate data from all three stores at once, and the “federation” of data is completely transparent from the user perspective.

![Azure Data Explorer Architecture](media\engine-v3\engineV3Architecture.png)

All data ingested into tables is partitioned into shards. Shards are horizontal slices of the table, where each shard usually contains a few million records. It is encoded and indexed independently of other shards, which allows the engine to achieve linear scale in ingestion throughput.

Shards are spread evenly across the cluster nodes, where they are cached both on the local SSD and in memory. The query planner and the query engine prepare and execute a highly distributed and parallel query that benefits from this shard distribution and caching.

The new version of the engine focuses on optimizing the "bottom part" of the distributed query. The speedup of the queries comes from the two major changes in the engine:

- New, much improved shard storage format.
- Redesign of the low-level shard query engine.

## Creating EngineV3 Cluster

To create a new cluster with EngineV3, select the “Use Engine V3 preview” checkbox in the cluster creation screen:

![Create EngineV3 cluster](media\engine-v3\CreateNewClusterWithV3.png)

To verify that the cluster is using EngineV3, you can run the following query:

```kusto
.show table [TABLE_NAME] extents  | summarize by Kind
```

The result should be “StorageV3”
