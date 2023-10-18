---
title:  Kusto Ingest library overview
description: This article describes the Kusto Ingest client library in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/18/2023
---
# Kusto Ingest library overview

The Kusto Ingest library provides a client for ingesting data into your cluster. The library supports [queued](#queued-ingestion) and [direct](#direct-ingestion) ingestion. The ingestion methods are defined by the Kusto ingest client object.

For a list of interfaces and classes, see [Kusto Ingest client reference](kusto-ingest-client-reference.md).

## Get the library

Select the tab for your preferred language.

### [C\#](#tab/csharp)

Install [Microsoft.Azure.Kusto.Ingest](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/).

### [Python](#tab/python)

Install [azure-kusto-ingest](https://pypi.org/project/azure-kusto-ingest/).

### [Node.js](#tab/nodejs)

Install [azure-kusto-ingest](https://www.npmjs.com/package/azure-kusto-ingest).

### [Java](#tab/java)

Install [kusto-ingest](https://central.sonatype.com/artifact/com.microsoft.azure.kusto/kusto-ingest/).

---

## Permissions

To ingest data into existing tables, you must have at least Database Ingestor or Table Ingestor permissions. To create a table, you must have at least Database User permissions. For more information, see [Role-based access control](../../access-control/role-based-access-control.md).

## Queued ingestion

The queued ingest client minimizes the dependencies of client code on the Azure Data Explorer ingestion service. In this mode, ingestion is accomplished by submitting an ingestion message to an Azure queue, which is subsequently processed by the Azure Data Explorer ingestion service. If any intermediate storage items are required, the ingest client generates them using the resources provided by the ingestion service.

Queued ingestion allows the ingestion requests to be persisted when the Azure Data Explorer ingestion service is unavailable, and lets the ingestion service manage the ingestion load on your cluster. This method provides a mechanism to track the progress and outcome of every ingestion request, retries the ingestion on transient failures, and improves performance by efficient and controllable aggregation on inbound data.
 
## Direct ingestion

The direct ingest client requires direct interaction with the Azure Data Explorer ingestion service. In this mode, the ingestion service doesn't moderate or manage the data. Every ingestion request is translated into a command that is executed directly on the service. When synchronous methods are used, the method completion indicates the end of the ingestion operation.

Direct ingestion has low latency and doesn't involve aggregation. However, the client code has to implement retry or error handling logic, and the client code could overwhelm the cluster with requests as it's unaware of the capacity.

> [!NOTE]
> We don't recommend the direct ingestion for production grade solutions.

## Related content

* [Data ingestion overview](../../../ingest-data-overview.md)
* [Create an app to get data using batching ingestion](../get-started/app-batch-ingestion.md)
