---
title: 'Create an Event Hubs data connection with SDKs - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Hubs using SDKs.'
ms.topic: how-to
ms.custom:
ms.date: 07/16/2023
---

# Create an Event Hubs data connection for Azure Data Explorer with SDKs

Azure Data Explorer offers ingestion from [Event Hubs](/azure/event-hubs/event-hubs-about), a big data streaming platform and event ingestion service. Event Hubs can process millions of events per second in near real time.

In this article, you connect to an event hub and ingest data into Azure Data Explorer. For an overview on ingesting from Event Hubs, see [Azure Event Hubs data connection](ingest-data-event-hub-overview.md).

To learn how to create the connection in the Azure Data Explorer web UI, Azure portal, or with an ARM template, see [Create an Event Hubs data connection](create-event-hubs-connection.md).

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/create-event-hubs-connection).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [event hub](/azure/event-hubs/event-hubs-create) with data for ingestion.

## Create an event hub data connection

In this section, you establish a connection between the event hub and your Azure Data Explorer table. As long as this connection is in place, data is transmitted from the event hub into your target table. If the event hub is moved to a different resource or subscription, you need to update or recreate the connection.

### [C#](#tab/c-sharp)

1. Install the [Microsoft.Azure.Management.Kusto NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. [Create a Microsoft Entra application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You need the directory (tenant) ID, application ID, and client secret.

1. Run the following code.

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Application ID
    var clientSecret = "PlaceholderClientSecret"; //Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    var resourceManagementClient = new ArmClient(credentials, subscriptionId);
    var resourceGroupName = "testrg";
    //The cluster and database that are created as part of the Prerequisites
    var clusterName = "mykustocluster";
    var databaseName = "mykustodatabase";
    var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
    var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
    var cluster = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value;
    var database = (await cluster.GetKustoDatabaseAsync(databaseName)).Value;
    var dataConnections = database.GetKustoDataConnections();
    var eventHubConnectionName = "myeventhubconnect";
    //The event hub that is created as part of the Prerequisites
    var eventHubResourceId = new ResourceIdentifier("/subscriptions/<eventHubSubscriptionId>/resourceGroups/<eventHubResourceGroupName>/providers/Microsoft.EventHub/namespaces/<eventHubNamespaceName>/eventhubs/<eventHubName>");
    var consumerGroup = "$Default";
    var location = AzureLocation.CentralUS;
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = KustoEventHubDataFormat.Csv;
    var compression = EventHubMessagesCompressionType.None;
    var databaseRouting = KustoDatabaseRouting.Multi;
    var eventHubConnectionData = new KustoEventHubDataConnection
    {
        EventHubResourceId = eventHubResourceId, ConsumerGroup = consumerGroup,
        Location = location, TableName = tableName, MappingRuleName = mappingRuleName,
        DataFormat = dataFormat, Compression = compression, DatabaseRouting = databaseRouting
    };
    await dataConnections.CreateOrUpdateAsync(WaitUntil.Completed, eventHubConnectionName, eventHubConnectionData);
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

1. Install the required libraries.

    ```python
    pip install azure-common
    pip install azure-mgmt-kusto
    ```

1. [Create a Microsoft Entra application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You need the directory (tenant) ID, application ID, and client secret.

1. Run the following code.

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

---

## Remove an event hub data connection

### [C#](#tab/c-sharp-2)

To remove the event hub connection, run the following command:

```c#
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```

### [Python](#tab/python-2)

To remove the event hub connection, run the following command:

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```

---

## Related content

* Check the connection with the [Event hub sample message app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest)
* [Query data in the Web UI](web-ui-query-overview.md)
