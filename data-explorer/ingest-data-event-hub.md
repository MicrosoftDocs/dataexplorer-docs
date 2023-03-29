---
title: 'Ingest data from event hub into Azure Data Explorer'
description: 'In this article, you learn how to ingest (load) data into Azure Data Explorer from event hub.'
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 09/11/2022

# Customer intent: As a database administrator, I want to ingest data into Azure Data Explorer from an event hub, so I can analyze streaming data.
---

# Ingest data from event hub into Azure Data Explorer

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-hub.md)
> * [Ingestion wizard](./event-hub-wizard.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)
> * [Azure Resource Manager template](data-connection-event-hub-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]

Azure Data Explorer offers ingestion (data loading) from Azure Event Hubs, which is a big data streaming platform and event ingestion service. [Event hubs](/azure/event-hubs/event-hubs-about) can process millions of events per second in near real time. In this article, you create an event hub, connect to it from Azure Data Explorer and see data flow through the system.

For general information about ingesting into Azure Data Explorer from event hub, see [Connect to event hub](ingest-data-event-hub-overview.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* We recommend using a [user assigned managed identity](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) or [system assigned managed identity](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) for the data connection (optional).
* [A sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) that generates data and sends it to an event hub. Download the sample app to your system.
* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/) to run the sample app.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an event hub

Create an event hub by using an Azure Resource Manager template in the Azure portal.

1. To create an event hub, use the following button to start the deployment. Right-click and select **Open in new window**, so you can follow the rest of the steps in this article.

    :::image type="content" source="media/ingest-data-event-hub/deploybutton.png" alt-text="Screenshot of the Deploy to Azure button." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.eventhub%2Fevent-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json":::

    The **Deploy to Azure** button takes you to the Azure portal.

    :::image type="content" source="media/ingest-data-event-hub/deploy-to-azure.png" alt-text="Screenshot of the Azure portal U I, showing the Create an event hub form.":::

1. Select the subscription where you want to create the event hub, and create a resource group named *test-hub-rg*.

    :::image type="content" source="media/ingest-data-event-hub/create-resource-group.png" alt-text="Screenshot of the Azure portal U I, showing the Create new resource group dropdown.":::

1. Fill out the form with the following information.

    Use defaults for any settings not listed in the following table.

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your event hub.|
    | Resource group | *test-hub-rg* | Create a new resource group. |
    | Location | *West US* | Select *West US* for this article. For a production system, select the region that best meets your needs. Create the event hub namespace in the same Location as the Azure Data Explorer cluster for best performance (most important for event hub namespaces with high throughput).
    | Namespace name | A unique namespace name | Choose a unique name that identifies your namespace. For example, *mytestnamespace*. The domain name *servicebus.windows.net* is appended to the name you provide. The name can contain only letters, numbers, and hyphens. The name must start with a letter, and it must end with a letter or number. The value must be between 6 and 50 characters long.
    | Event hub name | *test-hub* | The event hub sits under the namespace, which provides a unique scoping container. The event hub name must be unique within the namespace. |
    | Consumer group name | *test-group* | Consumer groups enable multiple consuming applications to each have a separate view of the event stream. |
    | | |

1. Select **Review + create**.

1. Review the **Summary** of resources created. Select **Create**, which acknowledges that you're creating resources in your subscription.

    :::image type="content" source="media/ingest-data-event-hub/review-create.png" alt-text="Screenshot of the Azure portal U I, showing the summary of creating EventHubs namespace, event hub, and consumer group form.":::

1. Select **Notifications** on the toolbar to monitor the provisioning process. It might take several minutes for the deployment to succeed, but you can move on to the next step now.

    :::image type="content" source="media/ingest-data-event-hub/notifications.png" alt-text="Screenshot of the Azure portal U I toolbar, showing the Notifications icon.":::

## Create a target table in Azure Data Explorer

Now you create a table in Azure Data Explorer, to which event hubs will send data. You create the table in the cluster and database provisioned in **Prerequisites**.

1. In the Azure portal, browse to your cluster, and select **Query**.

    :::image type="content" source="media/ingest-data-event-hub/query-explorer-link.png" alt-text="Screenshot of the Azure portal U I left menu, showing the Query application option.":::

1. Copy the following command into the window and select **Run** to create the table (TestTable) which will receive the ingested data.

    ```Kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-event-hub/run-create-query.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the query window running query.":::

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp", "Properties": {"Path": "$.timeStamp"}},{"column":"Name", "Properties": {"Path":"$.name"}} ,{"column":"Metric", "Properties": {"Path":"$.metric"}}, {"column":"Source", "Properties": {"Path":"$.source"}}]'
    ```

## Connect to the event hub

Now you connect to the event hub from Azure Data Explorer. When this connection is in place, data that flows into the event hub streams to the test table you created earlier in this article.

1. Select **Notifications** on the toolbar to verify that the event hub deployment was successful.

1. Under the cluster you created, select **Databases** then **TestDatabase**.

    :::image type="content" source="media/ingest-data-event-hub/select-test-database.png" alt-text="Screenshot of Azure Data Explorer web U I left menu, showing the Test Database item, selected.":::

1. Select **Data ingestion** and **Add data connection**.

    :::image type="content" source="media/ingest-data-event-hub/event-hub-connection.png" alt-text=" Screenshot of the Azure Data Explorer web U I left menu, showing how to Add data connection.":::

### Create a data connection

Fill out the form with the following information, and then select **Create**.

:::image type="content" source="media/ingest-data-event-hub/data-connection-pane.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the Create data connection form.":::

| **Setting** | **Suggested value** | **Field description** |
|---|---|---|
| Data connection name | *test-hub-connection* | The name of the connection you want to create in Azure Data Explorer.|
| Subscription |      | The subscription ID where the event hub resource is located.  |
| event hub namespace | A unique namespace name | The name you chose earlier that identifies your namespace. |
| event hub | *test-hub* | The event hub you created. |
| Consumer group | *test-group* | The consumer group defined in the event hub you created. |
| Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties will be added to the first record. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
| Compression | *None* | The compression type of the event hub messages payload. Supported compression types: *None, Gzip*.|
| Managed Identity (recommended) | System-assigned | The managed identity used by the Data Explorer cluster for access to read from the event hub. We recommend using managed identities to control access to your event hub.<br /><br />**Note**:<br />When the data connection is created:<br/>\* *System-assigned* identities are automatically created if they don't exist<br />\* The managed identity is automatically assigned the *Azure Event Hubs Data Receiver* role and is added to your Data Explorer cluster. We recommend verifying that the role was assigned and that the identity was added to the cluster. |

[!INCLUDE [event-hub-connection-caution](includes/event-hub-connection-caution.md)]

> [!NOTE]
> If you have an existing data connection that is not using managed identities, we recommend updating it to use managed identities.

#### Target database (multi-database data connection)

Specifying a target database allows you to override the default associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-hub-overview.md#events-routing).

Before you can set an alternate target database, you must first *allow* routing the data to multiple databases. Use the following steps to *allow* routing the data to alternate databases:

1. In the Azure portal, browse to your cluster.
1. Select **Databases** > **Data connections**.
1. Create or edit a data connection and in the **Data connection** pane, under **Data routing settings**, turn on the allow routing data to other databases (multi-database data connection) option.

    :::image type="content" source="media/ingest-data-event-hub/data-connection-allow-multi-database.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the Data connections page highlighting the Data routing settings option.":::

#### Target table

There are two options for routing the ingested data: *static* and *dynamic*.
For this article, you use static routing, where you specify the table name, data format, and mapping as default values. If the event hub message includes data routing information, this routing information will override the default settings.

1. Fill out the following routing settings:

    :::image type="content" source="media/ingest-data-event-hub/default-routing-settings.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the Target table form for default routing settings for ingesting data into event hub.":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table name | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, and W3CLOG. |
    | Mapping | *TestMapping* | The [mapping](kusto/management/mappings.md) you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used. |

    > [!NOTE]
    >
    > * You don't have to specify all **Default routing settings**. Partial settings are also accepted.
    > * Only events enqueued after you create the data connection are ingested.
    > * The mapping name is case-sensitive. A mismatch in mapping name will result in ingestion failure.

1. Select **Create**.

### Event system properties mapping

[!INCLUDE [event-hub-system-mapping](includes/event-hub-system-mapping.md)]

If you selected **Event system properties** in the **Data Source** section of the table, you must include [system properties](ingest-data-event-hub-overview.md#event-system-properties-mapping) in the table schema and mapping.

### Event retrieval start date

Event Hubs data connection can retrieve Event Hubs events created after the **Event retrieval start date**. Only events retained by Event Hubs [retention period](/azure/event-hubs/event-hubs-features#event-retention) can be retrieved. You can use this field to ingest historical events from Event Hubs. For example, to ingest data that existed in your event hub prior to creating the data connection, or for testing purposes.

The value must be specified as a time value in Coordinated Universal Time (UTC). If no value is specified, the default time is the time at which the data connection is created.
Changing the default time might cause ingestion latency while older records are ingested. For existing data connections, this might ingest events previously ingested.

## Copy the connection string

When you run the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) listed in Prerequisites, you need the connection string for the event hub namespace.

1. Under the event hub namespace you created, select **Shared access policies**, then **RootManageSharedAccessKey**.

    :::image type="content" source="media/ingest-data-event-hub/shared-access-policies.png" alt-text="Screenshot of the Azure Data Explorer web U I left menu, showing the Shared access policies.":::

1. Copy **Connection string - primary key**. You paste it in the next section.

    :::image type="content" source="media/ingest-data-event-hub/connection-string.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the Connection string form.":::

## Generate sample data

Use the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) you downloaded to generate data.

1. Open the sample app solution in Visual Studio.
1. In the *program.cs* file, update the `eventHubName` constant to the name of your event hub and update the `connectionString` constant to the connection string you copied from the event hub namespace.

    ```csharp
    const string eventHubName = "test-hub";
    // Copy the connection string ("Connection string-primary key") from your event hub namespace.
    const string connectionString = @"<YourConnectionString>";
    ```

1. Build and run the app. The app sends messages to the event hub, and prints out its status every 10 seconds.

1. After the app has sent a few messages, move on to the next step: reviewing the flow of data into your event hub and test table.

## Review the data flow

With the app generating data, you can now see the flow of that data from the event hub to the table in your cluster.

1. In the Azure portal, under your event hub, you see the spike in activity while the app is running.

    :::image type="content" source="media/ingest-data-event-hub/event-hub-graph.png" alt-text="Screenshot of the Event hub graph, showing a spike in activity.":::

1. To preview incoming data sent to your event hub in the Azure portal, see [process data from your event hub using Azure Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics).

1. To check how many messages have made it to the database so far, run the following query in your test database.

    ```Kusto
    TestTable
    | count
    ```

1. To see the content of the messages, run the following query:

    ```Kusto
    TestTable
    ```

    The result set should look like the following image:

    :::image type="content" source="media/ingest-data-event-hub/message-result-set.png" alt-text="Screenshot of the event hub query showing the results from the TestTable.":::

    > [!NOTE]
    >
    > * Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The default batching policy is configured to seal a batch once one of the following conditions is true for the batch: a maximum delay time of 5 minutes, total size of 1G, or 1000 blobs. Therefore, you may experience a latency. For more information, see [batching policy](kusto/management/batchingpolicy.md).
    > * Event hub ingestion includes event hub response time of 10 seconds or 1 MB.
    > * To reduce response time lag, configure your table to support streaming. See [streaming policy](kusto/management/streamingingestionpolicy.md).

## Clean up resources

If you don't plan to use your event hub again, clean up **test-hub-rg**, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created.

    If the left menu is collapsed, select :::image type="content" source="media/ingest-data-event-hub/expand.png" alt-text="Screenshot of the Expand button."::: to expand it.

    :::image type="content" source="media/ingest-data-event-hub/delete-resources-select.png" alt-text="Screenshot of the Azure portal U I left menu, showing the Resource groups page.":::

1. Under **test-resource-group**, select **Delete resource group**.

1. In the new window, type the name of the resource group to delete (*test-hub-rg*), and then select **Delete**.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
