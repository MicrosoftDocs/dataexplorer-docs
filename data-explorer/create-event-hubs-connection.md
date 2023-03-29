---
title: 'Create an Event Hubs data connection'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Hubs.'
ms.topic: how-to
ms.date: 03/28/2023
---

# Create an Event Hubs data connection

Azure Data Explorer offers ingestion from [Event Hubs](/azure/event-hubs/event-hubs-about), a big data streaming platform and event ingestion service. Event Hubs can process millions of events per second in near real time.

In this article, you'll connect to an event hub and ingest data into Azure Data Explorer. For an overview on ingesting from Event Hubs, see [Azure Event Hubs data connection](ingest-data-event-hub-overview.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* An [event hub](/azure/event-hubs/event-hubs-create) with data for ingestion.

## 1 - Create a target table

To ingest data from an event hub to Azure Data Explorer, you need a destination table for the data. You can create a table using the [.create table command](kusto/management/create-table-command.md), create a new table using the wizard in the following step, or use an existing table.

## 2 - Connect to an event hub

In this section, you'll establish a connection between the event hub and your Azure Data Explorer table. As long as this connection is in place, data is transmitted from the event hub into your target table. If the event hub is moved to a different resource or subscription, you'll need to update or recreate the connection.

### [Portal](#tab/portal)

1. In the Azure portal, go to your cluster and select **Databases**. Then, select the database you created.

    :::image type="content" source="media/ingest-data-event-hub/select-test-database.png" alt-text="Screenshot of Azure Data Explorer web U I left menu, showing the Test Database item, selected.":::

1. From the left menu, select **Data ingestion**. Then, in the top bar, select **Add data connection**.

1. Fill out the form with the following information, and then select **Create**.

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Data connection name | *test-hub-connection* | The name of the connection you want to create in Azure Data Explorer.|
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace | A unique namespace name | The name you chose earlier that identifies your namespace. |
    | Event hub | *test-hub* | The event hub you created. |
    | Consumer group | *test-group* | The consumer group defined in the event hub you created. |
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties are added to the first record. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    | Compression | *None* | The compression type of the event hub messages payload. Supported compression types: *None, Gzip*.|
    | Managed Identity (recommended) | System-assigned | The managed identity used by the Data Explorer cluster for access to read from the event hub. We recommend using managed identities to control access to your event hub.<br /><br />**Note**:<br />When the data connection is created:<br/>\* *System-assigned* identities are automatically created if they don't exist<br />\* The managed identity is automatically assigned the *Azure Event Hubs Data Receiver* role and is added to your Data Explorer cluster. We recommend verifying that the role was assigned and that the identity was added to the cluster. |

    > [!NOTE]
    > If you have an existing data connection that is not using managed identities, we recommend updating it to use managed identities.

### [Wizard](#tab/wizard)

1. From the **Data** tab of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), select **Ingest** from the **Ingest data from Event Hub** card.

    :::image type="content" source="media/event-hub-wizard/ingestion-in-web-ui.png" alt-text="Select the ingestion wizard in the Azure Data Explorer web UI.":::

1. The **Ingest data** window opens with the **Destination** tab selected. The **Cluster** and **Database** fields are autopopulated. You may select a different cluster or database from the drop-down menus.

1. Under **Table**, select **New table** and enter a name for the new table. Alternatively, use an existing table.

1. Select **Next: Source**.

1. Under **Source type**, select **Event Hub**.

1. Under **Data Connection**, fill in the following fields and select **Next: Schema**.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription |      | The subscription ID where the event hub resource is located.  |
    | Event hub namespace |  | The name that identifies your namespace. |
    | Event hub |  | The event hub you wish to use. |
    | Data connection name | *TestDataConnection*  | The name that identifies your data connection.|
    | Consumer group |  | The consumer group defined in your event hub. |
    | Compression | | The compression type of the event hub messages payload.|
    | Event system properties | Select relevant properties | The [event hub system properties](/azure/service-bus-messaging/service-bus-amqp-protocol-guide#message-annotations). If there are multiple records per event message, the system properties are added to the first one. When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties. |
    |Event retrieval start date| Coordinated Universal Time (UTC) | The data connection retrieves existing Event Hubs events created after the *Event retrieval start date*. Only events retained by Event Hubs's retention period can be retrieved. If the *Event retrieval start date* isn't specified, the default time is the time at which the data connection is created. |

1. Set the ingestion policy. If [streaming](kusto/management/streamingingestionpolicy.md) is enabled for the cluster, you can select **Streaming ingestion**. If streaming isn't enabled for the cluster, set the **Batching time**. For Event Hubs, the recommended [batching time](kusto/management/batchingpolicy.md) is 30 seconds.

    :::image type="content" source="media/event-hub-wizard/event-hub-schema.png" alt-text="Screenshot of Schema page of ingestion wizard." lightbox="media/event-hub-wizard/event-hub-schema.png":::

1. Select the **Data format**. For CSV-formatted data, **Ignore the first record** to ignore the heading row of the file. For JSON-formatted data, select **Ignore data format errors** to ingest the data in JSON format or leave unselected to ingest the data in multijson format. Select the **Nested levels** to determine the table column data division.

1. If the data you see in the preview window isn't complete, you may need more data to create a table with all necessary data fields. Use the following commands to fetch new data from your event hub:

    * **Discard and fetch new data**: discards the data presented and searches for new events.
    * **Fetch more data**: Searches for more events in addition to the events already found.

    > [!NOTE]
    > To see a preview of your data, your event hub must be sending events.

1. Select **Next: Summary**.

1. In the **Continuous ingestion from Event Hub established** window, all steps are marked with green check marks when establishment finishes successfully.

### [C#](#tab/c-sharp)

```c#
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
| databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection is routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-hub-overview.md#events-routing). |

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
| databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection is routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-hub-overview.md#events-routing). |

### [ARM template](#tab/arm-template)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_eventhubns_name": {
            "type": "string",
            "defaultValue": "eventhubns",
            "metadata": {
                "description": "Specifies the Event Hubs Namespace name."
            }
        },
        "EventHubs_eventhubdemo_name": {
            "type": "string",
            "defaultValue": "eventhubdemo",
            "metadata": {
                "description": "Specifies the event hub name."
            }
        },
        "consumergroup_default_name": {
            "type": "string",
            "defaultValue": "$Default",
            "metadata": {
                "description": "Specifies the consumer group of the event hub."
            }
        },
        "Clusters_kustocluster_name": {
            "type": "string",
            "defaultValue": "kustocluster",
            "metadata": {
                "description": "Specifies the name of the cluster"
            }
        },
        "databases_kustodb_name": {
            "type": "string",
            "defaultValue": "kustodb",
            "metadata": {
                "description": "Specifies the name of the database"
            }
        },
        "tables_kustotable_name": {
            "type": "string",
            "defaultValue": "kustotable",
            "metadata": {
                "description": "Specifies the name of the table"
            }
        },
        "mapping_kustomapping_name": {
            "type": "string",
            "defaultValue": "kustomapping",
            "metadata": {
                "description": "Specifies the name of the mapping rule"
            }
        },
        "dataformat_type": {
            "type": "string",
            "defaultValue": "csv",
            "metadata": {
                "description": "Specifies the data format"
            }
        },
        "databaseRouting_type": {
            "type": "string",
            "defaultValue": "Single",
            "metadata": {
                "description": "The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* EventData property."
            }
        },
        "dataconnections_kustodc_name": {
            "type": "string",
            "defaultValue": "kustodc",
            "metadata": {
                "description": "Name of the data connection to create"
            }
        },
        "subscriptionId": {
            "type": "string",
            "defaultValue": "[subscription().subscriptionId]",
            "metadata": {
                "description": "Specifies the subscriptionId of the event hub"
            }
        },
        "resourceGroup": {
            "type": "string",
            "defaultValue": "[resourceGroup().name]",
            "metadata": {
                "description": "Specifies the resourceGroup of the event hub"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "variables": {
    },
    "resources": [{
            "type": "Microsoft.Kusto/Clusters/Databases/DataConnections",
            "apiVersion": "2022-02-01",
            "name": "[concat(parameters('Clusters_kustocluster_name'), '/', parameters('databases_kustodb_name'), '/', parameters('dataconnections_kustodc_name'))]",
            "location": "[parameters('location')]",
            "kind": "EventHub",
            "properties": {
                "managedIdentityResourceId": "[resourceId('Microsoft.Kusto/clusters', parameters('clusters_kustocluster_name'))]",
                "eventHubResourceId": "[resourceId(parameters('subscriptionId'), parameters('resourceGroup'), 'Microsoft.EventHub/namespaces/eventhubs', parameters('namespaces_eventhubns_name'), parameters('EventHubs_eventhubdemo_name'))]",
                "consumerGroup": "[parameters('consumergroup_default_name')]",
                "tableName": "[parameters('tables_kustotable_name')]",
                "mappingRuleName": "[parameters('mapping_kustomapping_name')]",
                "dataFormat": "[parameters('dataformat_type')]",
                "databaseRouting": "[parameters('databaseRouting_type')]"
            }
        }
    ]
}
```

---

## 3 - Clean up resources

### [Portal](#tab/portal)

### [Wizard](#tab/wizard)

To remove the event hub connection, select **Manage Data Connection** from the **Monitor** cards.

### [C#](#tab/c-sharp)

To remove the event hub connection, run the following command:

```c#
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```

### [Python](#tab/python)

To remove the event hub connection, run the following command:

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```

### [ARM template](#tab/arm-template)

---

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
