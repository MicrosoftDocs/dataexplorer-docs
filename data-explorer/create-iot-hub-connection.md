---
title: 'Create an IoT Hub data connection - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from IoT Hub.'
ms.topic: how-to
ms.date: 04/04/2023
---

# Create an IoT Hub data connection in Azure Data Explorer

This article shows you how to ingest data into Azure Data Explorer from IoT Hub, a big data streaming platform and IoT ingestion service.

For general information about ingesting into Azure Data Explorer from IoT Hub, see [Connect to IoT Hub](ingest-data-iot-hub-overview.md).

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [IoT Hub](/azure/iot-hub/iot-hub-create-through-portal) with data for ingestion.

## Create an IoT Hub data connection

In this section, you'll establish a connection between the IoT Hub and your Azure Data Explorer table. As long as this connection is in place, data is transmitted from the IoT Hub into your target table.

### [Portal](#tab/portal)

1. In the left menu of your Azure Data Explorer cluster, select **Databases** then select the database that contains your target table.

    :::image type="content" source="media/ingest-data-iot-hub/select-database.png" alt-text="Screenshot of the Azure Data Explorer Web U I , showing a list of databases with testdb selected.":::

1. Select **Data connections** and **Add data connection**. From the dropdown, select **IoT Hub**.

    :::image type="content" source="media/ingest-data-iot-hub/add-data-connection.png" alt-text="Screenshot of the Azure Data Explorer Web U I , showing the Data Ingestion window with the Add data connection tab selected.":::

1. Fill out the form with the following information.

    |**Setting** | **Field description**|
    |---|---|
    | Data connection name | The name of the connection you want to create in Azure Data Explorer|
    | Subscription |  The subscription ID where the Event Hubs resource is located.  |
    | IoT Hub | IoT Hub name |
    | Shared access policy | The name of the shared access policy. Must have read permissions |
    | Consumer group |  The consumer group defined in the IoT Hub built-in endpoint |
    | Event system properties | The [IoT Hub event system properties](/azure/iot-hub/iot-hub-devguide-messages-construct#system-properties-of-d2c-iot-hub-messages). When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties.|

    :::image type="content" source="media/ingest-data-iot-hub/create-data-connection.png" alt-text="Screenshot of the Azure Data Explorer Web U I , showing the Data connection form.":::

    > [!NOTE]
    >
    > * Event system properties are supported for single-record events.
    > * For CSV mapping, properties are added at the beginning of the record. For JSON mapping, properties are added according to the name that appears in the drop-down list.

1. Depending on your use case, you may want to turn on multi-database routing. For more information about database routing, see [Events routing](ingest-data-iot-hub-overview.md#events-routing).

    :::image type="content" source="media/ingest-data-iot-hub/data-connection-allow-multi-database.png" alt-text="Screenshot of the Azure Data Explorer Web U I , showing the Data routing settings option set to allow.":::

1. Fill out the following routing settings:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table name | *TestTable* | The table you created in **testdb**. |
    | Data format | *JSON* | Supported formats are AVRO, CSV, JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHE AVRO, and W3CLOG.|
    | Mapping | *TestMapping* | The [mapping](kusto/management/mappings.md) you created in **testdb**, which maps incoming data to the column names and data types of **testdb**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used. |
    | | |

    :::image type="content" source="media/ingest-data-iot-hub/table-routing-settings.png" alt-text="Screenshot of the Azure Data Explorer Web U I , showing the default routing settings in the Target table form.":::

    > [!NOTE]
    >
    > * JSON data is parsed as multijson by default. Select **Ignore format errors** to ingest the data in strict JSON format.
    > * If you selected **Event system properties**, you must include [system properties](ingest-data-iot-hub-overview.md#system-properties) in the table schema and mapping.

1. Select **Create**.

> [!WARNING]
> In case of a [manual failover](/azure/iot-hub/iot-hub-ha-dr#manual-failover), recreate the data connection.

---

## Remove an IoT Hub data connection

### [Portal](#tab/portal-2)

To remove the IoT hub connection from the Azure portal, do the following:

1. Go to your cluster. From the left menu, select **Databases**. Then, select the database that contains the target table.
1. From the left menu, select **Data connections**. Then, select the checkbox next to the relevant IoT Hub data connection.
1. From the top menu bar, select **Delete**.

### [C#](#tab/c-sharp-2)

To remove the IoT Hub connection, run the following command:

```c#
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```

### [Python](#tab/python-2)

To remove the IoT Hub connection, run the following command:

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```

---

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
