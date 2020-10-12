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
# EngineV3 preview

Kusto EngineV3 is the next generation of Azure Data Explorer’s storage and query engine. It's designed to provide unparalleled performance for ingesting and querying telemetry, logs, and time series data.

EngineV3 includes a new optimized storage format and indexes. EngineV3 uses advanced data statistics query optimizations to create an optimal query plan, and just-in-time compiled query execution. EngineV3 also has improved disk cache, among many other improvements, resulting in query performance that can be an order of magnitude-level improvement over the current engine (EngineV2). EngineV3 lays the foundation for the next wave of innovations of the Azure Data Explorer service.

Azure Data Explorer cluster running in EngineV3 mode is fully compatible with the EngineV2, so data migration isn't required.

## Technical information

EngineV3 is an additional column store storage engine running in parallel with the existing Column Store (Column Store v2) and Row Store (used for streaming ingestion). Tables can incorporate data from all three stores at once, and this “federation” of data is transparent from the user perspective.

:::image type="content" source="media\engine-v3\engine-v3-architecture.png" alt-text="Schematic representation of Azure Data Explorer/Kusto EngineV3 architecture":::

All data ingested into tables is partitioned into shards. Shards are horizontal slices of the table, where each shard usually contains a few million records. Each shard is encoded and indexed independently of other shards, which allows the engine to achieve linear scale in ingestion throughput.

Shards are spread evenly across the cluster nodes, where they're cached both on the local SSD and in memory. The query planner and the query engine prepare and execute a highly distributed and parallel query that benefits from this shard distribution and caching.

EngineV3 focuses on optimizing this "bottom part" of the distributed query.

## Performance

The performance impact of EngineV3 depends on the dataset, query patterns, concurrency, and VM SKUs used. For internal performance testing, we have used a 100-TB dataset, and explored different scenarios that involve analytics over structured, unstructured, and semi-structured data.
With the same level of concurrency and using the same HW configuration, the performance improvement varied from 2X to 113X.

The increased speed of queries comes from the two major changes in the engine:

* New, improved shard storage format.
* Redesign of the low-level shard query engine.

## Release plan

EngineV3 will be available in the following three stages:

1. Public Preview: Users can create new clusters in EngineV3 mode.
1. General Availability (GA): All new clusters are created in EngineV3 mode by default.
1. Post GA: Existing workloads running on EngineV2 are migrated to EngineV3.

## Public preview phase

During the public preview period, users will be able to create new ADX clusters in EngineV3 mode. These clusters won't be under SLA and won't be charged for the Azure Data Explorer markup. Infrastructure costs will be charged as usual.

> [!NOTE]
> Azure Data Explorer markup charge will be applied two months after GA.

## Create an EngineV3 cluster

To create a new cluster with EngineV3, select the “Use Engine V3 preview” checkbox in the cluster creation screen:

:::image type="content" source="media/engine-v3/create-new-cluster-v3.png" alt-text="Screenshot of checkbox for Use Engine V3 preview while creating a cluster":::

To verify that the cluster is using EngineV3, run the following query:

```kusto
.show table [TABLE_NAME] extents  | summarize by Kind
```

The result should be “StorageV3”
