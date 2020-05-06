---
title: Kusto Ingest Client Library - Best Practices - Azure Data Explorer
description: This article describes Kusto Ingest Client Library - Best Practices in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 08/16/2019
---
# Kusto Ingest Client Library - Best Practices

## Choosing the right IngestClient flavor

Using [KustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) is the recommended native data ingestion mode. Here's why:
* Direct ingestion is impossible during engine downtime (for example during deployment). In the queued ingestion mode, the requests are persisted to the Azure queue, and the Data Management service will retry as needed.
* The Data Management service is responsible to not overload the engine with ingestion requests. Overriding this control (such as using Direct ingestion) can severely affect engine performance, both ingestion and query.
* Data Management aggregates multiple requests for ingestion, to optimize the size of the initial shard (extent) to be created.
* Getting feedback about each ingestion is easy to do.

## Tracking ingest operation status

[Tracking ingest operation status](kusto-ingest-client-status.md#tracking-ingestion-status-kustoqueuedingestclient) is a useful feature. However, turning it on for reporting success can be easily abused, to the extent that it will cripple your service.

> [!WARNING]
> Turning on positive notifications for every ingestion request for large volume data streams should be avoided, since this puts an extreme load on the underlying xStore resources. The extra load can lead to increased ingestion latency and even complete cluster non-responsiveness.

## Optimizing for throughput

* Ingestion works best if done in large chunks. It consumes the least resources, produces the most COGS-optimized data shards, and results in the best performing data artifacts. We recommend customers who ingest data with the Kusto.Ingest library or directly into the engine, to send data in batches of **100 MB to 1 GB (uncompressed)**
* The upper limit is important when working directly with the engine, to help reduce the amount of memory used by the ingestion process 

> [!NOTE]
> When using the `KustoQueuedIngestClient` class, overly large blocks of data will be split into smaller chunks, and these small chunks will be aggregated, to a certain degree, before reaching the engine.

* The lower limit on ingested data size is also important, although less critical. Ingesting data in small batches every now and then is perfectly fine, although slightly less efficient than using large batches. The `KustoQueuedIngestClient` class also solves the problem for customers who need to ingest large amounts of data and cannot batch them into large chunks before sending them to the engine.

## Factors impacting ingestion throughput

Multiple factors can affect ingestion throughput. When planning your ingestion pipeline, make sure to evaluate the following points, which can have significant implications on your COGs.

| Factor for Consideration |  Description                                                                                              |
|--------------------------|-----------------------------------------------------------------------------------------------------------|
| Data format              | CSV is the fastest format to ingest. JSON will typically take 2x or 3x longer for the same volume of data.|
| Table width              | Make sure that you only ingest data you really need. The wider the table, the more columns will need to be encoded and indexed, and hence, the lower the throughput. You can control which fields get ingested, by providing an ingestion mapping.|
| Source data location     | Avoid cross-region reads to speed up the ingestion.                                                       |
| Load on the cluster      | When a cluster experiences a high query load, ingestions will take longer to complete, reducing throughput.|
| Ingestion pattern        | Ingestion is at its optimum when the cluster is served with batches of up to 1GB (handled by using `KustoQueuedIngestClient`). |

## Optimizing for COGS

Using Kusto client libraries to ingest data into Kusto remains the cheapest and the most robust option. We urge our customers to review their ingestion methods and to take advantage of the Azure Storage pricing that make blob transactions significantly cost effective.

For better control of your Azure Data Explorer ingestion costs and to reduce your monthly bill, limit the number of ingested data chunks (files/blobs/streams).

* **Prefer ingesting larger chunks of data (up to 1GB of uncompressed data)**. 
    Many teams attempt to achieve low latency by ingesting tens of millions of tiny chunks of data, which is inefficient and costly. Any amount of batching at the client side would help. 
* **Make sure that you provide the Kusto.Ingest client with an accurate, uncompressed, data size**.
    Not doing so may cause extra storage transactions.
* **Avoid** sending data for ingestion with the `FlushImmediately` flag set to `true`, or sending small chunks with `ingest-by`/`drop-by` tags set.
    If you use these methods, they will prevent the service from properly aggregating the data during ingestion, and will cause unnecessary storage transactions following the ingestion, and thereby affect COGS. 
Moreover, using these methods excessively could result in degraded ingestion and/or query performance of your cluster.
    
