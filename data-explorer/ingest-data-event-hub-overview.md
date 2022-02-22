---
title: Ingest from Azure Event Hubs - Azure Data Explorer
description: This article describes how to ingest data from Azure Event Hubs into Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/22/2022
---
# Azure Event Hubs data connection

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. Azure Data Explorer offers continuous ingestion from customer-managed Event Hubs.

The Event Hubs ingestion pipeline transfers events to Azure Data Explorer in several steps. You first create an event hub in the Azure portal. You then create a target table in Azure Data Explorer into which the [data in a particular format](#data-format), will be ingested using the given [ingestion properties](#ingestion-properties). The Event Hubs connection needs to know [events routing](#events-routing). Data may be embedded with selected properties according to the [event system properties](#event-system-properties). [Create a connection](#event-hubs-connection) to event hub to [create an event hub](#create-an-event-hub) and [send events](#send-events). This process can be managed through the [Azure portal](ingest-data-event-hub.md), programmatically with [C#](data-connection-event-hub-csharp.md) or [Python](data-connection-event-hub-python.md), or with the [Azure Resource Manager template](data-connection-event-hub-resource-manager.md).

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

## Data format

* Data is read from the event hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects.
* See [supported formats](ingestion-supported-formats.md).
    > [!NOTE]
    > Event Hubs doesn't support the `.raw` format.

* Data can be compressed using the `GZip` compression algorithm. You can specify `Compression` dynamically using [ingestion properties](#ingestion-properties), or in the static Data Connection settings.
    > [!NOTE]
    > Data compression isn't supported for compressed formats (Avro, Parquet, ORC, ApacheAvro and W3CLOGFILE).
    > Custom encoding and embedded [system properties](#event-system-properties) aren't supported on compressed data.

## Event Hubs properties

Azure Data Explorer supports the following Event Hubs properties:

* A closed set of [ingestion properties](#ingestion-properties), which helps to route the event to the relevant table.
* A closed set of [event system properties](#event-system-properties), which can be embed in the data based on a given mapping.

> [!NOTE]
> Ingesting Event Hubs [custom properties](/azure/event-hubs/add-custom-data-event), used to associate metadata with events, isn't supported. If you need to ingest custom properties, send them in the body of the event data. For more information, see [Ingest custom properties](#ingest-custom-properties).

## Ingestion properties

Ingestion properties instruct the ingestion process, where to route the data, and how to process it. You can specify [ingestion properties](ingestion-properties.md) of the events ingestion using the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| IngestionMappingReference | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| Compression | Data compression, `None` (default), or `GZip` compression.|
| Encoding | Data encoding, the default is UTF8. Can be any of [.NET supported encodings](/dotnet/api/system.text.encoding#remarks). |
| Tags | A list of [tags](kusto/management/extents-overview.md#extent-tagging) to associate with the ingested data, formatted as an 
array string. There are [performance implications](kusto/management/extents-overview.md#ingest-by-extent-tags) when using tags. |

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Events routing

When you set up an event hub connection to Azure Data Explorer cluster, you specify target table properties (table name, data format, compression, and mapping). The default routing for your data is also referred to as `static routing`.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

In the following example, set event hub details and send weather metric data to table `WeatherMetrics`.
Data is in `json` format. `mapping1` is pre-defined on the table `WeatherMetrics`.

```csharp
var eventHubNamespaceConnectionString=<connection_string>;
var eventHubName=<event_hub>;

// Create the data
var metric = new Metric { Timestamp = DateTime.UtcNow, MetricName = "Temperature", Value = 32 }; 
var data = JsonConvert.SerializeObject(metric);

// Create the event and add optional "dynamic routing" properties
var eventData = new EventData(Encoding.UTF8.GetBytes(data));
eventData.Properties.Add("Table", "WeatherMetrics");
eventData.Properties.Add("Format", "json");
eventData.Properties.Add("IngestionMappingReference", "mapping1");
eventData.Properties.Add("Tags", "['mydatatag']");

// Send events
var eventHubClient = EventHubClient.CreateFromConnectionString(eventHubNamespaceConnectionString, eventHubName);
eventHubClient.Send(eventData);
eventHubClient.Close();
```

## Event system properties

System properties store properties that are set by the Event Hubs service, at the time the event is enqueued. 
The Azure Data Explorer Event connection to the event hub can embed a selected set of system properties into the data ingested into a table based on a given mapping.

[!INCLUDE [event-hub-system-mapping](includes/event-hub-system-mapping.md)]

Event Hubs exposes the following system properties:

|Property |Data Type |Description|
|---|---|---|
| x-opt-enqueued-time |datetime | UTC time when the event was enqueued |
| x-opt-sequence-number |long | The logical sequence number of the event within the partition stream of the event hub
| x-opt-offset |string | The offset of the event from the event hub partition stream. The offset identifier is unique within a partition of the event hub stream |
| x-opt-publisher |string | The publisher name, if the message was sent to a publisher endpoint |
| x-opt-partition-key |string |The partition key of the corresponding partition that stored the event |

When you work with [IoT Central](https://azure.microsoft.com/services/iot-central/) event hubs, you can also embed IoT Hub system properties in the payload. For the complete list, see [IoT Hub system properties](ingest-data-iot-hub-overview.md#event-system-properties-mapping).

If you selected **Event system properties** in the **Data Source** section of the table, you must include the properties in the table schema and mapping.

[!INCLUDE [data-explorer-container-system-properties](includes/data-explorer-container-system-properties.md)]

## Ingest custom properties

When ingesting events from Event Hubs, data is taken from the `body` section of the event data object. However, Event Hubs [custom properties](/azure/event-hubs/add-custom-data-event) are defined in the `properties` section of the object and are not ingested. To ingest customer properties, you must embed them into the data in `body` section of the object.

The following example compares the events data object containing custom property `customProperty` as *defined* by Event Hubs (left) to the *embeded* property required for ingestion (right).

:::row:::
   :::column span="":::
      ```json
        {
          "body":{
            "value": 42
          },
          "properties":{
            "customProperty": "123456789"
          }
        }
        ```
   :::column-end:::
   :::column span="":::
      ```json
        {
          "body":{
            "value": 42,
            "customProperty": "123456789"
          }
        }
        ```
   :::column-end:::
:::row-end:::

You can use one of the following methods to embed custom properties into the data in `body` section of the event data object:

* In Event Hubs, when creating the event data object, embed the custom properties as part of the data in the `body` section of the object.
* Use Azure Stream Analytics to [process events from the event hub and embed the custom properties](/azure/event-hubs/process-data-azure-stream-analytics) in the event data. From Azure Stream Analytics you can ingest the data natively using the [Azure Data Explorer output connector](/azure/stream-analytics/azure-database-explorer-output), or route the data into another event hub and from there into your cluster.
* Use [Azure Functions](/azure/azure-functions/functions-overview) to add the custom properties and then ingest the data.

## Event Hubs connection

For best performance, create all the following resources in the same region as the cluster.

### Create an event hub

If you don't already have one, [Create an event hub](/azure/event-hubs/event-hubs-create). Connecting to event hub can be managed through the [Azure portal](ingest-data-event-hub.md), programmatically with [C#](data-connection-event-hub-csharp.md) or [Python](data-connection-event-hub-python.md), or with the [Azure Resource Manager template](data-connection-event-hub-resource-manager.md).

> [!Note]
> * The partition count isn't changeable, so you should consider long-term scale when setting partition count.
> * Consumer group *must* be unique per consumer. Create a consumer group dedicated to Azure Data Explorer connection.

### Send events

See the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an event hub.

For an example of how to generate sample data, see [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md#generate-sample-data)

### Set up Geo-disaster recovery solution

Event hub offers a [Geo-disaster recovery](/azure/event-hubs/event-hubs-geo-dr) solution. 
Azure Data Explorer doesn't support `Alias` event hub namespaces. To implement the Geo-disaster recovery in your solution, create two event hub data connections: one for the primary namespace and one for the secondary namespace. Azure Data Explorer will listen to both event hub connections.

> [!NOTE]
> It's the user's responsibility to implement a failover from the primary namespace to the secondary namespace.

## Next steps

* [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md)
* [Create an event hub data connection for Azure Data Explorer using C#](data-connection-event-hub-csharp.md)
* [Create an event hub data connection for Azure Data Explorer using Python](data-connection-event-hub-python.md)
* [Create an event hub data connection for Azure Data Explorer using Azure Resource Manager template](data-connection-event-hub-resource-manager.md)
