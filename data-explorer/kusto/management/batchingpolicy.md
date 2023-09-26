---
title: IngestionBatching policy
description: Learn how to use the IngestionBatching policy to optimize batching for ingestion.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# IngestionBatching policy

## Overview

During the ingestion process, the service optimizes for throughput by batching small ingress data chunks together before ingestion. Batching reduces the resources consumed by the ingestion process and doesn't require post-ingestion resources to optimize the small data shards produced by non-batched ingestion.

The downside to doing batching before ingestion is the forced delay. Therefore, the end-to-end time from requesting the data ingestion until the data ready for query is larger.

When you define the [`IngestionBatching`](./show-table-ingestion-batching-policy.md) policy, you'll need to find a balance between optimizing for throughput and time delay. This policy applies to queued ingestion. It defines the maximum forced delay allowed when batching small blobs together. To learn more about using batching policy commands, and optimizing for throughput, see:

* [Ingestion batching policy command reference](./show-table-ingestion-batching-policy.md)
* [Ingestion best practices - optimizing for throughput](../api/netfx/kusto-ingest-best-practices.md#optimize-for-throughput)

## Sealing a batch

There's an optimal size of about 1 GB of uncompressed data for bulk ingestion. Ingestion of blobs with much less data is suboptimal, so in queued ingestion the service will batch small blobs together.

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

| Type             | Property                | Default | Low latency setting | Minimum value | Maximum value |
|------------------|-------------------------|---------|-------------|--------|----|
| Number of items  | MaximumNumberOfItems    | 1000    | 1000        | 1      | 25,000 |
| Data size (MB)   | MaximumRawDataSizeMB    | 1024    | 1024        | 100     | 4096 |
| Time (sec)       | MaximumBatchingTimeSpan | 300     | 20 - 30     | 10 | 1800 |

The most effective way of controlling the end-to-end latency using ingestion batching policy is to alter its time boundary at [table](./alter-table-ingestion-batching-policy.md) or [database](./alter-database-ingestion-batching-policy.md) level, according to the higher bound of latency requirements.
A database level policy affects all tables in that database that don't have the table-level policy defined, and any newly created table.

> [!IMPORTANT]
> If you set the time boundary of the Ingestion Batching policy too low on low-ingress tables, you may incur additional compute and storage work as the cluster attempts to optimize the newly created data shards. For more information about data shards, see [extents](./extents-overview.md).

## Batch data size

The batching policy data size is set for uncompressed data. For Parquet, AVRO, and ORC files, an estimation is calculated based on file size. For compressed data, the uncompressed data size is evaluated as follows in descending order of accuracy:

1. If the uncompressed size is provided in the ingestion source options, that value is used.
1. When ingesting local files using SDKs, zip archives and gzip streams are inspected to assess their raw size.
1. If previous options don't provide a data size, a factor is applied to the compressed data size to estimate the uncompressed data size.

## Batching latencies

Latencies can result from many causes that can be addressed using batching policy settings.

| Cause | Solution |
| --- | --- |
| Data latency matches the `time` setting, with too little data to reach the `size` or `count` limit | Reduce the `time` limit |
| Inefficient batching due to a large number of very small files | Increase the size of the source files. If using Kafka Sink, configure it to send data in ~100 KB chunks or higher. If you have many small files, increase the `count` (up to 2000) in the database or table ingestion policy. |
| Batching a large amount of uncompressed data | This is common when ingesting Parquet files. Incrementally decrease `size` for the table or database batching policy towards 250 MB and check for improvement. |
| Backlog because the cluster is under scaled | Accept any Azure advisor suggestions to scale aside or scale up your cluster. Alternatively, manually scale your cluster to see if the backlog is closed. If these options don't work, contact support for assistance. |
