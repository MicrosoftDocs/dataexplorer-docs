---
title: Streaming ingestion (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/11/2019
---
# Streaming ingestion (Preview)

Streaming ingestion is targeted for scenarios in which you have requirements for low latency with less than 10 seconds ingestion time of small or big volume data. In addition, it is targeted for optimization of operational processing when you have a large number of tables (in one or more databases), and the stream of data into each one is relatively small (few records per second) but overall data ingestion volume is high (thousands of records per second).

The classic (bulk) ingestion is advised when the amount of data grows to more than 1MB/sec per table. Read [Data ingestion overview](/azure/data-explorer/ingest-data-overview) for an overview of the various methods of ingestion.

## Enabling streaming ingestion on your cluster

You can enable streaming ingestion on your own cluster.

> [!WARNING]
> Please review [unsupported features](#unsupported-features) prior to enabling steaming ingestion.

 
Open [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) to enable streaming ingestion on an existing cluster

Once the cluster is ready, [streaming ingestion policy](../../concepts/streamingingestionpolicy.md) must be defined on table(s) or database(s) that will receive streaming data. If the policy is defined at the database level, all tables in the database are enabled for streaming ingestion.

Two ingestion methods are supported:

* **Event Hub** 
    * Establish [Event Hub as a data source](/azure/data-explorer/ingest-data-event-hub). 
    * In the support ticket, specify the Event Hub that you want to enable for streaming ingestion.
    * Data delay is longer than custom ingestion.
    * Many aspects of the data ingestion are handled by Azure Data Explorer Data Management service.

* **Custom ingestion**
    * Write an application that uses one of Azure Data Explorer client libraries. See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a simple application.
    * Achieves the shortest delay between initiating the ingestion and the data being available for query. 
    * Incurs the most development overhead since the application for custom ingestion must handle errors and ensure data consistency.

## Unsupported features

Streaming ingestion doesn't currently support the following features:

* [Database cursors](../databasecursor.md).

* [Data mapping](../../management/mappings.md). Only [pre-created](../../management/tables.md#create-ingestion-mapping) data mappings are supported. 

## Limitations

* The data size limitation per ingestion request is 4MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to 5 minutes for the streaming ingestion service.
* Enabling streaming ingestion on a cluster allocates part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for the hot cache
(even if no data is actually ingested via streaming).