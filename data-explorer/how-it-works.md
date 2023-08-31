---
title: How Azure Data Explorer works
description: 'Learn more about how Azure Data Explorer works.'
ms.reviewer: avnera
ms.topic: conceptual
ms.date: 08/28/2023
---
# How Azure Data Explorer works

The Azure Data Explorer provides unparalleled performance for ingesting and querying telemetry, logs, and time series data. It features optimized storage formats, indexes, and uses advanced data statistics for efficient query planning and just-in-time compiled query execution.

## Storage vs. compute

Azure Data Explorer separates storage and compute resources. Persistent data most commonly resides in Azure Blob Storage, while compute resources may store temporary data or act as a cache for persistent storage.

This separation provides the following advantages:

* Independent scale out of storage and compute resources
* Effortless transition between compute clusters, enhancing resilience and scalability
* Accessibility to identical data across multiple compute clusters
* SKU optimization

For more information on SKU optimization, see [Select a SKU for your cluster](manage-cluster-choose-sku.md).

## Data storage

Azure Data Explorer partitions all ingested data into *extents*, or *data shards*, which are horizontal slices of the target table. Each extent usually contains a few million records and is encoded and indexed independently of other extents. This functionality contributes to linear scale in ingestion throughput.

Extents are spread evenly across cluster nodes, where they're cached both on the local SSD and in memory. This distribution enhances the capacity to prepare and execute highly distributed and parallel queries.

For more information on data storage, see [Extents overview](kusto/management/extents-overview.md).

> [!NOTE]
> Azure Data Explorer also retains essential metadata such as table schemas and policy objects. For a list of policies, see [Policies overview](kusto/management/policies.md).

## Data cache

Azure Data Explorer has a multi-hierarchy data cache system to ensure that the most relevant data is cached as closely as possible to the CPU. The cache system depends on the immutability of extents, and works entirely with [compressed data](#column-compression). In order to improve query performance, data remains compressed even in RAM and is only decompressed when required for a query.

For more information on caching, see [Cache policy](kusto/management/cachepolicy.md).

## Text indexing

Azure Data Explorer is designed to efficiently index free-text ([string](kusto/query/scalar-data-types/string.md)) and JSON-like ([dynamic](kusto/query/scalar-data-types/dynamic.md)) columns as data is ingested. The indexes maintain a level of granularity that enables evaluation of parts of the query based on the index without scanning the data.

Continuous background optimization of extents through merging improves compression and indexing, ensuring efficient storage and low query latency. Once extents reach a certain size, only the indexes are merged to enhance query performance without compromising efficiency.

For more information on extent and index merging, see [Merge policy](kusto/management/mergepolicy.md).

## Column compression

Azure Data Explorer maintains data in a compressed state, reducing the amount of memory required to store and process data. This behavior results in faster query performance and more efficient use of system resources.

Azure Data Explorer avoids vertical compression, which involves sorting data before compression, due to its high CPU cost. Instead, you can specify the preferred data sort order for scenarios with dominant query patterns. This trade-off prioritizes quick data availability for queries.

For more information on specifying data sort order, see [Row order policy](kusto/management/roworderpolicy.md).

## Distributed data query

Azure Data Explorer uses distributed data query technology intended for fast ad hoc analytics on large unstructured data sets. Key features of this technology include:

* Query-generated temporary data is stored in aggregated RAM
* Relevant extents are marked on a query plan, providing snapshot isolation
* Fast and efficient queries are prioritized with short [default timeouts](set-timeout-limits.md)
* Native support for [cross-cluster queries](kusto/query/cross-cluster-or-database-queries.md) that minimizes inter-cluster data exchange
* Queries are just-in-time compiled into highly efficient machine code, using data statistics from all extents and tailored to column encoding specifics

> [!NOTE]
> Azure Data Explorer is designed to work with the [Kusto Query Language (KQL)](kusto/query/index.md), custom-built for Azure Data Explorer. Additionally, [T-SQL](t-sql.md) is supported.

## Related content

* [White paper](https://azure.microsoft.com/resources/azure-data-explorer/)
* [Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
