---
title: Engine overview - Azure Data Explorer 
description: 'Learn more about Azure Data Explorer (Kusto) Engine.'
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 08/17/2023
---
# Azure Data Explorer engine overview

The Azure Data Explorer engine provides unparalleled performance for ingesting and querying telemetry, logs, and time series data. It features optimized storage formats, indexes, and uses advanced data statistics for efficient query planning and just-in-time compiled query execution.

Kusto EngineV3 is Azure Data Explorer’s performance update next generation storage and query engine. It's designed to provide unparalleled performance for ingesting and querying telemetry, logs, and timeseries data.

EngineV3 includes a new optimized storage format and indexes and uses advanced data statistics query optimizations to create an optimal query plan and just-in-time compiled query execution. EngineV3 also has improved disk cache resulting in query performance with an order of magnitude improvement over the current engine (EngineV2). EngineV3 lays the foundation for the next wave of innovations of the Azure Data Explorer service.

Azure Data Explorer cluster running in EngineV3 mode is fully compatible with the EngineV2, so data migration isn't required.

> [!IMPORTANT]
> In General Availability (GA), new clusters are created in EngineV3 mode by default. SLA applies to all EngineV3 and EngineV2 production clusters. To migrate EngineV2 clusters, please [create a support ticket](https://ms.portal.azure.com/#create/Microsoft.Support). The migration process itself requires minimal downtime of less than a minute and does not have material impact on ingestion and query performance.     

## How EngineV3 works

EngineV3 is an additional column store storage engine running in parallel with the existing column store (EngineV2) and row store (used for streaming ingestion). Tables can incorporate data from all three stores at once, and this “federation” of data is transparent from the user perspective.

:::image type="content" source="media/engine-v3/engine-v3-architecture.png" alt-text="Schematic representation of Azure Data Explorer/Kusto EngineV3 architecture.":::

All data ingested into tables is partitioned into shards, which are horizontal slices of the table. Each shard usually contains a few million records and is encoded and indexed independently of other shards. This functionality allows the engine to achieve linear scale in ingestion throughput.

Shards are spread evenly across the cluster nodes, where they're cached both on the local SSD and in memory. The query planner and the query engine prepare and execute a highly distributed and parallel query that benefits from this shard distribution and caching.

EngineV3 focuses on optimizing this "bottom part" of the distributed query.
  
## Performance

The improved performance and increased speed of queries comes from the two major changes in the engine:

* **New and improved shard storage format.** Similar to EngineV2, the storage format is a compressed column store with special attention to unstructured (text) and semi-structured data types. EngineV3 improves the encoding of these different data types. Indexes have been redesigned to increase their granularity, allowing evaluation of parts of the query based on the index without scanning the data.
* **Redesign of the low-level shard query engine.** The new shard query is just-in-time compiled into highly efficient machine code, resulting in a fast and efficient fused query evaluation logic. Query compilation is guided by the data statistics gathered from all the shards, and tailored to the specifics of the column encoding.

The performance impact of EngineV3 depends on the dataset, query patterns, concurrency, and VM SKUs used. In performance testing, a 100-TB dataset was used and different scenarios that involve analytics over structured, unstructured, and semi-structured data were explored. With the same level of concurrency and using the same hardware configuration, the performance improvement was, on average, ~8X. Actual performance improvement varies based on the query and dataset.

## Next steps

[Ingest data with Azure Data Explorer](ingest-data-overview.md)
