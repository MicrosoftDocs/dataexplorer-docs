---
title: 'Create an IoT Hub data connection - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from IoT Hub.'
ms.topic: how-to
ms.date: 04/04/2023
---

# Create an IoT Hub data connection for Azure Data Explorer

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

    :::image type="content" source="media/ingest-data-iot-hub/select-database.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing a list of databases with testdb selected.":::

1. Select **Data connections** and **Add data connection**. From the dropdown, select **IoT Hub**.

    :::image type="content" source="media/ingest-data-iot-hub/add-data-connection.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing the Data Ingestion window with the Add data connection tab selected.":::

1. Fill out the form with the following information.

    |**Setting** | **Field description**|
    |---|---|
    | Data connection name | The name of the connection you want to create in Azure Data Explorer|
    | Subscription |  The subscription ID where the Event Hubs resource is located.  |
    | IoT Hub | IoT Hub name |
    | Shared access policy | The name of the shared access policy. Must have read permissions |
    | Consumer group |  The consumer group defined in the IoT Hub built-in endpoint |
    | Event system properties | The [IoT Hub event system properties](/azure/iot-hub/iot-hub-devguide-messages-construct#system-properties-of-d2c-iot-hub-messages). When adding system properties, [create](kusto/management/create-table-command.md) or [update](kusto/management/alter-table-command.md) table schema and [mapping](kusto/management/mappings.md) to include the selected properties.|

    :::image type="content" source="media/ingest-data-iot-hub/create-data-connection.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing the Data connection form.":::

    > [!NOTE]
    >
    > * Event system properties are supported for single-record events.
    > * For CSV mapping, properties are added at the beginning of the record. For JSON mapping, properties are added according to the name that appears in the drop-down list.

1. Depending on your use case, you may want to turn on multi-database routing. For more information about database routing, see [Events routing](ingest-data-iot-hub-overview.md#events-routing).

    :::image type="content" source="media/ingest-data-iot-hub/data-connection-allow-multi-database.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing the Data routing settings option set to allow.":::

1. Fill out the following routing settings:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table name | *TestTable* | The table you created in **testdb**. |
    | Data format | *JSON* | Supported formats are AVRO, CSV, JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHE AVRO, and W3CLOG.|
    | Mapping | *TestMapping* | The [mapping](kusto/management/mappings.md) you created in **testdb**, which maps incoming data to the column names and data types of **testdb**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used. |
    | | |

    :::image type="content" source="media/ingest-data-iot-hub/table-routing-settings.png" alt-text="Screenshot of the Azure Data Explorer Web UI, showing the default routing settings in the Target table form.":::

    > [!NOTE]
    >
    > * JSON data is parsed as multijson by default. Select **Ignore format errors** to ingest the data in strict JSON format.
    > * If you selected **Event system properties**, you must include [system properties](ingest-data-iot-hub-overview.md#system-properties) in the table schema and mapping.

1. Select **Create**.

> [!WARNING]
> In case of a [manual failover](/azure/iot-hub/iot-hub-ha-dr#manual-failover), recreate the data connection.

### [C#](#tab/c-sharp)

1. Install the [Microsoft.Azure.Management.Kusto NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. [Create an Azure AD application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You'll need the directory (tenant) ID, application ID, and client secret.

1. Run the following code.

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "PlaceholderClientSecret";//Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);
    
    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);
    
    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };
    
    var resourceGroupName = "testrg";
    //The cluster and database that are created as part of the Prerequisites
    var clusterName = "mykustocluster";
    var databaseName = "mykustodatabase";
    var dataConnectionName = "myeventhubconnect";
    //The IoT hub that is created as part of the Prerequisites
    var iotHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Devices/IotHubs/xxxxxx";
    var sharedAccessPolicyName = "iothubforread";
    var consumerGroup = "$Default";
    var location = "Central US";
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = DataFormat.CSV;
    var databaseRouting = "Multi";
    
    await kustoManagementClient.DataConnections.CreateOrUpdate(resourceGroupName, clusterName, databaseName, dataConnectionName,
                new IotHubDataConnection(iotHubResourceId, consumerGroup, sharedAccessPolicyName, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat, databaseRouting: databaseRouting));
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
    | dataConnectionName | *myeventhubconnect* | The desired name of your data connection.|
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

1. [Create an Azure AD application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You'll need the directory (tenant) ID, application ID, and client secret.

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

### [ARM template](#tab/arm-template)

The following example shows an Azure Resource Manager template for adding an IoT Hub data connection.  You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "IotHubs_iothubdemo_name": {
            "type": "string",
            "defaultValue": "iothubdemo",
            "metadata": {
                "description": "Specifies the IoT Hub name."
            }
        },
        "iothubpolices_iothubowner_name": {
            "type": "string",
            "defaultValue": "iothubowner",
            "metadata": {
                "description": "Specifies the shared access policy name."
            }
        },
        "consumergroup_default_name": {
            "type": "string",
            "defaultValue": "$Default",
            "metadata": {
                "description": "Specifies the consumer group of the IoT Hub."
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
                "description": "Specifies the subscriptionId of the IoT Hub"
            }
        },
        "resourceGroup": {
            "type": "string",
            "defaultValue": "[resourceGroup().name]",
            "metadata": {
                "description": "Specifies the resourceGroup of the IoT Hub"
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
            "apiVersion": "2019-09-07",
            "name": "[concat(parameters('Clusters_kustocluster_name'), '/', parameters('databases_kustodb_name'), '/', parameters('dataconnections_kustodc_name'))]",
            "location": "[parameters('location')]",
            "kind": "IotHub",
            "properties": {
                "iotHubResourceId": "[resourceId(parameters('subscriptionId'), parameters('resourceGroup'), 'Microsoft.Devices/IotHubs', parameters('IotHubs_iothubdemo_name'))]",
                "consumerGroup": "[parameters('consumergroup_default_name')]",
                "sharedAccessPolicyName": "[parameters('iothubpolices_iothubowner_name')]",
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

## Remove an IoT Hub data connection

### [Portal](#tab/portal-2)

To remove the IoT Hub connection from the Azure portal, do the following:

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
