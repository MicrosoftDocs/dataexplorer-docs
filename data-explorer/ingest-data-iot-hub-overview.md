---
title: Ingest from IoT Hub - Azure Data Explorer | Microsoft Docs
description: This article describes Ingest from IoT Hub in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
---
# Ingest from IoT Hub

[Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Azure Data Explorer offers continuous ingestion from customer managed IoT Hubs, using its [Event Hub compatible built in endpoint](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).

## Ingestion properties

Ingestion properties instructs the ingestion process. Where to route the data and how to process it. You can specify [Ingestion properties](ingestion-properties.md) of the events ingestion using the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties). You can set the following properties:

|Property |Description|
|---|---|
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| IngestionMappingReference | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| Encoding |  Data encoding, the default is UTF8. Can be any of [.NET supported encodings](https://docs.microsoft.com/dotnet/api/system.text.encoding?view=netframework-4.8#remarks). |

## Events routing

When setting up an IoT Hub connection to Azure Data Explorer cluster, you specify target table properties (table name, data format and mapping). This is the default routing for your data, also referred to as `static routing`.
You can also specify target table properties for each event, using event properties. The connection will dynamically route the data as specified in the [EventData.Properties](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.

## Event system properties mapping

System properties are a collection used to store properties which are set by the IoT Hubs service, on the time the event is received. The Azure Data Explorer IoT Hub connection will embed the selected properties into the data landing in your table.

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
This is important for CSV mapping where the column ordinals will change based on the system properties which are mapped.

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
 
#### JSON mapping example

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

## Create IoT Hub connection

> [!Note]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Create an IoT Hub

If you don't already have one, [Create an Iot Hub](ingest-data-iot-hub.md#create-an-iot-hub).

> [!Note]
> * The `device-to-cloud partitions` count is not changeable, so you should consider long-term scale when setting partition count.
> * Consumer gruop *must* be uniqe per consumer. Create a consumer group dedicated to Kusto connection. Find your resource in the Azure Portal and go to `Built-in endpoints` to add a new consumer group.

### Data ingestion connection to Azure Data Explorer

* Via Azure Portal: [Connect Azure Data Explorer table to IoT hub](ingest-data-iot-hub.md#connect-azure-data-explorer-table-to-iot-hub).
* Using Azure Data Explorer management .NET SDK: [Add an IoT Hub data connection](data-connection-iot-hub-csharp.md#add-an-iot-hub-data-connection)
* Using Azure Data Explorer management Python SDK: [Add an IoT Hub data connection](data-connection-iot-hub-python.md#add-an-iot-hub-data-connection)
* With ARM template: [Azure Resource Manager template for adding an Iot Hub data connection](data-connection-iot-hub-resource-manager.md#azure-resource-manager-template-for-adding-an-iot-hub-data-connection)

> [!Note]
> If **My data includes routing info** selected, you *must* provide the necessary [routing](#events-routing) information as part of the events properties.

> [!Note]
> Once the connection is set, it ingest data starting from events enqueued after its creation time.

### Generating data

* See the [sample project](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Quickstarts/simulated-device) that simulates a device and generates data.