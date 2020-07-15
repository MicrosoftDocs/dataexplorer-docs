---
title: include file
description: include file
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 07/13/2020
ms.author: orspodek
ms.reviewer: alexefro
ms.custom: include file
---
## Select the correct streaming ingestion type

Two streaming ingestion types are supported:

* [**Event Hub**](../ingest-data-event-hub.md) or [**IoT Hub**](../ingest-data-iot-hub.md), which is used as a data source.
* **Custom ingestion** requires you to write an application that uses one of the Azure Data Explorer [client libraries](../kusto/api/client-libraries.md). See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a sample application.


|Criterion|Event Hub|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay  |
|Development overhead | Fast and easy setup, no development overhead | High development overhead for application to handle errors and ensure data consistency |

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take a few hours.

Before disabling streaming ingestion on your Azure Data Explorer cluster, drop the [streaming ingestion policy](../kusto/management/streamingingestionpolicy.md) from all relevant tables and databases. The removal of the streaming ingestion policy triggers data rearrangement inside your Azure Data Explorer cluster. The streaming ingestion data is moved from the initial storage to permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.
