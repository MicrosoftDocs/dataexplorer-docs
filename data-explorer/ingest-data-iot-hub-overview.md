---
title: Ingest from IoT Hub - Azure Data Explorer | Microsoft Docs
description: This article describes Ingest from IoT Hub in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/13/2020
---
# Connect to IoT Hub

[Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Azure Data Explorer offers continuous ingestion from customer-managed IoT Hubs, using its [Event Hub compatible built in endpoint](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).

The IoT ingestion pipeline goes through several steps. First, you create an IoT Hub, and register a device to this IoT Hub. You then create a target table Azure Data Explorer to which the [data in a particular format](#data-format), will be ingested using the given [ingestion properties](#set-ingestion-properties). The Iot Hub connection needs to know [events routing](#set-events-routing) to connect to the Azure Data Explorer table. Data is embedded with selected properties according to the [event system properties mapping](#set-event-system-properties-mapping). This process can be managed through the [Azure portal](ingest-data-iot-hub.md), programatically with [C#](data-connection-iot-hub-csharp.md) or [Python](data-connection-iot-hub-python.md), or with the [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md).


## Create IoT Hub connection

> [!Note]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

If you don't already have one, [Create an Iot Hub](ingest-data-iot-hub.md#create-an-iot-hub).

> [!Note]
> * The `device-to-cloud partitions` count is not changeable, so you should consider long-term scale when setting partition count.
> * Consumer group must be unique per consumer. Create a consumer group dedicated to Azure Data Explorer connection. Find your resource in the Azure portal and go to `Built-in endpoints` to add a new consumer group.

## Data format

* Data is read from the Event Hub endpoint in form of [EventData](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata?view=azure-dotnet) objects.
* See [supported formats](ingestion-supported-formats.md).
    > [!NOTE]
    > IoT Hub does not support the .raw format.
* See [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).
  * The original uncompressed data size should be part of the blob metadata, or else Azure Data Explorer will estimate it. The ingestion uncompressed size limit per file is 4 GB.
  * Data compressed with the `GZip` compression does not need any specific indication, as the data type is taken from the file suffix. 

## Set ingestion properties

Ingestion properties instruct the ingestion process. Where to route the data and how to process it. You can specify [Ingestion properties](ingestion-properties.md) of the events ingestion using the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| IngestionMappingReference | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| Encoding |  Data encoding, the default is UTF8. Can be any of [.NET supported encodings](https://docs.microsoft.com/dotnet/api/system.text.encoding?view=netframework-4.8#remarks). |

## Set events routing

When setting up an IoT Hub connection to Azure Data Explorer cluster, you specify target table properties (table name, data format and mapping). This setting is the default routing for your data, also referred to as static routing.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

> [!Note]
> If **My data includes routing info** selected, you must provide the necessary routing information as part of the events properties.

## Set event system properties mapping

System properties are a collection used to store properties that are set by the IoT Hubs service, on the time the event is received. The Azure Data Explorer IoT Hub connection will embed the selected properties into the data landing in your table.

> [!Note]
> For `csv` mapping, properties are added at the beginning of the record in the order listed in the table below. For `json` mapping, properties are added according to property names in the following table.

### IoT Hub exposes the following system properties:

|Property |Description|
|---|---|
| message-id | A user-settable identifier for the message used for request-reply patterns. |
| sequence-number | A number (unique per device-queue) assigned by IoT Hub to each cloud-to-device message. |
| to | A destination specified in Cloud-to-Device messages. |
| absolute-expiry-time | Date and time of message expiration. |
| iothub-enqueuedtime | Date and time the Device-to-Cloud message was received by IoT Hub. |
| correlation-id| A string property in a response message that typically contains the MessageId of the request, in request-reply patterns. |
| user-id| An ID used to specify the origin of messages. |
| iothub-ack| A feedback message generator. |
| iothub-connection-device-id| An ID set by IoT Hub on device-to-cloud messages. It contains the deviceId of the device that sent the message. |
| iothub-connection-auth-generation-id| An ID set by IoT Hub on device-to-cloud messages. It contains the connectionDeviceGenerationId (as per Device identity properties) of the device that sent the message. |
| iothub-connection-auth-method| An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message. |

If you selected **Event system properties** in the **Data Source** section of the table, you must include the properties in the table schema and mapping.

### Examples 

#### Table schema example

If your data includes three columns (`Timespan`, `Metric`, and `Value`) and the properties you include are `x-opt-enqueued-time` and `x-opt-offset`, create or alter the table schema by using this command:

```kusto
    .create-merge table TestTable (TimeStamp: datetime, Metric: string, Value: int, EventHubEnqueuedTime:datetime, EventHubOffset:long)
```

#### CSV mapping example

Run the following commands to add data to the beginning of the record. 
Note ordinal values: properties are added at the beginning of the record in the order listed in the table above. 
This is important for CSV mapping where the column ordinals will change based on the system properties that are mapped.

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
 
#### JSON-mapping example

Data is added by using the system properties names as they appear in the **Data connection** blade **Event system properties** list. Run these commands:

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

### Generate data

* See the [sample project](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Quickstarts/simulated-device) that simulates a device and generates data.

## Next steps

There are various methods to ingest data to IoT Hub. See the following links for walkthroughs of each method.

* [Ingest data from IoT Hub into Azure Data Explorer](ingest-data-iot-hub.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using C# (Preview)](data-connection-iot-hub-csharp.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using Python (Preview)](data-connection-iot-hub-python.md)
* [Create an IoT Hub data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)
