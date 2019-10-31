---
title: Streaming ingestion (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/31/2019
---
# Streaming ingestion (Preview)

Streaming ingestion is targeted for scenarios that require low latency with an ingestion time of less than 10 seconds for varied volume data. It's used for optimization of operational processing of many tables, in one or more databases where the stream of data into each table is relatively small (few records per second) but overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 1 MB per second per table. 
 
Read [Data ingestion overview](https://docs.microsoft.com/azure/data-explorer/ingest-data-overview) to learn more about the various methods of ingestion. 


## Enabling streaming ingestion on your cluster

You can enable streaming ingestion on your own cluster.

> [!WARNING]
> Please review [unsupported features](#unsupported-features) prior to enabling steaming ingestion.

[How-to - Streaming ingestion](https://docs.microsoft.com/azure/data-explorer/ingest-data-streaming)



## Unsupported features

Streaming ingestion doesn't currently support or supports partially the following features:

* [Database cursors](../databasecursor.md).

* Follower mode (if data is ingested to the leader cluster in streaming ingestion, expect a data lag of up to 24 hours when querying the follower).
* [Data mapping](../../management/mappings.md). Only [pre-created](../../management/tables.md#create-ingestion-mapping) data mappings are supported. 
* [Update policy](../../concepts/updatepolicy.md). Queries to be used in streaming ingestion update policicies are allowed to work only on the newly created datathat work. 

## Limitations

* Streaming ingestion performance and capacity scales with increased VM and cluster sizes. Concurrent ingestions are limited to 6 ingestions per core. For example, for 16 core SKUs, such as D14 and L16, the maximal supported load is 96 concurrent ingestions. For 2 core SKUs, such as D11, the maximal supported load is 12 concurrent ingestions.
* The data size limitation per ingestion request is 4MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to 5 minutes for the streaming ingestion service.
* Enabling streaming ingestion on a cluster allocates part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for the hot cache
(even if no data is actually ingested via streaming).

 