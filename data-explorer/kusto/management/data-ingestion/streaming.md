---
title: Streaming ingestion (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/30/2019
---
# Streaming ingestion (Preview)

Streaming ingestion is targeted for scenarios in which you have a large number of tables (in one or more databases), and the stream of data into each one is relatively small (few records per sec) but  overall data ingestion volume is high (thousands of records per second).

The classic (bulk) ingestion is advised when the amount of data grows to more than 1MB/sec. Read [Data ingestion overview](/azure/data-explorer/ingest-data-overview) for an overview of the various methods of ingestion.

## Enabling streaming ingestion on your cluster

You can enable streaming ingestion on your own cluster.

> [!WARNING]
> Please review [unsupported features](#unsupported-features) prior to enabling steaming ingestion.

 
Please open [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) to enable streaming ingestion on an existing cluster|

Once the cluster is ready, [streaming ingestion policy](../../concepts/streamingingestionpolicy.md) must be defined on table(s) or database(s) that will receive streaming data. If the policy is defined at the database level, all tables in the database are enabled for streaming ingestion.

Two ingestion methods are supported:

* **Event Hub** 
    * Follow the instructions here to establish Event Hub as a data source. 
    * In the support ticket, specify the Event Hub that you want to enable for streaming ingestion.
    * Data delay is longer.
    * Many aspects of the data ingestion are handled by Azure Data Explorer Data Management service.

* **Custom ingestion**
    * Write an application that uses one of Azure Data Explorer client libraries. Please see StreamingIngestionSample in [Kusto Code Samples](../../code/codesamples.md) for a simple application.
    *Achieves the shortest delay between initiating the ingestion and the data being available for query. 
    * Incurs the most development overhead since the application doing custom ingestion must handle errors, ensure data consistency, and more.

## Unsupported features

Streaming ingestion doesn't currently support the following features:

* [Database cursors](../databasecursor.md).
* [Follower mode](../../concepts/followercluster.md) (if data is ingested to the leader cluster in streaming ingestion, expect a data lag of up to 24 hours when querying the follower).
* [Data mapping](../../management/mappings.md) - only [pre-created](../../management/tables.md#create-ingestion-mapping) data mappings are supported. 

## Limitations

* The data size limitation per ingestion request is 4MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to 5 minutes for the streaming ingestion service.
* Enabling streaming ingestion on a cluster allocates part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for the hot cache
(even if no data is actually ingested via streaming).