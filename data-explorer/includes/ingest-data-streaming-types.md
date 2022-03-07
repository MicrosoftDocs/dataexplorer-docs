---
title: include file
description: include file
ms.topic: include
ms.date: 07/13/2020
ms.reviewer: alexefro
ms.custom: include file
---
## Use streaming ingestion to ingest data into your cluster

Two streaming ingestion types are supported:

* [**Event hub**](../ingest-data-event-hub.md) or [**IoT hub**](../ingest-data-iot-hub.md), which is used as a data source.
* **Custom ingestion** requires you to write an application that uses one of the Azure Data Explorer [client libraries](../kusto/api/client-libraries.md). See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a sample application.

### Choose the appropriate streaming ingestion type

|Criterion|Event Hub|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay  |
|Development overhead | Fast and easy setup, no development overhead | High development overhead for application to handle errors and ensure data consistency |
