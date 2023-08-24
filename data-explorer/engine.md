---
title: Engine overview - Azure Data Explorer 
description: 'Learn more about the Azure Data Explorer (Kusto) engine.'
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 08/24/2023
---
# Azure Data Explorer engine overview

The Azure Data Explorer engine provides unparalleled performance for ingesting and querying telemetry, logs, and time series data. It features optimized storage formats, indexes, and uses advanced data statistics for optimized data storage, efficient query planning, and just-in-time compiled query execution.

## Data storage

The engine partitions all data ingested into tables into *extents*, or *data shards*, which are horizontal slices of the table. Each extent usually contains a few million records and is encoded and indexed independently of other extents. This functionality allows the engine to achieve linear scale in ingestion throughput.

Extents are spread evenly across the cluster nodes, where they're cached both on the local SSD and in memory. This distribution and caching enhances the ability of the engine to prepare and execute highly distributed and parallel queries.

For more information, see [Extents overview](kusto/management/extents-overview.md).

> [!NOTE]
> Azure Data Explorer also retains essential metadata such as table schemas and policy objects. For a list of policies, see [Policies overview](kusto/management/policies.md).

## Data cache

The engine has a multi-hierarchy data cache system to ensure that the most relevant data is cached as closely as possible to the CPU. The cache system depends on the immutability of extents, and works entirely with [compressed data](#column-compression). In order to improve query performance, data remains compressed even in RAM and is only decompressed when required for a query.

For more information, see [Cache policy](kusto/management/cachepolicy.md).

## Text indexing

The engine is designed to index free-text ([string](kusto/query/scalar-data-types/string.md)) and JSON-like ([dynamic](kusto/query/scalar-data-types/dynamic.md)) columns at line speed. The indexes maintain a level of granularity that enables evaluation of parts of the query based on the index without scanning the data. Moreover, continuous background optimization of extents through merging improves compression and indexing, ensuring efficient storage and low query latency. Once extents reach a certain size, only the indexes are merged to enhance query performance without compromising efficiency.

## Column compression

Data stored in columns is compressed using standard algorithms, such as [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) (default), [LZMA](https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Markov_chain_algorithm) and [Brotli](https://en.wikipedia.org/wiki/Brotli). The engine maintains data in a compressed state, reducing the amount of memory required to store and process data. This results in faster query performance and more efficient use of system resources.

The engine avoids vertical compression, which involves sorting data before compression, due to its high CPU cost. Instead, you can specify the preferred data sort order for scenarios with dominant query patterns. This trade-off prioritizes quick data availability for queries. For more information, see [Row order policy](kusto/management/roworderpolicy.md).

## Distributed data query

Azure Data Explorer uses distributed data query technology for fast ad-hoc analytics on large unstructured data sets, accompanied by the user-friendly [Kusto Query Language (KQL)](kusto/query/index.md).

The engine optimizes query performance through the following methods:

* Storing temporary data produced by the query in aggregated RAM, avoiding disk writes.
* Providing snapshot isolation by referencing relevant extents on the query plan.
* Just-in-time compiling queries into highly efficient machine code, guided by data statistics gathered from all the extents and tailored to the specifics of the column encoding.
* Prioritizing fast and efficient queries with short default timeouts. For more information, see [Set timeout limits](set-timeout-limits.md).
* Rearranging the query plan to minimize data exchange between clusters. For more information, see [Cross-cluster and cross-database queries](kusto/query/cross-cluster-or-database-queries.md).

## See also

* [White paper](https://azure.microsoft.com/resources/azure-data-explorer/)
* [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
