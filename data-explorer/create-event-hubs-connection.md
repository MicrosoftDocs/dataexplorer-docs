---
title: 'Create an Event Hubs data connection'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Hubs.'
ms.topic: how-to
ms.date: 03/26/2023
---

Azure Data Explorer offers ingestion from [Event Hubs](/azure/event-hubs/event-hubs-about), which is a big data streaming platform and event ingestion service. Event Hubs can process millions of events per second in near real time.

In this article, you'll connect to an event hub and ingest data into Azure Data Explorer.

For information about ingesting from Event Hubs, see [Connect to event hub](ingest-data-event-hub-overview.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* Download this [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) to send mock data to an event hub.
* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/) to run the sample app.

## 1 - Create the target table

To send data from an event hub to Azure Data Explorer, you must first create a table to receive the data.

### [Portal](#tab/portal)

1. In the Azure portal, go to your cluster and select **Query**.

    :::image type="content" source="media/ingest-data-event-hub/query-explorer-link.png" alt-text="Screenshot of the Azure portal U I left menu, showing the Query application option.":::

1. Copy the following command into the window and select **Run** to create the `TestTable` table.

    ```Kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-event-hub/run-create-query.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the query window running query.":::

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the `TestTable` table.

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp", "Properties": {"Path": "$.timeStamp"}},{"column":"Name", "Properties": {"Path":"$.name"}} ,{"column":"Metric", "Properties": {"Path":"$.metric"}}, {"column":"Source", "Properties": {"Path":"$.source"}}]'
    ```

### [Wizard](#tab/wizard)

1. From the **Data** tab of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), in the **Ingest data from Event Hub** card, select **Ingest**.

    :::image type="content" source="media/event-hub-wizard/ingestion-in-web-ui.png" alt-text="Select the ingestion wizard in the Azure Data Explorer web UI.":::

1. The **Ingest data** window opens with the **Destination** tab selected. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus.

    :::image type="content" source="media/event-hub-wizard/destination-tab.png" alt-text="Screen shot of destination tab. Cluster, Database, and Table fields must be filled out before proceeding to Next-Source.":::

1. Under **Table**, select **New table** and enter a name for the new table. Alternatively, use an existing table.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Select **Next: Source**.

### [C#](#tab/c-sharp)

1. Install the ingest library.

    ```csharp
    Install-Package Microsoft.Azure.Kusto.Ingest
    ```

1. Construct the connection string.

    ```csharp
    var tenantId = "<TenantId>";
    var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";

    var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri).WithAadUserPromptAuthentication(tenantId);
    ```

1. Create a table.

    ```csharp
    var databaseName = "<DatabaseName>";
    var table = "<TableName>";
    using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
    {
        var command =
            CslCommandGenerator.GenerateTableCreateCommand(
                table,
                new[]
                {
                    Tuple.Create("StartTime", "System.DateTime"),
                    Tuple.Create("EndTime", "System.DateTime"),
                    ...
                });
    
        kustoClient.ExecuteControlCommand(databaseName, command);
    }
    ```

1. Define an ingestion mapping.

    ```csharp
    var tableMapping = "TableName_CSV_Mapping";
    using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
    {
        var command =
            CslCommandGenerator.GenerateTableMappingCreateCommand(
                Data.Ingestion.IngestionMappingKind.Csv,
                table,
                tableMapping,
                new[] {
                    new ColumnMapping() { ColumnName = "StartTime", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "0" } } },
                    new ColumnMapping() { ColumnName = "EndTime", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "1" } } },
                    new ColumnMapping() { ColumnName = "EpisodeId", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "2" } } },
                    ...
            });
    
        kustoClient.ExecuteControlCommand(databaseName, command);
    }
    ```

### [Python](#tab/python)

### [ARM template](#tab/arm-template)

---

## 2 - Connect to the event hub

When this connection is in place, data that flows into the event hub streams to the target table.

### [Portal](#tab/portal)

1. Under the cluster you created, select **Databases** then **TestDatabase**.

    :::image type="content" source="media/ingest-data-event-hub/select-test-database.png" alt-text="Screenshot of Azure Data Explorer web U I left menu, showing the Test Database item, selected.":::

1. Select **Data ingestion** and **Add data connection**.

    :::image type="content" source="media/ingest-data-event-hub/event-hub-connection.png" alt-text=" Screenshot of the Azure Data Explorer web U I left menu, showing how to Add data connection.":::

1. Fill out the form with the following information, and then select **Create**.

    :::image type="content" source="media/ingest-data-event-hub/data-connection-pane.png" alt-text="Screenshot of the Azure Data Explorer web U I, showing the Create data connection form.":::

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Data connection name | *test-hub-connection* | The name of the connection you want to create in Azure Data Explorer.|
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace | A unique namespace name | The name you chose earlier that identifies your namespace. |
    | Event hub | *test-hub* | The event hub you created. |
    | Consumer group | *test-group* | The consumer group defined in the event hub you created. |
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties will be added to the first record. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    | Compression | *None* | The compression type of the event hub messages payload. Supported compression types: *None, Gzip*.|
    | Managed Identity (recommended) | System-assigned | The managed identity used by the Data Explorer cluster for access to read from the event hub. We recommend using managed identities to control access to your event hub.<br /><br />**Note**:<br />When the data connection is created:<br/>\* *System-assigned* identities are automatically created if they don't exist<br />\* The managed identity is automatically assigned the *Azure Event Hubs Data Receiver* role and is added to your Data Explorer cluster. We recommend verifying that the role was assigned and that the identity was added to the cluster. |

    > [!NOTE]
    > If you have an existing data connection that is not using managed identities, we recommend updating it to use managed identities.

### [Wizard](#tab/wizard)

1. Under **Source type**, select **Event Hub**.

1. Under **Data Connection**, fill in the following fields and select **Next: Schema**.

    :::image type="content" source="media/event-hub-wizard/project-details.png" alt-text="Screenshot of source tab with project details fields to be filled in - ingest new data to Azure Data Explorer with Event Hubs in the ingestion wizard.":::

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data connection name | *TestDataConnection*  | The name that identifies your data connection.
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace |  | The name that identifies your namespace. |
    | Event hub |  | The event hub you wish to use. |
    | Consumer group |  | The consumer group defined in your event hub. |
    | Compression | | The compression type of the event hub messages payload.|
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties will be added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    |Event retrieval start date| Coordinated Universal Time (UTC) | The data connection retrieves existing Event Hubs events created after the *Event retrieval start date*. Only events retained by Event Hubs's retention period can be retrieved. If the *Event retrieval start date* isn't specified, the default time is the time at which the data connection is created. |

1. Set the schema.

    Data is read from the event hub in form of [EventData](/dotnet/api/microsoft.servicebus.messaging.eventdata) objects. Supported formats are CSV, JSON, PSV, SCsv, SOHsv TSV, TXT, and TSVE.

    For information on schema mapping with JSON-formatted data, see [Edit the schema](/azure/data-explorer/ingest-from-local-file#edit-the-schema).
    For information on schema mapping with CSV-formatted data, see [Edit the schema](/azure/data-explorer/ingest-from-container#edit-the-schema).

    :::image type="content" source="media/event-hub-wizard/event-hub-schema.png" alt-text="Screenshot of schema tab in ingest new data to Azure Data Explorer with Event Hubs in the ingestion wizard.":::

    > [!NOTE]
    >
    > * If [streaming](kusto/management/streamingingestionpolicy.md) is enabled for the cluster, the option to select **Streaming ingestion** is available.
    > * If streaming is not enabled for the cluster, the option to select **Batching time** is available. For Event Hubs, the recommended default [batching time](kusto/management/batchingpolicy.md) is 30 seconds.

1. If the data you see in the preview window isn't complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:

    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.

1. Select **Next: Summary**.

### [C#](#tab/c-sharp)

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "PlaceholderClientSecret";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.microsoftonline.com/{tenantId}");
var credential = new ClientCredential(clientId, clientSecret);
var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var clusterName = "mycluster";
var databaseName = "mydatabase";
var dataConnectionName = "myeventhubconnect";
//The event hub that is created as part of the Prerequisites
var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
var consumerGroup = "$Default";
var location = "Central US";
//The table and column mapping are created as part of the Prerequisites
var tableName = "StormEvents";
var mappingRuleName = "StormEvents_CSV_Mapping";
var dataFormat = EventHubDataFormat.CSV;
var compression = "None";
var databaseRouting = "Multi";
await kustoManagementClient.DataConnections.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, dataConnectionName,
    new EventHubDataConnection(eventHubResourceId, consumerGroup, location: location, tableName: tableName, mappingRuleName: mappingRuleName, dataFormat: dataFormat, compression: compression, databaseRouting: databaseRouting));
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *PlaceholderClientSecret* | The client secret of the application that can access resources in your tenant.|
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| databaseName | *mykustodatabase* | The name of the target database in your cluster.|
| dataConnectionName | *myeventhubconnect* | The desired name of your data connection.|
| tableName | *StormEvents* | The name of the target table in the target database.|
| mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
| dataFormat | *csv* | The data format of the message.|
| eventHubResourceId | *Resource ID* | The resource ID of your event hub that holds the data for ingestion. |
| consumerGroup | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|
| compression | *Gzip* or *None* | The type of data compression. |
| databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-hub-overview.md#events-routing). |

### [Python](#tab/python)

```Python
from azure.mgmt.kusto import KustoManagementClient
from azure.mgmt.kusto.models import EventHubDataConnection
from azure.identity import ClientSecretCredential

#Directory (tenant) ID
tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Application ID
client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
#Client Secret
client_secret = "xxxxxxxxxxxxxx"
subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
kusto_management_client = KustoManagementClient(credentials, subscription_id)

resource_group_name = "myresourcegroup"
#The cluster and database that are created as part of the Prerequisites
cluster_name = "mycluster"
database_name = "mydatabase"
data_connection_name = "myeventhubconnect"
#The event hub that is created as part of the Prerequisites
event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhubnamespace/eventhubs/myeventhub"";
consumer_group = "$Default"
location = "Central US"
#The table and column mapping that are created as part of the Prerequisites
table_name = "mytable"
mapping_rule_name = "mytablemappingrule"
data_format = "csv"
database_routing = "Multi"
#Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
poller = kusto_management_client.data_connections.create_or_update(
            resource_group_name=resource_group_name,
            cluster_name=cluster_name,
            database_name=database_name,
            data_connection_name=data_connection_name,
            parameters=EventHubDataConnection(
                event_hub_resource_id=event_hub_resource_id,
                consumer_group=consumer_group,
                location=location,
                table_name=table_name,
                mapping_rule_name=mapping_rule_name,
                data_format=data_format,
                database_routing=database_routing
            )
        )
poller.wait()
print(poller.result())
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resource_group_name | *myresourcegroup* | The name of the resource group containing your cluster.|
| cluster_name | *mycluster* | The name of your cluster.|
| database_name | *mydatabase* | The name of the target database in your cluster.|
| data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
| table_name | *mytable* | The name of the target table in the target database.|
| mapping_rule_name | *mytablemappingrule* | The name of your column mapping related to the target table.|
| data_format | *csv* | The data format of the message.|
| event_hub_resource_id | *Resource ID* | The resource ID of your event hub that holds the data for ingestion. |
| consumer_group | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|
| databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-hub-overview.md#events-routing). |

### [ARM template](#tab/arm-template)

---

[!INCLUDE [event-hub-connection-caution](includes/event-hub-connection-caution.md)]
