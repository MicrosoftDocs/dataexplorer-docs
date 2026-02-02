---
title: Ingest from IoT Hub - Azure Data Explorer
description: This article describes Ingest from IoT Hub in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: how-to
ms.date: 02/02/2026
---

# IoT Hub data connection

[Azure IoT Hub](/azure/iot-hub/about-iot-hub) is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages. Azure Data Explorer offers continuous ingestion from customer-managed IoT Hubs, using its [Event Hubs compatible built in endpoint of device-to-cloud messages](/azure/iot-hub/iot-hub-devguide-messages-d2c#routing-endpoints).

The IoT ingestion pipeline goes through several steps. First, you create an IoT Hub, and register a device to it. You then create a target table in Azure Data Explorer into which the [data in a particular format](#data-format) is ingested using the given [ingestion properties](#ingestion-properties). The Iot Hub connection needs to know [events routing](#events-routing) to connect to the Azure Data Explorer table. Data is embedded with selected properties according to the [event system properties mapping](#event-system-properties-mapping). You can manage this process through the [Azure portal](create-iot-hub-connection.md?tabs=portal), programmatically with [C#](create-iot-hub-connection-sdk.md?tabs=c-sharp) or [Python](create-iot-hub-connection-sdk.md?tabs=c-python), or with the [Azure Resource Manager template](create-iot-hub-connection.md?tabs=arm-template).

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

## Data format

* Data is read from the Event Hubs endpoint in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects.
* See [supported formats](ingestion-supported-formats.md).
    > [!NOTE]
    > IoT Hub doesn't support the .raw format.
* See [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).

## Ingestion properties

Ingestion properties guide the ingestion process by specifying where to route the data and how to process it. You can specify [Ingestion properties](/kusto/ingestion-properties) for the events by using the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-data-explorer&preserve-view=true#Microsoft_ServiceBus_Messaging_EventData_Properties). Set the following properties:

|Property |Description|
|---|---|
| Database | Name (case sensitive) of the target database. Use this property if you want to send the data to a different database than the database you created the data connection on (the default database). To route the data to multiple databases, you must first set up the connection as a multi-database connection. For more information, see [Events routing](#events-routing). |
| Table | Name (case sensitive) of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| Format | Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| IngestionMappingReference | Name of the existing [ingestion mapping](/kusto/management/create-ingestion-mapping-command?view=azure-data-explorer&preserve-view=true) to use. Overrides the `Column mapping` set on the `Data Connection` pane.|
| Encoding |  Data encoding, the default is UTF8. Can be any of [.NET supported encodings](/dotnet/api/system.text.encoding#remarks). |

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Events routing

When you create a data connection to your cluster, you specify the routing for where to send ingested data. The default routing sends data to the target table specified in the connection string that's associated with the target database. The default routing for your data is also referred to as *static routing*. You can specify an alternative routing for your data by using the event data properties.

### Route event data to an alternate database

Routing data to an alternate database is off by default. To send the data to a different database, first set the connection as a multi-database connection. For an example of how to do this in the Azure portal, see [Turn on multi-database routing](#turn-on-multi-database-routing). The user, group, service principal, or managed identity that you use to allow database routing must at least have the **contributor** role and write permissions on the cluster.

To specify an alternate database, set the *Database* [ingestion property](#ingestion-properties).

> [!WARNING]
> If you specify an alternate database but don't set the connection as a multi-database data connection, the ingestion fails.

#### Turn on multi-database routing

Before you can set an alternate target database, you must first allow routing the data to multiple databases. Use the following steps to allow routing the data to alternate databases:

1. In the Azure portal, browse to your cluster.
1. Select **Databases** > **Data connections**.
1. Create or edit a data connection. In the **Data connection** pane, under **Data routing settings**, turn on the **allow routing data to other database (multi-database data connection)** option.

    :::image type="content" source="media/ingest-data-iot-hub/data-connection-allow-multi-database.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing the Data routing settings option set to allow.":::

### Route event data to an alternate table

You can also specify target table properties for each event, using event properties. The connection dynamically routes the data as specified in the [EventData.Properties](/dotnet/api/microsoft.servicebus.messaging.eventdata.properties#Microsoft_ServiceBus_Messaging_EventData_Properties), overriding the static properties for this event.
To specify an alternate table, set the *Table* [ingestion property](#ingestion-properties).

> [!NOTE]
> If you select **My data includes routing info**, you must provide the necessary routing information as part of the events properties.

## Event system properties mapping

Use system properties to store properties that the IoT Hub service sets when it receives an event. The Azure Data Explorer IoT Hub connection embeds the selected properties in the data landing in your table.

> [!NOTE]
> For `csv` mapping, add properties at the beginning of the record in the order listed in the following table. For `json` mapping, add properties according to property names in the following table.

### System properties

IoT Hub exposes the following system properties for device-to-cloud IoT Hub messages:

|Property |Description|
|---|---|
| message-ID |A user-settable identifier for the message used for request-reply patterns. Format: A case-sensitive string (up to 128 characters long) of ASCII 7-bit alphanumeric characters + `{'-', ':', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`.  |
| iothub-enqueuedtime |Date and time the [Device-to-Cloud](/azure/iot-hub/iot-hub-devguide-d2c-guidance) message was received by IoT Hub. |
| user-ID |An ID used to specify the origin of messages. When messages are generated by IoT Hub, this value is set to `{iot hub name}`. |
| iothub-connection-device-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **deviceId** of the device that sent the message. |
| iothub-connection-module-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **moduleId** of the device that sent the message. |
| iothub-connection-auth-generation-id |An ID set by IoT Hub on device-to-cloud messages. It contains the **connectionDeviceGenerationId** (as per [Device identity properties](/azure/iot-hub/iot-hub-devguide-identity-registry#device-identity-properties)) of the device that sent the message. |
| iothub-connection-auth-method |An authentication method set by IoT Hub on device-to-cloud messages. This property contains information about the authentication method used to authenticate the device sending the message.|
| iothub-app-iothub-creation-time-utc | Allows the device to send event creation time when sending data in a batch. |
| iothub-creation-time-utc | Allows the device to send event creation time when sending one message at a time. |
| dt-dataschema | This value is set by IoT hub on device-to-cloud messages. It contains the device model ID set in the device connection. |
| dt-subject | The name of the component that's sending the device-to-cloud messages. |

If you select **Event system properties** in the **Data Source** section of the table, include the properties in the table schema and mapping.

[!INCLUDE [data-explorer-iot-system-properties](includes/data-explorer-iot-system-properties.md)]

## Event user properties mapping

The system doesn't support enriching the IoT Hub events payload with user properties. Consider embedding user properties in the event body upstream.

## IoT Hub connection

> [!NOTE]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Create an IoT Hub

If you don't already have an IoT Hub, [Create an Iot Hub](/azure/iot-hub/iot-hub-create-through-portal). You can manage connection to IoT Hub through the [Azure portal](create-iot-hub-connection.md?tabs=portal), programmatically with [C#](create-iot-hub-connection-sdk.md?tabs=c-sharp) or [Python](create-iot-hub-connection-sdk.md?tabs=c-python), or with the [Azure Resource Manager template](create-iot-hub-connection.md?tabs=arm-template).

> [!NOTE]
> * You can't change the `device-to-cloud partitions` count after you set it, so consider long-term scale when setting partition count.
> * Each consumer must have a unique consumer group. Create a consumer group dedicated to Azure Data Explorer connection. Find your resource in the Azure portal and go to `Built-in endpoints` to add a new consumer group.
> * The Data Connection uses IoT Hub `Built-in endpoint`. If you configure any other `Message routing endpoint`, messages stop flowing to the `Built-in endpoint` unless a route is created to that endpoint. To ensure messages continues to flow to the built-in-endpoint if a new route is added, configure a route to the `events` endpoint. For more information, see [IoT Hub Troubleshooting Message Routing](/azure/iot-hub/troubleshoot-message-routing#was-a-new-route-created).

## Sending events

See the [sample project](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/main/iot-hub/Quickstarts/SimulatedDevice) that simulates a device and generates data.

## Next step

> [!div class="nextstepaction"]
> [Create an IoT Hub data connection](create-iot-hub-connection.md)
