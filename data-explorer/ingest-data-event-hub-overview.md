---
title: Ingest from event hub - Azure Data Explorer
description: This article describes how to ingest data from Azure Event Hubs into Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: how-to
ms.date: 05/08/2023
---
# Azure Event Hubs data connection

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. Azure Data Explorer offers continuous ingestion from customer-managed Event Hubs.

The Event Hubs ingestion pipeline transfers events to Azure Data Explorer in several steps. You first create an event hub in the Azure portal. You then create a target table in Azure Data Explorer into which the [data in a particular format](#data-format), will be ingested using the given [ingestion properties](#ingestion-properties). The Event Hubs connection needs to know [events routing](#events-routing). Data may be embedded with selected properties according to the [event system properties](#event-system-properties-mapping). Create a connection to Event Hubs to [create an event hub](#create-an-event-hub) and [send events](#send-events). This process can be managed through the [Azure portal](ingest-data-event-hub.md), programmatically with [C#](data-connection-event-hub-csharp.md) or [Python](data-connection-event-hub-python.md), or with the [Azure Resource Manager template](data-connection-event-hub-resource-manager.md).

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

[!INCLUDE [data-connection-auth](includes/data-connection-auth.md)]

* So that the MI can fetch data from Azure Event Hubs, it should have at least [Azure Event Hubs Data Receiver](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver).

## Data format

* Data is read from the event hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects.
* See [supported formats](ingestion-supported-formats.md).
    > [!NOTE]
    > 
    > * Ingestion from Event Hub doesn't support RAW format.
    > * [Azure Event Hub Schema Registry](/azure/event-hubs/schema-registry-overview) and schema-less Avro are not supported.

* Data can be compressed using the `GZip` compression algorithm. You can specify `Compression` dynamically using [ingestion properties](#ingestion-properties), or in the static Data Connection settings.
    > [!NOTE]
    > Data compression isn't supported for compressed formats (Avro, Parquet, ORC, ApacheAvro and W3CLOGFILE).
    > Custom encoding and embedded [system properties](#event-system-properties-mapping) aren't supported on compressed data.

## Event Hubs properties

Azure Data Explorer supports the following Event Hubs properties:

* A closed set of [ingestion properties](#ingestion-properties), which helps to route the event to the relevant table.
* A closed set of [event system properties](#event-system-properties-mapping), which can be embedded in the data based on a given mapping.

> [!NOTE]
> Ingesting Event Hubs [custom properties](/azure/event-hubs/add-custom-data-event), used to associate metadata with events, isn't supported. If you need to ingest custom properties, send them in the body of the event data. For more information, see [Ingest custom properties](#ingest-custom-properties).

## Ingestion properties

Ingestion properties instruct the ingestion process, where to route the data, and how to process it. You can specify [ingestion properties](ingestion-properties.md) of the events ingestion using the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

> [!NOTE]
> Property names are case sensitive.

|Property |Description|
|---|---|
| Database | The case-sensitive name of the target database. By default, data is ingested into the target database associated with the data connection. Use this property to override the default database and send data to a different database. To do so, you must first [set up the connection as a multi-database connection](#route-event-data-to-an-alternate-database). |
| Table | The case-sensitive name of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| IngestionMappingReference | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| Compression | Data compression, `None` (default), or `GZip` compression.|
| Encoding | Data encoding, the default is UTF8. Can be any of [.NET supported encodings](/dotnet/api/system.text.encoding#remarks). |
| Tags | A list of [tags](kusto/management/extent-tags.md) to associate with the ingested data, formatted as a JSON array string. There are [performance implications](kusto/management/extents-overview.md#ingest-by-extent-tags) when using tags. |
| RawHeaders | Indicates that event source is Kafka and ADX must use byte array deserialization to read other routing properties. Value is ignored. |

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Events routing

When you create a data connection to your cluster, you can specify the routing for where to send ingested data. The default routing is to the target table specified in the connection string that is associated with the target database. The default routing for your data is also referred to as *static routing*. You can specify an alternative routing for your data by setting the event data properties mentioned above.

### Route event data to an alternate database

Routing data to an alternate database is off by default. To send the data to a different database, you must first set the connection as a multi-database connection. You can do this in the Azure portal [Azure portal](ingest-data-event-hub.md#target-database-multi-database-data-connection), [C#](data-connection-event-hub-csharp.md#add-an-event-hubs-data-connection), [Python](data-connection-event-hub-python.md#add-an-event-hubs-data-connection), or an [ARM template](data-connection-event-hub-resource-manager.md#azure-resource-manager-template-for-adding-an-event-hubs-data-connection). The user, group, service principal, or managed identity used to allow database routing must at least have the **contributor** role and write permissions on the cluster.

To specify an alternate database, set the *Database* [ingestion property](#ingestion-properties).

> [!WARNING]
> Specifying an alternate database without setting the connection as a multi-database data connection will cause the ingestion to fail.

### Route event data to an alternate table

To specify an alternate table for each event, set the *Table*, *Format*, *Compression*, and mapping [ingestion properties](#ingestion-properties). The connection dynamically routes the ingested data as specified in the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

The following example shows you how to set the event hub details and send weather metric data to alternate database (*MetricsDB*) and table (*WeatherMetrics*).
The data is in JSON format and *mapping1* is pre-defined on table *WeatherMetrics*.

```csharp
// This sample uses Azure.Messaging.EventHubs which is a .Net Framework library.
await using var producerClient = new EventHubProducerClient("<eventHubConnectionString>");
// Create the event and add optional "dynamic routing" properties
var eventData = new EventData(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(
    new { Timestamp = DateTime.UtcNow, MetricName = "Temperature", Value = 32 }
)));
eventData.Properties.Add("Database", "MetricsDB");
eventData.Properties.Add("Table", "WeatherMetrics");
eventData.Properties.Add("Format", "json");
eventData.Properties.Add("IngestionMappingReference", "mapping1");
eventData.Properties.Add("Tags", "['myDataTag']");
var events = new[] { eventData };
// Send events
await producerClient.SendAsync(events);
```

## Event system properties mapping

System properties store properties that are set by the Event Hubs service, at the time the event is enqueued.
The data connection to the event hub can embed a selected set of system properties into the data ingested into a table based on a given mapping.

[!INCLUDE [event-hub-system-mapping](includes/event-hub-system-mapping.md)]

Event Hubs service exposes the following system properties:

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

### Schema mapping for Event Hub Capture Avro files

One way to consume Event Hub data is to [capture events through Azure Event Hubs in Azure Blob Storage or Azure Data Lake Storage](/azure/event-hubs/event-hubs-capture-overview). You can then ingest the capture files as they are written using an [Event Grid Data Connection in Azure Data Explorer](./ingest-data-event-grid-overview.md).

The schema of the capture files is different from the schema of the original event sent to Event Hub. You should design the destination table schema with this difference in mind. 
Specifically, the event payload is represented in the capture file as a byte array, and this array isn't automatically decoded by the Event Grid Azure Data Explorer data connection. For more specific information on the file schema for Event Hub Avro capture data, see [Exploring captured Avro files in Azure Event Hubs](/azure/event-hubs/explore-captured-avro-files).

To correctly decode the event payload:

1. Map the `Body` field of the captured event to a column of type `dynamic` in the destination table.
1. Apply an [update policy](./kusto/management/updatepolicy.md) that converts the byte array into a readable string using the [unicode_codepoints_to_string()](./kusto/query/unicode-codepoints-to-string-function.md) function.

## Ingest custom properties

When ingesting events from Event Hubs, data is taken from the `body` section of the event data object. However, Event Hubs [custom properties](/azure/event-hubs/add-custom-data-event) are defined in the `properties` section of the object and are not ingested. To ingest customer properties, you must embed them into the data in `body` section of the object.

The following example compares the events data object containing custom property `customProperty` as *defined* by Event Hubs (left) with the *embedded* property required for ingestion (right).

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

## Cross-region Event Hub data connection

For best performance, create all the following resources in the same region as the cluster.
If there is no other alternative, consider using [Premium](/azure/event-hubs/event-hubs-premium-overview) or [Dedicated](/azure/event-hubs/event-hubs-dedicated-overview) Event Hub tiers. Event Hub tiers comparison can be found [here](/azure/event-hubs/compare-tiers).

### Create an event hub

If you don't already have one, [Create an event hub](/azure/event-hubs/event-hubs-create). Connecting to event hub can be managed through the [Azure portal](ingest-data-event-hub.md), programmatically with [C#](data-connection-event-hub-csharp.md) or [Python](data-connection-event-hub-python.md), or with the [Azure Resource Manager template](data-connection-event-hub-resource-manager.md).

> [!Note]
>
> * The ability to dynamically add partitions after creating an event hub is only available with Event Hubs Premium and Dedicated tiers. Consider the long-term scale when setting partition count.
> * Consumer group *must* be unique per consumer. Create a consumer group dedicated to Azure Data Explorer connection.

### Send events

See the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an event hub.

For an example of how to generate sample data, see [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md#generate-sample-data)

## Set up Geo-disaster recovery solution

Event hub offers a [Geo-disaster recovery](/azure/event-hubs/event-hubs-geo-dr) solution.
Azure Data Explorer doesn't support `Alias` event hub namespaces. To implement the Geo-disaster recovery in your solution, create two event hub data connections: one for the primary namespace and one for the secondary namespace. Azure Data Explorer will listen to both event hub connections.

> [!NOTE]
> It's the user's responsibility to implement a failover from the primary namespace to the secondary namespace.

## See also

* [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md)
* [Create an event hub data connection for Azure Data Explorer using C#](data-connection-event-hub-csharp.md)
* [Create an event hub data connection for Azure Data Explorer using Python](data-connection-event-hub-python.md)
* [Create an event hub data connection for Azure Data Explorer using Azure Resource Manager template](data-connection-event-hub-resource-manager.md)
* [Manage Event Hubs data connections in your free cluster](start-for-free-event-hubs.md)
* [Ingest and query Azure Monitor logs with Azure Data Explorer](ingest-data-no-code.md?tabs=diagnostic-metrics)
