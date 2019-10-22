---
title: IngestionBatching policy - Azure Data Explorer | Microsoft Docs
description: This article describes IngestionBatching policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/10/2019
zone_pivot_group_filename: kusto/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# IngestionBatching policy

## Overview

During the ingestion process Kusto attempts to optimize for throughput by batching small
ingress data chunks together as they await ingestion.
This sort of batching reduces the resources consumed by the ingestion
process, as well as does not require post-ingestion resources to optimize the
small data shards produced by non-batched ingestion.

There is a downside, however, to performing batching before ingestion, which is
the introduction of a forced delay, so that the end-to-end time from requesting
the ingestion of data until it is ready for query is larger.

To allow control of this trade-off, one may use the `IngestionBatching` policy.
This policy gets applied to queued ingestion only, and provides the maximum
forced delay to allow when batching small blobs together.

## Details

As explained above, there is an optimal size of data to be ingested in bulk.
Currently that size is about 1 GB of uncompressed data. Ingestion that is done
in blobs that hold much less data than the optimal size is non-optimal, and
therefore in queued ingestion Kusto will batch such small blobs together. Batching
is done until the first condition becomes true:

1. The total size of the batched data reaches the optimal size, or
2. The maximum delay time, total size, or number of blobs allowed by 
the `IngestionBatching` policy is reached

The `IngestionBatching` policy can be set on databases, or tables. By default,
if not policy is defined, Kusto will use a default value of **5 minutes** as the
maximum delay time, **1000** items, total size of **1G** for batching.

> [!WARNING]
> It is recommended that customers who want to set this policy to first contact
> the Kusto ops team. The impact of setting this policy to a very small value is
> an increase in the COGS of the cluster and reduced performance. Additionally,
> in the limit, reducing this value might actually result in **increased** effective
> end-to-end ingestion latency, due to the overhead of managing multiple ingestion
> processes in parallel.

## Additional resources

* [IngestionBatching policy commands reference](../management/batching-policy.md)
* [Ingestion best practices - optimizing for throughput](../api/netfx/kusto-ingest-best-practices.md#optimizing-for-throughput)
