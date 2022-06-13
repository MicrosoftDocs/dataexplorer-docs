---
title: Kusto IngestionBatching policy optimizes batching in Azure Data Explorer
description: This article describes IngestionBatching policy in Azure Data Explorer
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/07/2021
---
# IngestionBatching policy

## Overview

During the ingestion process, the service optimizes for throughput by batching small ingress data chunks together before ingestion. Batching reduces the resources consumed by the ingestion process and doesn't require post-ingestion resources to optimize the small data shards produced by non-batched ingestion.

The downside to doing batching before ingestion is the forced delay. Therefore, the end-to-end time from requesting the data ingestion until the data ready for query is larger.

When you define the [`IngestionBatching`](./show-table-ingestion-batching-policy.md) policy, you will need to find a balance between optimizing for throughput and time delay. This policy applies to queued ingestion. It defines the maximum forced delay allowed when batching small blobs together. To learn more about using batching policy commands, and optimizing for throughput, see:

* [Ingestion batching policy command reference](./show-table-ingestion-batching-policy.md)
* [Ingestion best practices - optimizing for throughput](../api/netfx/kusto-ingest-best-practices.md#optimizing-for-throughput)

[!INCLUDE [batching policy permissions](../../includes/batching-policy-permissions.md)]


## Sealing a batch

When ingesting data in bulk, there's an optimal size of about 1 GB of uncompressed data. Ingestion of blobs with much less data is sub-optimal, so in queued ingestion the service will batch small blobs together. 

The following list shows the basic batching policy triggers to seal a batch. A batch is sealed and ingested when the first condition is met:

* `Size`: Batch size limit reached or exceeded
* `Count`: Batch file number limit reached
* `Time`: Batching time has expired

The `IngestionBatching` policy can be set on databases or tables. Default values are as follows: **5 minutes** maximum delay time, **1000** items, total size of **1 GB**.

> [!IMPORTANT]
> The impact of setting this policy to very small values is
> an increase in the COGS (cost of goods sold) of the cluster and reduced performance. Additionally,
> reducing batching policy values might actually result in **increased** effective
> end-to-end ingestion latency, due to the overhead of managing multiple ingestion
> processes in parallel.

The following list shows conditions to seal batches related to single blob ingestion. A batch is sealed and ingested when the conditions are met:

* `SingleBlob_FlushImmediately`: Ingest a single blob because ['FlushImmediately'](../api/netfx/kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) was set
* `SingleBlob_IngestIfNotExists`: Ingest a single blob because 
['IngestIfNotExists'](../../ingestion-properties.md#ingestion-properties) was set
* `SingleBlob_IngestByTag`: Ingest a single blob because ['ingest-by'](extents-overview.md#ingest-by-extent-tags) was set
* `SingleBlob_SizeUnknown`: Ingest a single blob because blob size is unknown

If the `SystemFlush` condition is set, a batch will be sealed when a system flush is triggered. With the `SystemFlush` parameter set, the system flushes the data, for example due to cluster scaling or internal reset of system components.

## Defaults and limits

| Type             | Property                | Default    | Minimum    |
|------------------|-------------------------|------------|------------|
| Number of items  | MaximumNumberOfItems    | 500        | 1          |
| Data size (MB)   | MaximumRawDataSizeMB    | 1024       | 100        |
| Time             | MaximumBatchingTimeSpan | 5 minutes  | 10 seconds |

## Batch data size

The batching policy data size is set for uncompressed data. For Parquet, AVRO, and ORC files, an estimation is calculated based on file size. When ingesting compressed data, the uncompressed data size is evaluated as follows in descending order of accuracy:
          -
1. If the uncompressed size is provided in the ingestion source options, that value is used.
1. When ingesting local files using SDKs, zip archives and gzip streams are inspected to assess their raw size. 
1. If previous options do not provide a data size, a factor is applied to the compressed data size to estimate the uncompressed data size. 

## Batching latencies

Latencies can result from a number of causes that can be addressed using batching policy settings. 

| Cause | Solution |
| --- | --- |
| Data latency matches the `time` setting, with too little data to reach the `size` or `count` limit | Reduce the `time` limit |
| Inefficient batching due to a large number of very small files | Increase the size of the source files. If using Kafka Sink, configure it to send data in ~100KB chunks or higher. If you have many small files, increase the `count` (up to 2000) in the database or table ingestion policy. |
| Batching a large amount of uncompressed data | This is common when ingesting Parquet files. Incrementally decrease `size` for the table or database batching policy towards 250MB and check for improvement. |
| Backlog because the cluster is under scaled | Accept any Azure advisor suggestions to scale aside or scale up your cluster. Alternatively, manually scale your cluster to see if the backlog is closed. If these options do not work, contact Azure Data Explorer support for assistance. |
