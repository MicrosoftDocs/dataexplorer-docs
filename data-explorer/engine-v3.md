---
title: Engine overview - Azure Data Explorer 
description: 'Learn more about Azure Data Explorer (Kusto) Engine.'
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 08/17/2023
---
# Azure Data Explorer engine overview

The Azure Data Explorer engine provides unparalleled performance for ingesting and querying telemetry, logs, and time series data. It features optimized storage formats, indexes, and uses advanced data statistics for efficient query planning and just-in-time compiled query execution.

The engine uses a combination of column store, text indexing, and data sharding technologies to optimize data storage and retrieval.

:::image type="content" source="media/engine-v3/engine-v3-architecture.png" alt-text="Schematic representation of Azure Data Explorer/Kusto Engine architecture.":::

## Data storage

All data ingested into tables is partitioned into shards, which are horizontal slices of the table. Each shard usually contains a few million records and is encoded and indexed independently of other shards. This functionality allows the engine to achieve linear scale in ingestion throughput.

Shards are spread evenly across the cluster nodes, where they're cached both on the local SSD and in memory. The query planner and the query engine prepare and execute a highly distributed and parallel query that benefits from this shard distribution and caching.

Engine focuses on optimizing this "bottom part" of the distributed query.

...

The fundamental storage unit is an *extent*, or *data shard*, which is a set of one or more immutable blobs stored in Azure Blob storage. The union of a table's extents holds the table's data. Extents use a proprietary format that supports memory-mapping by query processes, removing the need for data transformation before querying. It allows for efficient data management operations, including index-only merging of extents.

Extents are immutable, and all of the related storage artifacts are maintained until the extent is deleted. This behavior has the following benefits:

* Multiple compute nodes can independently cache an extent without complex coordination.
* Different compute clusters can reference the same extent.
* Storage artifact modifications are simplified, enhancing system robustness.
* Previous snapshots can be revisited as long as extent artifacts remain intact.

For more information, see [Extents overview](kusto/management/extents-overview.md).

## Metadata

Azure Data Explorer maintains metadata that describes the data, including the schema of each table, security policies, and policy objects for data ingestion, query, and background activities. For more information, see [Policies overview](kusto/management/policies.md).

Metadata follows the same principles as data storage, and resides in immutable Azure Blob storage artifacts. The only blob that isn't immutable is the "HEAD" pointer blob, which denotes the relevant storage artifacts for the latest metadata snapshot. This immutability provides all the advantages previously highlighted.

## Indexing

Indexes have been redesigned to increase their granularity, allowing evaluation of parts of the query based on the index without scanning the data.

By default, Azure Data Explorer indexes all [string](kusto/query/scalar-data-types/string.md) and [dynamic](kusto/query/scalar-data-types/dynamic.md) columns. When a column shows high cardinality, meaning the unique values approach the number of records, the engine creates an inverted term index at the shard level. This approach allows multiple compute nodes to ingest data shards in parallel. The index maintains a low granularity, recording hit/miss details per block of about 1,000 records, rather than tracking each term individually. This optimization enables efficient skipping of infrequent terms, like correlation IDs, leading to faster query performance.

The combination of low granularity and compact index size facilitates continuous background optimization of data shards. As small data shards are merged together, compression and indexing improve, ensuring efficient storage. This background merging activity keeps query latency low, especially for streaming data. Once data shards reach a certain size, only the indexes are merged, as they're small enough to enhance query performance without compromising efficiency.

## Column compression

Data stored in columns undergoes compression using standard compression algorithms. By default, the engine uses [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) to compress data, as this algorithm has an excellent performance and reasonable compression ratio. However, other compression algorithms like [LZMA](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Markov_chain_algorithm) and [Brotli](https://en.wikipedia.org/wiki/Brotli) are also supported. The engine maintains data in a compressed state, even when it's loaded into the RAM cache.

Azure Data Explorer makes an interesting trade-off by avoiding vertical compression. This optimization involves sorting data before compression, leading to better compression ratios, improved data load, and faster query times. However, Azure Data Explorer opts against this approach due to its high CPU cost, prioritizing quick data availability for queries. Instead, the service allows customers to specify the preferred data sort order for scenarios with dominant query patterns.

## Storage and compute isolation

Azure Data Explorer maintains isolation between storage and compute services. All persistent data is stored in Azure Blob Storage, and the data kept in compute can be viewed as a cache of the data in Azure Blob. This design offers several advantages:

* Independent scale-out: Compute and storage resources scale out independently. For example, during heightened CPU load due to concurrent queries, compute resources expand accordingly. Similarly, when storage transactions increase, more storage resources are incorporated without impacting compute.
* Resiliency to failures: Azure Data Explorer establishes a new compute cluster in cases of failure and redirects traffic from the old cluster without complex data migration.
* Efficient scale-up: The engine enhances compute power by introducing new clusters with higher compute capabilities, ensuring it keeps up with increasing performance needs.
* Multiple compute clusters: Azure Data Explorer supports multiple compute clusters that access the same data, facilitating diverse workloads isolation. One cluster assumes the "leader" role with write access to storage, while others act as "followers," operating in read-only mode for that specific data.
* Optimized SKU customization: By relying on durable storage through Azure Storage, equipped with suitable settings, the engine customizes compute nodes precisely to match the workload requirements. This detailed optimization maximizes performance and resource efficiency.

Azure Data Explorer relies on Azure Storage for its expertise in reliable data replication. This decision minimizes coordination efforts between service nodes, significantly simplifying the service. Essentially, only metadata writes require coordination

## Compute data caching

Azure Data Explorer makes full use of the local volatile SSD storage as a cache. In fact, the engine has a multi-hierarchy data cache system to make sure that the most relevant data is cached as closely as possible to the CPU. This system critically depends on the data shard storage artifacts being immutable, and consists of the following tiers:

* Azure Blob Storage – persistent, durable, and reliable storage
* Azure Compute SSD (or Managed Disks) – volatile storage
* Azure Compute RAM – volatile storage

This cache system works completely with compressed data. Data remains compressed even in RAM and is only decompressed when required for an actual query, efficiently utilizing the limited and costly cache resources.

## Distributed data query

The new shard query is just-in-time compiled into highly efficient machine code, resulting in a fast and efficient fused query evaluation logic. Query compilation is guided by the data statistics gathered from all the shards, and tailored to the specifics of the column encoding.

Azure Data Explorer employs distributed data query technology tailored for fast ad-hoc analytics on large unstructured data sets. This technology is accompanied by the user-friendly [Kusto Query Language (KQL)](kusto/query/index.md), designed specifically for Azure Data Explorer.

In Azure Data Explorer, queries are intended to be fast and efficient. Default query timeouts are only about four minutes in order to prioritize prompt completion. However, users have the flexibility to request extended timeouts.

The following list outlines various features of data query in Azure Data Explorer:

* In the process of query execution, any temporary data generated finds its home within the cluster's aggregated RAM, bypassing the need for disk writes. This approach applies even to data in transit between different nodes within the cluster, which optimizes resource allocation.
* The service queries provide snapshot isolation by having relevant data shards stamped on the query plan. Since data shards are immutable, all it takes is for the query plan to reference the combination of data shards. Since queries are subject to timeout, it’s sufficient to guarantee that data shards linger for one hour following a delete, during which they're no longer available for new queries.
* The engine's distributed query layer naturally supports cross-cluster queries. It's designed to rearrange query plans, sending parts of the query to another cluster as needed. This optimization reduces the amount of data that needs to move between clusters.

## See also

* [White paper](https://azure.microsoft.com/resources/azure-data-explorer/)
* [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
