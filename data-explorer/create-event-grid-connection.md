---
title: 'Create an Event Grid data connection - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Grid.'
ms.topic: how-to
ms.date: 04/02/2023
---

# Create an Event Grid data connection

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hubs.

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).

## Connect to an Event Grid

In this section, you'll establish a connection between Event Grid and your Azure Data Explorer table.

### [Portal - Azure Data Explorer](#tab/portal-adx)

1. Under the cluster you created, select **Databases** > **TestDatabase**.

    :::image type="content" source="media/ingest-data-event-grid/select-test-database.png" alt-text="Screenshot of the Databases page, showing a database.":::

1. Select **Data ingestion** > **Add data connection**.

    :::image type="content" source="media/ingest-data-event-grid/data-ingestion-create.png" alt-text="Screenshot of the Data ingestion page, showing the add data connection option.":::

1. Under **Basics**, select the connection type: **Blob storage** and then fill out the form with the following information:

    :::image type="content" source="media/ingest-data-event-grid/data-connection-basics.png" alt-text="Screenshot of the Data Connection Basics tab, showing the options for the Blob storage connection type.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Storage account | *gridteststorage1* | The name of the storage account that you created previously.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

1. Select **Filter settings** if you want to track specific subjects. Set the filters for the notifications as follows:
    * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *startswith*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
        * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
        * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
    * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
    * **Case-Sensitive** field indicates whether the prefix and suffix filters are case-sensitive
    * For more information about filtering events, see [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).

    :::image type="content" source="media/ingest-data-event-grid/filter-settings.png" alt-text="Screenshot of the Filter settings form, showing the filter parameters.":::

1. Select **Next: Ingest properties**.

1. Fill out the form with the following information. Table and mapping names are case-sensitive:

   :::image type="content" source="media/ingest-data-event-grid/data-connection-ingest-properties.png" alt-text="Screenshot of the Data Connection Ingest properties tab, showing the target table properties.":::

    Ingest properties:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Allow routing the data to other databases (Multi database data connection) | Don't allow | Turn on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
    | Table name | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and Gzip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used. |
    | Advanced settings | *My data has headers* | Ignores headers. Supported for *SV type files.|

    > [!NOTE]
    > You don't have to specify all **Default routing settings**. Partial settings are also accepted.

1. Select **Next: Review + create**

1. Under ***Review + create**.
1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="media/ingest-data-event-grid/create-event-grid-data-connection-review-create.png" alt-text="Screenshot of the Data Connection Review and create tab, showing a summary of the selected data connection settings.":::

### [Portal - storage](#tab/portal-storage)

1. Browse to the storage account in the Azure portal. On the left menu, select **Events**
1. In the main pane, select the **Azure Data Explorer** tab.

    :::image type="content" source="media/ingest-data-event-grid/storage-account.png" alt-text="Screenshot of the Azure storage account Events page, showing the Azure Data Explorer tab.":::

The **Data connection** pane opens with the **Basics** tab selected.

1. Under **Basics**, fill out the form with the following information:

    :::image type="content" source="media/ingest-data-event-grid/portal-basics-tab.png" alt-text="Screenshot of the Data Connection Basics tab, showing the options for the connection type.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account | *gridteststorage1* | The storage account from which you accessed this wizard. Autopopulated.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

1. Select **Next> Ingest properties**.

1. Under **Ingest properties**.
1. Fill out the form with the following information. Table and mapping names are case-sensitive:

    :::image type="content" source="media/ingest-data-event-grid/portal-ingestion-tab.png" alt-text="Screenshot of the Data Connection Ingest properties tab, showing the subscription and data routing properties.":::

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription |  | Your Azure Data Explorer subscription.
    | Cluster Name | *TestCluster* | The name of the cluster in which you want to ingest data.
    | Database Name | *TestDatabase* | The target database you created in **TestCluster**.
    | Allow routing the data to other databases (Multi database data connection) | Don't allow | Turn on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
    | Table name | *TestTable* | The target table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and Gzip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used.|
    | Advanced settings | *My data has headers* | Ignores headers. Supported for *SV type files.|

   > [!NOTE]
   > You don't have to specify all **Data routing settings**. Partial settings are also accepted.

1. Select **Next: Review + create**

1. Under **Review + create**.
1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="media/ingest-data-event-grid/portal-review-create.png" alt-text="Screenshot of the Data Connection Review and create tab, showing a summary of the selected data connection settings.":::

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
    //The event hub and storage account that are created as part of the Prerequisites
    var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    var storageAccountResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx";
    var consumerGroup = "$Default";
    var location = "Central US";
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = DataFormat.CSV;
    var blobStorageEventType = "Microsoft.Storage.BlobCreated";
    var databaseRouting = "Multi";
    
    await kustoManagementClient.DataConnections.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, dataConnectionName,
        new EventGridDataConnection(storageAccountResourceId, eventHubResourceId, consumerGroup, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat, blobStorageEventType: blobStorageEventType, databaseRouting: databaseRouting));
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
    | eventHubResourceId | *Resource ID* | The resource ID of your event hub where the Event Grid is configured to send events. |
    | storageAccountResourceId | *Resource ID* | The resource ID of your storage account that holds the data for ingestion. |
    | consumerGroup | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|
    | blobStorageEventType | *Microsoft.Storage.BlobCreated* | The type of event that triggers ingestion. Supported events are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. Blob renaming is supported only for ADLSv2 storage.|
    | databaseRouting | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-grid-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |

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
    from azure.mgmt.kusto.models import EventGridDataConnection
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
    #The event hub and storage account that are created as part of the Prerequisites
    event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx"
    storage_account_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx"
    consumer_group = "$Default"
    location = "Central US"
    #The table and column mapping that are created as part of the Prerequisites
    table_name = "StormEvents"
    mapping_rule_name = "StormEvents_CSV_Mapping"
    data_format = "csv"
    database_routing = "Multi"
    blob_storage_event_type = "Microsoft.Storage.BlobCreated"
    
    #Returns an instance of LROPoller, check https://learn.microsoft.com/python/api/msrest/msrest.polling.lropoller?view=azure-python
    poller = kusto_management_client.data_connections.begin_create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                                parameters=EventGridDataConnection(storage_account_resource_id=storage_account_resource_id, event_hub_resource_id=event_hub_resource_id, 
                                                                                    consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format, database_routing=database_routing,
                                                                                    blob_storage_event_type=blob_storage_event_type))
    # The creation of the connection is async. Validation errors are only visible if you wait for the results.
    poller.wait()
    print(poller.result())
    ```

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
    | subscription_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
    | client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
    | client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
    | resource_group_name | *testrg* | The name of the resource group containing your cluster.|
    | cluster_name | *mykustocluster* | The name of your cluster.|
    | database_name | *mykustodatabase* | The name of the target database in your cluster.|
    | data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
    | table_name | *StormEvents* | The name of the target table in the target database.|
    | mapping_rule_name | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
    | database_routing | *Multi* or *Single* | The database routing for the connection. If you set the value to **Single**, the data connection will be routed to a single database in the cluster as specified in the *databaseName* setting. If you set the value to **Multi**, you can override the default target database using the *Database* [ingestion property](ingest-data-event-grid-overview.md#ingestion-properties). For more information, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
    | data_format | *csv* | The data format of the message.|
    | event_hub_resource_id | *Resource ID* | The resource ID of your event hub where the Event Grid is configured to send events. |
    | storage_account_resource_id | *Resource ID* | The resource ID of your storage account that holds the data for ingestion. |
    | consumer_group | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|
    | blob_storage_event_type | *Microsoft.Storage.BlobCreated* | The type of event that triggers ingestion. Supported events are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. Blob renaming is supported only for ADLSv2 storage.|

### [ARM template](#tab/arm-template)

The following example shows an Azure Resource Manager template for adding an Event Hubs data connection. You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_eventhubns_name": {
            "type": "string",
            "defaultValue": "eventhubns",
            "metadata": {
                "description": "Specifies the event hub namespace name."
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
        "StorageAccounts_storagedemo_name": {
            "type": "string",
            "defaultValue": "storagedemo",
            "metadata": {
                "description": "Specifies the storage account name"
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
                "description": "Specifies the subscriptionId of the resources"
            }
        },
        "resourceGroup": {
            "type": "string",
            "defaultValue": "[resourceGroup().name]",
            "metadata": {
                "description": "Specifies the resourceGroup of the resources"
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
            "kind": "EventGrid",
            "properties": {
                "managedIdentityResourceId": "[resourceId('Microsoft.Kusto/clusters', parameters('clusters_kustocluster_name'))]",
                "storageAccountResourceId": "[resourceId(parameters('subscriptionId'), parameters('resourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('StorageAccounts_storagedemo_name'))]",
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

## Remove an Event Grid connection

### [Portal](#tab/portal-2)

To remove the event hub connection from the Azure portal, do the following:

1. Go to your cluster. From the left menu, select **Databases**. Then, select the database that contains the target table.
1. From the left menu, select **Data connections**. Then, select the checkbox next to the relevant event hub data connection.
1. From the top menu bar, select **Delete**.

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
