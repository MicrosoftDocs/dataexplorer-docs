---
title: Ingest from Event Hub - Azure Data Explorer
description: This article describes Ingest from Event Hub in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
---
# Ingest from Event Hub

[Azure Event Hubs](https://docs.microsoft.com/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. Azure Data Explorer offers continuous ingestion from customer-managed Event Hubs.

## Data format

* Data is read from the Event Hub in form of [EventData](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata?view=azure-dotnet) objects.
* Event payload can contain one or more records that will be ingested in one of the [formats supported by Azure Data Explorer](../../../ingestion-supported-formats.md).
* Data can be compressed using `GZip` compression algorithm. Must be specified as `Compression` [ingestion property](#ingestion-properties).

> [!Note]
> * Data compression is not supported for compressed formats (Avro, Parquet, ORC).
> * Custom encoding and embedded [system properties](#event-system-properties-mapping) are not supported on compressed data.

## Ingestion properties

Ingestion properties instruct the ingestion process, where to route the data, and how to process it. You can specify [Ingestion properties](../../../ingestion-properties.md) of the events ingestion using the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| IngestionMappingReference | Name of the existing [ingestion mapping](../create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| Compression | Data compression, `None` (default), or `GZip` compression.|
| Encoding | Data encoding, the default is UTF8. Can be any of [.NET supported encodings](https://docs.microsoft.com/dotnet/api/system.text.encoding?view=netframework-4.8#remarks). |
| Tags (Preview) | A list of [tags](../extents-overview.md#extent-tagging) to associate with the ingested data, formatted as a JSON array string. There are [performance implications](../extents-overview.md#performance-notes-1) when using tags. |

<!--| Database | Name of the existing target database.|-->
<!--| Tags | String representing [tags](https://docs.microsoft.com/azure/kusto/management/extents-overview#extent-tagging) that will be attached to resulting extent. |-->

## Events routing

When you set up an Event Hub connection to Azure Data Explorer cluster, you specify target table properties (table name, data format, compression, and mapping). The default routing for your data is also referred to as `static routing`.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

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

## Event system properties mapping

System properties store properties that are set by the Event Hubs service, at the time the event is enqueued. The Azure Data Explorer Event Hub connection will embed the selected properties into the data landing in your table.

> [!Note]
> * System properties are supported for single-record events.
> * System properties are not supported on compressed data.
> * For `csv` mapping, properties are added at the beginning of the record in the order listed in the table below. For `json` mapping, properties are added according to property names in the following table.

### Event Hub exposes the following system properties

|Property |Data Type |Description|
|---|---|---|
| x-opt-enqueued-time |datetime | UTC time when the event was enqueued |
| x-opt-sequence-number |long | The logical sequence number of the event within the partition stream of the Event Hub
| x-opt-offset |string | The offset of the event from the Event Hub partition stream. The offset identifier is unique within a partition of the Event Hub stream |
| x-opt-publisher |string | The publisher name, if the message was sent to a publisher endpoint |
| x-opt-partition-key |string |The partition key of the corresponding partition that stored the event |

If you selected **Event system properties** in the **Data Source** section of the table, you must include the properties in the table schema and mapping.

**Table schema example**

Create or alter the table schema by using the table schema command, if your data includes:
* the columns `Timespan`, `Metric`, and `Value`  
* the properties `x-opt-enqueued-time` and `x-opt-offset`

```kusto
    .create-merge table TestTable (TimeStamp: datetime, Metric: string, Value: int, EventHubEnqueuedTime:datetime, EventHubOffset:long)
```

**CSV mapping example**

Run the following commands to add data to the beginning of the record.
Properties are added at the beginning of the record, in the order listed in the table above.
The ordinal values are important for CSV mapping where the column ordinals will change, based on the system properties that are mapped.

```kusto
    .create table TestTable ingestion csv mapping "CsvMapping1"
    '['
    '   { "column" : "Timespan", "Properties":{"Ordinal":"2"}},'
    '   { "column" : "Metric", "Properties":{"Ordinal":"3"}},'
    '   { "column" : "Value", "Properties":{"Ordinal":"4"}},'
    '   { "column" : "EventHubEnqueuedTime", "Properties":{"Ordinal":"0"}},'
    '   { "column" : "EventHubOffset", "Properties":{"Ordinal":"1"}}'
    ']'
```
 
**JSON-mapping example**

Add data by using the system properties names as they appear in the *Data connection* blade *Event system properties* list. 
Run:

```kusto
    .create table TestTable ingestion json mapping "JsonMapping1"
    '['
    '    { "column" : "Timespan", "Properties":{"Path":"$.timestamp"}},'
    '    { "column" : "Metric", "Properties":{"Path":"$.metric"}},'
    '    { "column" : "Value", "Properties":{"Path":"$.metric_value"}},'
    '    { "column" : "EventHubEnqueuedTime", "Properties":{"Path":"$.x-opt-enqueued-time"}},'
    '    { "column" : "EventHubOffset", "Properties":{"Path":"$.x-opt-offset"}}'
    ']'
```

## Create event hub connection

> [!Note]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Create an event hub

If you don't already have one, [Create an event hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-create). 
A template can be found in the how-to [Create an event hub](../../../ingest-data-event-hub.md#create-an-event-hub) guide.

> [!Note]
> * The partition count is not changeable, so you should consider long-term scale when setting partition count.
> * Consumer group *must* be unique per consumer. Create a consumer group dedicated to Azure Data Explorer connection.

### Data ingestion connection to Azure Data Explorer

* Via Azure portal: [Connect to the event hub](../../../ingest-data-event-hub.md#connect-to-the-event-hub).
* Use Azure Data Explorer management .NET SDK: [Add an Event Hub data connection](../../../data-connection-event-hub-csharp.md#add-an-event-hub-data-connection)
* Use Azure Data Explorer management Python SDK: [Add an Event Hub data connection](../../../data-connection-event-hub-python.md#add-an-event-hub-data-connection)
* With ARM template: Use [Azure Resource Manager template for adding an Event Hub data connection](../../../data-connection-event-hub-resource-manager.md#azure-resource-manager-template-for-adding-an-event-hub-data-connection)

> [!Note]
> If **My data includes routing info** selected, you *must* provide the necessary [routing](#events-routing) information as part of the events properties.

> [!Note]
> Once the connection is set, it ingests data starting from events enqueued after its creation time.

#### Generating data

* See the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an event hub.

An event can contain one or more records, up to its size limit. In the following sample we send two events, each has five records appended:

```csharp
var events = new List<EventData>();
var data = string.Empty;
var recordsPerEvent = 5;
var rand = new Random();
var counter = 0;

for (var i = 0; i < 10; i++)
{
    // Create the data
    var metric = new Metric { Timestamp = DateTime.UtcNow, MetricName = "Temperature", Value = rand.Next(-30, 50) }; 
    var data += JsonConvert.SerializeObject(metric) + Environment.NewLine;
    counter++;

    // Create the event
    if (counter == recordsPerEvent)
    {
        var eventData = new EventData(Encoding.UTF8.GetBytes(data));
        events.Add(eventData);

        counter = 0;
        data = string.Empty;
    }
}

// Send events
eventHubClient.SendAsync(events).Wait();
```
