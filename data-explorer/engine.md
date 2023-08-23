---
title: Engine overview - Azure Data Explorer 
description: 'Learn more about the Azure Data Explorer (Kusto) engine.'
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 08/22/2023
---
# Azure Data Explorer engine overview

The Azure Data Explorer engine provides unparalleled performance for ingesting and querying telemetry, logs, and time series data. It features optimized storage formats, indexes, and uses advanced data statistics for optimized data storage, efficient query planning, and just-in-time compiled query execution.

:::image type="content" source="media/engine-v3/engine-v3-architecture.png" alt-text="Schematic representation of Azure Data Explorer/Kusto Engine architecture." lightbox="media/engine-v3/engine-v3-architecture.png":::

## Data storage

All ingested data is partitioned into *extents*, or *data shards*, which are horizontal slices of the table. Each extent is encoded and indexed independently, which allows the engine to achieve linear scale in ingestion throughput.

Extents are immutable, and their related storage artifacts are maintained until the extent is deleted. This behavior provides the following benefits:

* Multiple compute nodes can cache an extent without complex change management coordination
* Increased robustness due to the simplicity of storage artifact modifications
* Easy reversion to previous snapshots, provided that extent components remain intact

For more information, see [Extents overview](kusto/management/extents-overview.md).

> [!NOTE]
> Azure Data Explorer also retains essential metadata, such as table schemas and policy objects for data ingestion, query, and background activities. For a list of such policies, see [Policies overview](kusto/management/policies.md).

## Indexing

The Azure Data Explorer engine is designed to index free-text ([string](kusto/query/scalar-data-types/string.md)) and JSON-like ([dynamic](kusto/query/scalar-data-types/dynamic.md)) columns at line speed. The indexes maintain a level of granularity that enables evaluation of parts of the query based on the index without scanning the data. Moreover, continuous background optimization of extents through merging improves compression and indexing, ensuring efficient storage and low query latency. Once extents reach a certain size, only the indexes are merged to enhance query performance without compromising efficiency.

## Column compression

Data stored in columns is compressed using standard algorithms, such as [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) (default), [LZMA](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Markov_chain_algorithm) and [Brotli](https://en.wikipedia.org/wiki/Brotli). The engine maintains data in a compressed state, even when it’s loaded into the RAM cache, reducing the amount of memory required to store and process data. This can result in faster query performance and more efficient use of system resources.

The engine avoids vertical compression, which involves sorting data before compression, due to its high CPU cost. Instead, Azure Data Explorer customers can specify the preferred data sort order for scenarios with dominant query patterns. This trade-off prioritizes quick data availability for queries. For more information, see [Row order policy](kusto/management/roworderpolicy.md).

## Compute data caching

The Azure Data Explorer engine has a multi-hierarchy data cache system to ensure that the most relevant data is cached as closely as possible to the CPU. This system depends on the extents being immutable and consists of three tiers:

* Azure Blob Storage
* Azure Compute SSD (Managed Disks)
* Azure Compute RAM

The cache system works entirely with compressed data, which remains compressed even in RAM and is only decompressed when required for a query. This efficient use of cache resources improves query performance.

## Distributed data query

Azure Data Explorer employs distributed data query technology tailored for fast ad-hoc analytics on large unstructured data sets. This technology is accompanied by the user-friendly [Kusto Query Language (KQL)](kusto/query/index.md), designed specifically for Azure Data Explorer.

In Azure Data Explorer, queries are intended to be fast and efficient. Default query timeouts are only about four minutes in order to prioritize prompt completion. However, users have the flexibility to request extended timeouts.

The following list outlines various features of data query in Azure Data Explorer:

* During query execution, temporary data is stored in aggregated RAM, bypassing slow disk writes. This strategy applies even to data transitioning between different nodes in the cluster, optimizing resource allocation.
* Queries provide snapshot isolation by having relevant extents stamped on the query plan. Since extents are immutable, all it takes is for the query plan to reference the combination of extents.
* The query system can optimize by sending parts of a query to other clusters. This smart distribution minimizes data movement between clusters, making queries more efficient.
* The new shard query is just-in-time compiled into highly efficient machine code, resulting in a fast and efficient fused query evaluation logic. This compilation is guided by data statistics and specific column encoding, resulting in speedy and efficient query processing.

## See also

* [White paper](https://azure.microsoft.com/resources/azure-data-explorer/)
* [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
