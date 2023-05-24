---
title:  Kusto Ingest Client Library
description: This article describes the Kusto Ingest client library in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/19/2023
---
# Kusto.Ingest client library

`Microsoft.Azure.Kusto.Ingest` library is a .NET 4.7.2 library for ingesting data into your cluster.
It takes dependencies on the following libraries and SDKs:

* [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview) for Azure AD authentication
* Azure storage client

The ingestion methods are defined by the [IKustoIngestClient](kusto-ingest-client-reference.md#interface-ikustoingestclient) interface.  The methods handle data ingestion from Stream, IDataReader, local files, and Azure blobs in both synchronous and asynchronous modes.

## Ingest client flavors

There are two basic flavors of the Ingest client: Queued and Direct.

### Queued ingestion

The Queued ingestion mode, defined by [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient),  limits the client code dependency on the Kusto service. Ingestion is done by posting a Kusto ingestion message to an Azure queue, which is then acquired from the Kusto Data Management (Ingestion) service. Any intermediate storage items will be created by the ingest client using the resources from the Kusto Data Management service.

**Advantages of the queued mode include:**

* Decouples the data ingestion process from the Kusto Engine service
* Lets ingestion requests to be persisted when the Kusto Engine (or Ingestion) service is unavailable
* Improves performance by efficient and controllable aggregation of inbound data by the Ingestion service 
* Lets the Kusto Ingestion service manage the ingestion load on the Kusto Engine service
* Retries the Kusto Ingestion service, as needed, on transient ingestion failures, such as for Azure Storage throttling
* Provides a convenient mechanism to track the progress and outcome of every ingestion request

The following diagram outlines the Queued ingestion client interaction with Kusto:

:::image type="content" source="../images/about-kusto-ingest/queued-ingest.png" alt-text="Diagram showing how the Kusto.Ingest library sends queries to the Kusto service in queried ingestion mode.":::
 
### Direct ingestion

The Direct ingestion mode, defined by IKustoDirectIngestClient, forces direct interaction with the Kusto Engine service. In this mode, the Kusto Ingestion service doesn't moderate or manage the data. Every ingestion request is eventually translated into the `.ingest` command that is executed directly on the Kusto Engine service.

The following diagram outlines the Direct ingestion client interaction with Kusto:

:::image type="content" source="../images/about-kusto-ingest/direct-ingest.png" alt-text="Diagram showing how the Kusto.Ingest library sends queries to the Kusto service in direct ingestion mode.":::

> [!NOTE]
> The Direct mode isn't recommended for production grade ingestion solutions.

**Advantages of the Direct mode include:**

* Low latency and no aggregation. However, low latency can also be achieved with Queued ingestion
* When synchronous methods are used, method completion indicates the end of the ingestion operation

**Disadvantages of the Direct mode include:**

* The client code must implement any retry or error handling logic
* Ingestions are impossible when the Kusto Engine service is unavailable
* The client code might overwhelm the Kusto Engine service with ingestion requests, since it isn't aware of the Engine service capacity

## Ingestion best practices

[Ingestion best practices](kusto-ingest-best-practices.md) provides COGS (cost of goods sold) and throughput POV on ingestion.

* **Thread safety -**
Kusto Ingest Client implementations are thread-safe and intended to be reused. There's no need to create an instance of `KustoQueuedIngestClient` class for each or several ingest operations. A single instance of `KustoQueuedIngestClient` is required per target Kusto cluster per user process. Running multiple instances is counter-productive and may cause DoS on the Data Management cluster.

* **Supported data formats -**
When using native ingestion, if not already there, upload the data to one or more Azure storage blobs. 
Currently supported blob formats are documented under [Supported Data Formats](../../../ingestion-supported-formats.md).

* **Schema mapping -**
[Schema mappings](../../management/mappings.md) help with deterministically binding source data fields to destination table columns.

* **Ingestion permissions -**
[Kusto Ingestion Permissions](kusto-ingest-client-permissions.md) explains permissions setup that is required for a successful ingestion using the `Kusto.Ingest` package.

* **Usage -**
As described previously, the recommended basis for sustainable and high-scale ingestion solutions for Kusto should be the **KustoQueuedIngestClient**.
To minimize unnecessary load on your Kusto service, we recommended that you use a single instance of Kusto Ingest client (Queued or Direct) per process, per Kusto cluster. 
Kusto ingest client implementation is thread-safe and fully reentrant.

## Next steps

* [Kusto.Ingest Client Reference](kusto-ingest-client-reference.md) contains a complete reference of Kusto ingest client interfaces and implementations. You'll find information on how to create ingestion clients, augment ingestion requests, manage ingestion progress, and more

* [Kusto.Ingest Operation Status](kusto-ingest-client-status.md) explains KustoQueuedIngestClient features for tracking ingestion status

* [Kusto.Ingest Errors](kusto-ingest-client-errors.md) describes Kusto ingest client errors and exceptions

* [Kusto.Ingest Examples](kusto-ingest-client-examples.md) shows code snippets that demonstrate various techniques of ingesting data into Kusto

* [How to ingest data with the REST API](kusto-ingest-client-rest.md) explains how to implement queued ingestion, by using REST APIs, and without being dependent on the `Kusto.Ingest` library.
