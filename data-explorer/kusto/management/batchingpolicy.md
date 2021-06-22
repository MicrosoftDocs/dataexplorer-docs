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

During the ingestion process, Kusto attempts to optimize for throughput by batching small
ingress data chunks together as they await ingestion.
This sort of batching reduces the resources consumed by the ingestion
process, and doesn't require post-ingestion resources to optimize the
small data shards produced by non-batched ingestion.

There is a downside, however, to doing batching before ingestion, which is
the introduction of a forced delay, so that the end-to-end time from requesting
the ingestion of data until it's ready for query is larger.

To allow control of this trade-off, one may use the [`IngestionBatching`](batching-policy.md) policy.
This policy gets applied to queued ingestion only, and provides the maximum
forced delay to allow when batching small blobs together.

## Details

As explained above, there's an optimal size of data to be ingested in bulk.
Currently that size is about 1 GB of uncompressed data. Ingestion that is done
in blobs that hold much less data than the optimal size is non-optimal, and
so in queued ingestion Kusto will batch such small blobs together.

Batches are sealed when the first condition is met:

1. The total size of the batched data reaches the optimal size
1. The maximum delay time is reached
1. The number of blobs set by the `IngestionBatching` policy is reached

The `IngestionBatching` policy can be set on databases, or tables. Default values are as follows: **5 minutes** maximum delay time, **1000** items, total size of **1G**.

> [!WARNING]
> The impact of setting this policy to very small values is
> an increase in the COGS (cost of goods sold) of the cluster and reduced performance. Additionally,
> reducing batching policy values might actually result in **increased** effective
> end-to-end ingestion latency, due to the overhead of managing multiple ingestion
> processes in parallel.

## Batching types

The following lists show all possible types of triggers to batch sealing. The batch is sealed and ingested when the first condition is met.

### Defined by the batching policy

* Size: Batch size limit defined by the batching policy reached
* Count: Batch files number limit defined by the batching policy reached
* Time: Batching time defined by the batching policy has expired

### Single blob ingestion

* SingleBlob_FlushImmediately: Single blob ingestion because ['FlushImmediately'](../api/netfx/kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) was set
* SingleBlob_IngestIfNotExists: Single blob ingestion because ['IngestIfNotExists'](../../ingestion-properties.md#ingestion-properties) was set
* SingleBlob_IngestByTag: Single blob ingestion because ['ingest-by'](extents-overview.md#ingest-by-extent-tags) tag was set
* SingleBlob_SizeUnknown: Single blob ingestion because blob size is unknown

### Other

* SystemFlush: System had to flush the data, for example due to cluster scaling or internal reset of system components

## Other resources

* [IngestionBatching policy commands reference](../management/batching-policy.md)
* [Ingestion best practices - optimizing for throughput](../api/netfx/kusto-ingest-best-practices.md#optimizing-for-throughput)
