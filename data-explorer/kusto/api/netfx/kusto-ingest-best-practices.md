---
title: Kusto Ingest Client Library - Best Practices - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Ingest Client Library - Best Practices in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/16/2019

---
# Kusto Ingest Client Library - Best Practices

## Choosing the right IngestClient flavor
Using [KustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) is the recommended native data ingestion mode. Here's why:
* Direct ingestion is impossible during Kusto Engine downtime (e.g. during deployment), while in the Queued ingestion mode the requests are persisted to Azure queue and the Data Management service will retry as needed.
* Data Management service is responsible to not overload the engine with ingestion requests. Overriding this control (e.g. using Direct ingestion) might severely affect engine performance, both ingestion and query.
* Data Management aggregates multiple ingestion requests to optimize the size of the initial shard (extent) to be created.
* There is a convenient way to get feedback about each ingestion - whether succeeded or not.

## Tracking ingest operation status
[Tracking ingest operation status](kusto-ingest-client-status.md#tracking-ingestion-status-kustoqueuedingestclient) is a useful feature in Kusto, however, turning it on for success reporting can be easily abused to the extent where it will cripple your service.<BR>

> [!WARNING]
> Turning on positive notifications for every ingestion request for large volume data streams should be avoided, as this puts extreme load on the underlying xStore resources, > which might lead to increased ingestion latency and even complete cluster non-responsiveness.

## Optimizing for throughput
* Ingestion works best (that is, it consumes the least resources during ingestion, produces the most COGS-optimized data shards, and results in the best-performing data artifacts) if done in large chunks. Generally, we recommend customers who ingest data with Kusto.Ingest library or directly into the engine to send data in batches of **100 MB to 1 GB (uncompressed)**
* The upper limit is important when working directly with Kusto engine to help reduce the amount of memory used by the ingestion process (when using the `KustoQueuedIngestClient` class, overly large blocks of data will be split on the client into smaller portions, and small chunks will be aggregated to certain degree, before reaching the Kusto Engine)
* The lower limit on ingested data size is also important, although less critical. Ingesting data in small batches every now and then is perfectly fine, although slightly less efficient than using large batches. `KustoQueuedIngestClient` class also solves the problem for customers who need to ingest large amounts of data and cannot batch them into large chunks before sending them to Kusto

## Factors impacting ingestion throughput
Multiple factors can affect ingestion throughput. When planning your Kusto ingestion pipeline, make sure to evaluate the following points, which can have significant implications on your COGs.
* Data format - CSV is the fastest format to ingest, JSON will typically take x2 or x3 longer for the same volume of data
* Table width - make sure you only ingest data you really need, as the wider the table, the more columns will be encoded and indexed, hence, the lower the throughput.
    You can control which fields get ingested by providing an ingestion mapping.
* Source data location - avoiding cross-region reads speeds up the ingestion
* Load on the cluster - when cluster experiences high query load, ingestions will take longer to complete, reducing throughput
* Ingestion pattern - ingestion is in its optimum when the cluster is served with batches of up to 1GB (taken care by using `KustoQueuedIngestClient`)

## Optimizing for COGS
While using Kusto client libraries in order to ingest data into Kusto remains the cheapest and the most robust option, we urge our customers to review their ingestion tactics and take into consideration the recent (Fall 2017) changes in Azure Storage pricing, that made blob transactions significantly (~x100) more expensive.
<BR>
It is important to understand that the more chunks of data (files/blobs/streams) you send to Kusto, the larger your monthly bill will get.
If you follow the following recommendations, you will be able to better control your Kusto ingestion costs:
* **Prefer ingesting larger chunks of data (up to 1GB of uncompressed data)**<br>
    Many teams attempt to achieve low latency by ingesting tens of millions of tiny chunks of data, which is extremely inefficient and very costly.<br>
    Any batching on the client side would help. 
* **Make sure you provide the Kusto.Ingest client with accurate uncompressed data size**<br>
    Not doing so may cause Kusto to perform extra storage transactions.
* **Avoid** sending data for ingestion with the `FlushImmediately` flag set to `true`, or sending small chunks with `ingest-by`/`drop-by` tags set.<br>
    Using these prevents the Kusto service from properly aggregating the data during ingestion, and causes unnecessary storage transactions following the ingestion, affecting COGS.<br>
    Moreover, using these excessively could result with degraded ingestion and/or query performance in your cluster.<br>
    