---
title:  Kusto ingest client library best practices
description: This article describes best practices for Kusto ingest client library.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/06/2023
---
# Kusto Ingest library best practices

This article explains the best practices for data ingestion with the [Kusto Ingest library](about-kusto-ingest.md).

## Prefer queued ingestion over direct ingestion

For production scenarios, use the queued ingest client. For more information, see [Queued ingestion](about-kusto-ingest.md#queued-ingestion) and [Direct ingestion](about-kusto-ingest.md#direct-ingestion).

## Use a single `KustoQueuedIngestClient` instance

Kusto Ingest client implementations are thread-safe and reusable. For each target cluster, use a single instance of either a queued or direct Kusto Ingest client per process. Running multiple instances can overload the cluster, causing it to become unresponsive or slow to respond to valid requests.

## Limit tracking ingest operation status

For large volume data streams, limit the use of positive notifications for ingestion requests. Excessive tracking can lead to increased ingestion latency and even complete cluster non-responsiveness. For more information, see [Operation status](kusto-ingest-client-status.md).

## Optimize for throughput

When planning your ingestion pipeline, consider the following factors as they can have significant implications ingestion throughput.

| Factor | Description |
|--|--|
| Data size | Ingestion is more efficient when done in large chunks. We recommend sending data in batches of 100 MB to 1 GB (uncompressed).|
| Data format | CSV is the fastest format to ingest. For the same volume of data, JSON may take 2x or 3x longer. For more information, see [Data formats supported for ingestion](../../../ingestion-supported-formats.md).|
| Table width | Only ingest essential data. Each column needs to be encoded and indexed, which means that wider tables may have lower the throughput. Control which fields get ingested by providing an [ingestion mapping](../../management/mappings.md).|
| Source data location | Avoid cross-region reads to speed up the ingestion. |
| Load on the cluster | When a cluster experiences a high query load, ingestion takes longer to complete. |

> [!NOTE]
> The `KustoQueuedIngestClient` class splits large data sets into chunks and aggregates them, which is especially useful when the data can't be batched prior to sending for ingestion.

## Optimize for cost

Using Kusto client libraries to ingest data into your cluster remains the cheapest and the most robust option. We urge our customers to review their ingestion methods to optimize for cost and to take advantage of the Azure Storage pricing that will make blob transactions significantly cost effective.

For cost-effective ingestion:

* Limit the number of ingested data chunks, such as files, blobs, and streams.
* Ingest large chunks of up to 1GB of uncompressed data.
* Opt for batching.
* Provide exact, uncompressed data size to avoid extra storage transactions.
* Avoid setting `FlushImmediately` to `true`.
* Avoid sending small amounts of data with `ingest-by` or `drop-by` extent tags.

> [!NOTE]
> Overusing the last two methods can disrupt data aggregation, lead to extra storage transactions, and harm ingestion and query performance.

## Related content

* [Create an app to get data using batching ingestion](../get-started/app-batch-ingestion.md)
