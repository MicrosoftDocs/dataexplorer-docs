---
title:  Kusto ingest client library best practices
description: This article describes best practices for Kusto ingest client library.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/19/2023
---
# Kusto.Ingest client library best practices

## Select the right IngestClient flavor

Use [KustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient), it's the recommended native data ingestion mode. Here's why:
* Direct ingestion is impossible during engine downtime, such as during deployment. In the queued ingestion mode, the requests are persisted to the Azure queue, and the Data Management service will retry as needed.
* The Data Management service keeps the engine from overloading with ingestion requests. Overriding this control by using Direct ingestion, for example, can severely affect engine ingestion and query performance.
* Data Management aggregates multiple requests for ingestion. The aggregation optimizes the size of the initial shard (extent) to be created.
* Getting feedback about each ingestion is easy.

## Avoid tracking ingest operation status

[Tracking ingest operation status](kusto-ingest-client-status.md#tracking-ingestion-status-kustoqueuedingestclient) is useful. However, for large volume data streams, turning on positive notifications for every ingestion request should be avoided. Such tracking puts an extreme load on the underlying xStore resources that can lead to increased ingestion latency and even complete cluster non-responsiveness.

## Optimizing for throughput

Ingestion works best if done in large chunks. 
* It consumes the least resources
* It produces the most COGS (cost of goods sold)-optimized data shards, and results in the best data transactions

We recommend customers who ingest data with the Kusto.Ingest library or directly into the engine, to send data in batches of **100 MB** to **1 GB (uncompressed)**
* The upper limit is important when working directly with the engine, to help reduce the amount of memory used by the ingestion process 

> [!NOTE]
> When using the `KustoQueuedIngestClient` class, overly large blocks of data will be split into smaller chunks, and these small chunks will be aggregated, to a certain degree, before reaching the engine.

* The lower limit on ingested data size is also important, although less critical. Ingesting data in small batches every now and then is perfectly fine, although slightly less efficient than using large batches. The `KustoQueuedIngestClient` class also solves the problem for customers who need to ingest large amounts of data and can't batch them into large chunks before sending them to the engine.

## Other factors that impact ingestion throughput

Multiple factors can affect ingestion throughput. When planning your ingestion pipeline, make sure to evaluate the following points, which can have significant implications on your COGs.

| Factor for consideration |  Description                                                                                              |
|--------------------------|-----------------------------------------------------------------------------------------------------------|
| Data format              | CSV is the fastest format to ingest. JSON will typically take 2x or 3x longer for the same volume of data.|
| Table width              | Make sure that you only ingest data you really need. The wider the table, the more columns will need to be encoded and indexed, and the lower the throughput. You can control which fields get ingested, by providing an ingestion mapping.       |
| Source data location     | Avoid cross-region reads to speed up the ingestion.                                                       |
| Load on the cluster      | When a cluster experiences a high query load, ingestions will take longer to complete, reducing throughput.|

## Optimizing for COGS

Using Kusto client libraries to ingest data into your cluster remains the cheapest and the most robust option. We urge our customers to review their ingestion methods to optimize for COGS (costs of goods sold) and to take advantage of the Azure Storage pricing that will make blob transactions significantly cost effective.

* **Limit the number of ingested data chunks**.
    For better control of your ingestion costs and to reduce your monthly bill, limit the number of ingested data chunks (files/blobs/streams).
* **Ingest large chunks of data (up to 1GB of uncompressed data)**. 
    Many teams attempt to achieve low latency by ingesting tens of millions of tiny chunks of data, which is inefficient and costly. 
* **Batching**. Any amount of batching at the client side would improve optimization. 
* **Provide the Kusto.Ingest client with an exact, uncompressed, data size**.
    Not doing so may cause extra storage transactions.
* **Avoid** sending data for ingestion with the `FlushImmediately` flag set to `true`. Also, avoid sending small chunks with `ingest-by`/`drop-by` tags set. If you use these methods, they'll:
     * prevent the service from properly aggregating the data during ingestion
     * cause unnecessary storage transactions following the ingestion
     * affect COGS 
     * likely result in degraded ingestion or query performance of your cluster, if used excessively
