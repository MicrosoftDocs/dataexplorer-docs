---
title: Kusto IngestionBatching policy optimizes batching - Azure Data Explorer
description: This article describes IngestionBatching policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# IngestionBatching policy

## Overview

During the ingestion process, Azure Data Explorer attempts to optimize for throughput by batching small ingress data chunks together as they await ingestion.
This sort of batching reduces the resources consumed by the ingestion process, and doesn't require post-ingestion resources to optimize the small data shards produced by non-batched ingestion.

There is a downside, however, to doing batching before ingestion, which is the introduction of a forced delay, so that the end-to-end time from requesting the ingestion of data until it's ready for query is larger.

To allow control of this trade-off, use the [`IngestionBatching`](batching-policy.md) policy.
This policy is applied to queued ingestion only, and provides the maximum forced delay to allow when batching small blobs together.

## Details

When ingesting data in bulk, there's an optimal size, which is about 1 GB of uncompressed data. Ingestion that is done in blobs that hold much less data is non-optimal, and so in queued ingestion Azure Data Explorer will batch small blobs together.

Batches are sealed when the first condition is met:

1. The total size of the batched data reaches the size set by the `IngestionBatching` policy.
1. The maximum delay time is reached
1. The number of blobs set by the `IngestionBatching` policy is reached

The `IngestionBatching` policy can be set on databases, or tables. Default values are as follows: **5 minutes** maximum delay time, **1000** items, total size of **1G**.

> [!IMPORTANT]
> The impact of setting this policy to very small values is
> an increase in the COGS (cost of goods sold) of the cluster and reduced performance. Additionally,
> reducing batching policy values might actually result in **increased** effective
> end-to-end ingestion latency, due to the overhead of managing multiple ingestion
> processes in parallel.

## Batching types

The following lists show all possible types of triggers to batch sealing. The batch is sealed and ingested when the first condition is met.

### Defined by the batching policy

* `Size`: Batch size limit defined by the batching policy reached
* `Count`: Batch files number limit defined by the batching policy reached
* `Time`: Batching time defined by the batching policy has expired

### Single blob ingestion

* `SingleBlob_FlushImmediately`: Single blob ingestion because ['FlushImmediately'](../api/netfx/kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) was set
* `SingleBlob_IngestIfNotExists`: Single blob ingestion because ['IngestIfNotExists'](../../ingestion-properties.md#ingestion-properties) was set
* `SingleBlob_IngestByTag`: Single blob ingestion because ['ingest-by'](extents-overview.md#ingest-by-extent-tags) tag was set
* `SingleBlob_SizeUnknown`: Single blob ingestion because blob size is unknown

### Other

`SystemFlush`: System had to flush the data, for example due to cluster scaling or internal reset of system components

## Batching data size

The batching policy data size is set for uncompressed data. When ingesting compressed data, the uncompressed data size if deduced as follows in descending order of accuracy:
          -
* If the uncompressed size is provided in the ingestion source options, that value is used.
* When ingesting local files using SDKs, Azure Data Explorer may inspect zip archives and gzip streams to assess their raw size.
* Lastly, if previous options do not provide a data size, a factor is applied to the compressed data size to estimate the uncompressed data size.

## Batching latencies

Latencies can result from: 

* Data latency matching the time-based ingestion policy, so not enough data is fed to the table to pass the data-size or item-count limit and trigger the batch to be ingested. Try reducing the time.
* Inefficient batching - if you ingest a large number of very small files, it could slow down ingestion and reduce performance. Try increasing the size of the source files. If you use Kusto Kafka Sink, configure it to send data to Kusto in ~100KB chunks or higher. Additionally, in the case of many small files, try increasing the number of files in each batch (up to 2000) by altering the database or table ingestion policy.  
* Batching a large amount of uncompressed data can degrade performance - Azure Data Explorer is optimized to ingest 1GB of uncompressed data in each batch. 
* Ingestion jobs with a very large uncompressed data size are common when ingesting Parquet files. Incrementally decrease the size of data ingested in the table or database batching policy towards 250MB and check for improvement.
* Ingestion backlog can occur if the cluster is under-scaled for the amount of data it takes in. Consider accepting any Azure advisor suggestions to scale aside or scale up your cluster. Alternatively, manually scale your cluster to see if the backlog is closed. If these options do not work, contact Azure Data Explorer support for assistance.

## Other resources

* [IngestionBatching policy commands reference](../management/batching-policy.md)
* [Ingestion best practices - optimizing for throughput](../api/netfx/kusto-ingest-best-practices.md#optimizing-for-throughput)
