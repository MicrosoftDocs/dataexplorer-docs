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

All ingested data is partitioned into *extents*, or *data shards*, which are horizontal slices of the table. Each shard is encoded and indexed independently of other extents. This functionality allows the engine to achieve linear scale in ingestion throughput. 

Extents are immutable, and their related storage artifacts are maintained until the extent is deleted. This behavior provides the following benefits:

* Multiple compute nodes can cache an extent without complex change management coordination
* Increased robustness due to the simplicity of storage artifact modifications
* Easy reversion to previous snapshots, provided that extent components remain intact

For more information, see [Extents overview](kusto/management/extents-overview.md).

> [!NOTE]
> Azure Data Explorer also retains essential metadata, such as table schemas and policy objects for data ingestion, query, and background activities. For a list of such policies, see [Policies overview](kusto/management/policies.md).

## Indexing

By default, Azure Data Explorer indexes all [string](kusto/query/scalar-data-types/string.md) and [dynamic](kusto/query/scalar-data-types/dynamic.md) columns. When a column shows high cardinality, meaning the unique values approach the number of records, the engine creates an inverted term index at the shard level. This approach allows multiple compute nodes to ingest data shards in parallel.

The index maintains a low granularity, recording hit/miss details per block of about 1,000 records, rather than tracking each term individually. This optimization enables efficient skipping of infrequent terms, like correlation IDs, leading to faster query performance. However, the index is granular enough to allow for evaluation of parts of the query based on the index without scanning the data.

The combination of low granularity and compact index size facilitates continuous background optimization of data shards. As small data shards are merged together, compression and indexing improve, ensuring efficient storage. This background merging activity keeps query latency low, especially for streaming data. Once data shards reach a certain size, only the indexes are merged, as they're small enough to enhance query performance without compromising efficiency.

## Column compression

Data stored in columns undergoes compression using standard compression algorithms. By default, the engine uses [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) to compress data, as this algorithm has an excellent performance and reasonable compression ratio. However, other compression algorithms like [LZMA](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Markov_chain_algorithm) and [Brotli](https://en.wikipedia.org/wiki/Brotli) are also supported. The engine maintains data in a compressed state, even when it's loaded into the RAM cache.

Azure Data Explorer makes an interesting trade-off by avoiding vertical compression. This optimization involves sorting data before compression, leading to better compression ratios, improved data load, and faster query times. However, Azure Data Explorer opts against this approach due to its high CPU cost, prioritizing quick data availability for queries. Instead, the service allows customers to specify the preferred data sort order for scenarios with dominant query patterns.

## Compute data caching

The engine has a multi-hierarchy data cache system to make sure that the most relevant data is cached as closely as possible to the CPU. This system critically depends on the extents being immutable, and consists of the following tiers:

* Azure Blob Storage – persistent, durable, and reliable storage
* Azure Compute SSD (or Managed Disks) – volatile storage
* Azure Compute RAM – volatile storage

This cache system works completely with compressed data. Data remains compressed even in RAM and is only decompressed when required for an actual query, efficiently utilizing the limited and costly cache resources.

## Distributed data query

Azure Data Explorer employs distributed data query technology tailored for fast ad-hoc analytics on large unstructured data sets. This technology is accompanied by the user-friendly [Kusto Query Language (KQL)](kusto/query/index.md), designed specifically for Azure Data Explorer.

In Azure Data Explorer, queries are intended to be fast and efficient. Default query timeouts are only about four minutes in order to prioritize prompt completion. However, users have the flexibility to request extended timeouts.

The following list outlines various features of data query in Azure Data Explorer:

* During query execution, temporary data is stored in aggregated RAM, bypassing slow disk writes. This strategy applies even to data transitioning between different nodes in the cluster, optimizing resource allocation.
* Queries provide snapshot isolation by having relevant extents stamped on the query plan. Since extents are immutable, all it takes is for the query plan to reference the combination of data shards.
* The query system can optimize by sending parts of a query to other clusters. This smart distribution minimizes data movement between clusters, making queries more efficient.
* The new shard query is just-in-time compiled into highly efficient machine code, resulting in a fast and efficient fused query evaluation logic. This compilation is guided by data statistics and specific column encoding, resulting in speedy and efficient query processing.

## See also

* [White paper](https://azure.microsoft.com/resources/azure-data-explorer/)
* [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
