---
title: 'Azure Data Explorer Kusto EngineV3 (preview)'
description: 'Learn more about Azure Data Explorer (Kusto) EngineV3'
author: orspod
ms.author: orspodek
ms.reviewer: avnera
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/11/2020
---
# EngineV3 - preview

Kusto EngineV3 is Azure Data Explorer’s next generation storage and query engine. It's designed to provide unparalleled performance for ingesting and querying telemetry, logs, and time series data.

EngineV3 includes a new optimized storage format and indexes. EngineV3 uses advanced data statistics query optimizations to create an optimal query plan and just-in-time compiled query execution. EngineV3 also has improved disk cache resulting in query performance with an order of magnitude improvement over the current engine (EngineV2). EngineV3 lays the foundation for the next wave of innovations of the Azure Data Explorer service.

Azure Data Explorer cluster running in EngineV3 mode is fully compatible with the EngineV2, so data migration isn't required.

> [!IMPORTANT]
> EngineV3 will be available in the following stages:
>
> 1. Public Preview (current status): Users can create new clusters in EngineV3 mode. During the public preview period, clusters aren't under SLA and aren't charged for the Azure Data Explorer markup. Infrastructure costs are charged as usual.
> 1. General Availability (GA): All new clusters are created in EngineV3 mode by default. SLA applies to all EngineV3 and EngineV2 production clusters.
> 1. Post GA: Existing workloads running on EngineV2 are migrated to EngineV3. Azure Data Explorer markup charge will be resumed.

## How EngineV3 works

EngineV3 is an additional column store storage engine running in parallel with the existing column store (EngineV2) and row store (used for streaming ingestion). Tables can incorporate data from all three stores at once, and this “federation” of data is transparent from the user perspective.

:::image type="content" source="media\engine-v3\engine-v3-architecture.png" alt-text="Schematic representation of Azure Data Explorer/Kusto EngineV3 architecture":::

All data ingested into tables is partitioned into shards, which are horizontal slices of the table. Each shard usually contains a few million records and is encoded and indexed independently of other shards. This functionality allows the engine to achieve linear scale in ingestion throughput.

Shards are spread evenly across the cluster nodes, where they're cached both on the local SSD and in memory. The query planner and the query engine prepare and execute a highly distributed and parallel query that benefits from this shard distribution and caching.

EngineV3 focuses on optimizing this "bottom part" of the distributed query.

## Performance

The improved performance and increased speed of queries comes from the two major changes in the engine:

* New and improved shard storage format.
* Redesign of the low-level shard query engine.

The performance impact of EngineV3 depends on the dataset, query patterns, concurrency, and VM SKUs used. In performance testing, a 100-TB dataset was used and different scenarios that involve analytics over structured, unstructured, and semi-structured data were explored. With the same level of concurrency and using the same hardware configuration, the performance improvement was, on average, ~8X. Actual performance improvement varies based on the query and dataset.

## Create an EngineV3 cluster

To [create a new cluster](create-cluster-database-portal.md) with EngineV3, in the **Basics** tab of the cluster creation screen, select the **Use Engine V3 preview** checkbox:

:::image type="content" source="media/engine-v3/create-new-cluster-v3.png" alt-text="Screenshot of checkbox for Use Engine V3 preview while creating a cluster":::

## Next steps

[Ingest data with Azure Data Explorer](ingest-data-overview.md)
