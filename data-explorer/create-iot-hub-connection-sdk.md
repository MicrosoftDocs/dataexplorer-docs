---
title: 'Create an IoT Hub data connection with SDKs - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from IoT Hub using SDKs.'
ms.topic: how-to
ms.date: 07/16/2023
---

# Create an IoT Hub data connection for Azure Data Explorer with SDKs

This article shows you how to ingest data into Azure Data Explorer from IoT Hub, a big data streaming platform and IoT ingestion service.

To learn how to create the connection using the Kusto SDKs, see [Create an IoT Hub data connection with SDKs](create-iot-hub-connection-sdk.md).

For general information about ingesting into Azure Data Explorer from IoT Hub, see [Connect to IoT Hub](ingest-data-iot-hub-overview.md).

> [!NOTE]
> Only events enqueued after you create the data connection are ingested.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/create-iot-hub-connection).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* An [IoT Hub](/azure/iot-hub/iot-hub-create-through-portal) with data for ingestion.

## Create an IoT Hub data connection

In this section, you'll establish a connection between the IoT Hub and your Azure Data Explorer table. As long as this connection is in place, data is transmitted from the IoT Hub into your target table.

### [C#](#tab/c-sharp)

1. Install the [Microsoft.Azure.Management.Kusto NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. [Create a Microsoft Entra application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You'll need the directory (tenant) ID, application ID, and client secret.

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
    var iotHubConnectionName = "myiothubconnect";
    //The IoT hub that is created as part of the Prerequisites
    var iotHubResourceId = new ResourceIdentifier("/subscriptions/<iotHubSubscriptionId>/resourceGroups/<iotHubResourceGroupName>/providers/Microsoft.Devices/IotHubs/<iotHubName>");
    var sharedAccessPolicyName = "iothubforread";
    var consumerGroup = "$Default";
    var location = AzureLocation.CentralUS;
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = KustoIotHubDataFormat.Csv;
    var databaseRouting = KustoDatabaseRouting.Multi;
    var iotHubConnectionData = new KustoIotHubDataConnection {
        IotHubResourceId = iotHubResourceId, ConsumerGroup = consumerGroup, SharedAccessPolicyName = sharedAccessPolicyName,
        Location = location, TableName = tableName, MappingRuleName = mappingRuleName,
        DataFormat = dataFormat, DatabaseRouting = databaseRouting
    };
    await dataConnections.CreateOrUpdateAsync(WaitUntil.Completed, iotHubConnectionName, iotHubConnectionData);
    ```

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
    | subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
    | clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
    | clientSecret | *PlaceholderClientSecret* | The client secret of the application that can access resources in your tenant. |
    | resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
    | clusterName | *mykustocluster* | The name of your cluster.|
    | databaseName | *mykustodatabase* | The name of the target database in your cluster.|
    | iotHubConnectionName | *myiothubconnect* | The desired name of your data connection.|
    | tableName | *StormEvents* | The name of the target table in the target database.|
    | mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
    | dataFormat | *csv* | The data format of the message.|
    | iotHubResourceId | *Resource ID* | The resource ID of your IoT hub that holds the data for ingestion. |
    | sharedAccessPolicyName | *iothubforread* | The name of the shared access policy that defines the permissions for devices and services to connect to IoT Hub. |
    | consumerGroup | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|
    | databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection is routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-iot-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-iot-hub-overview.md#events-routing). |

### [Python](#tab/python)

1. Install the required libraries.

    ```python
    pip install azure-common
    pip install azure-mgmt-kusto
    ```

1. [Create a Microsoft Entra application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You'll need the directory (tenant) ID, application ID, and client secret.

1. Run the following code.

    ```Python
    from azure.mgmt.kusto import KustoManagementClient
    from azure.mgmt.kusto.models import IotHubDataConnection
    from azure.common.credentials import ServicePrincipalCredentials
    
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
    
    resource_group_name = "testrg"
    #The cluster and database that are created as part of the Prerequisites
    cluster_name = "mykustocluster"
    database_name = "mykustodatabase"
    data_connection_name = "myeventhubconnect"
    #The IoT hub that is created as part of the Prerequisites
    iot_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Devices/IotHubs/xxxxxx";
    shared_access_policy_name = "iothubforread"
    consumer_group = "$Default"
    location = "Central US"
    #The table and column mapping that are created as part of the Prerequisites
    table_name = "StormEvents"
    mapping_rule_name = "StormEvents_CSV_Mapping"
    data_format = "csv"
    database_routing = "Multi"
    
    #Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
    poller = kusto_management_client.data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                                parameters=IotHubDataConnection(iot_hub_resource_id=iot_hub_resource_id, shared_access_policy_name=shared_access_policy_name,
                                                                                    consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format, database_routing=database_routing))
    ```

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
    | subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
    | client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
    | client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
    | resource_group_name | *testrg* | The name of the resource group containing your cluster.|
    | cluster_name | *mykustocluster* | The name of your cluster.|
    | database_name | *mykustodatabase* | The name of the target database in your cluster.|
    | data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
    | table_name | *StormEvents* | The name of the target table in the target database.|
    | mapping_rule_name | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
    | data_format | *csv* | The data format of the message.|
    | iot_hub_resource_id | *Resource ID* | The resource ID of your IoT hub that holds the data for ingestion.|
    | shared_access_policy_name | *iothubforread* | The name of the shared access policy that defines the permissions for devices and services to connect to IoT Hub. |
    | consumer_group | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|
    | database_routing | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection is routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-iot-hub-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-iot-hub-overview.md#events-routing). |

---

## Remove an IoT Hub data connection

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

## Related content

* [Query data in the Azure Data Explorer web UI](web-query-data.md)
