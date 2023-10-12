---
title: 'Create an Event Grid data connection with SDKs - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Grid using the Kusto SDKs.'
ms.topic: how-to
ms.date: 07/16/2023
---

# Create an Event Grid data connection for Azure Data Explorer with SDKs

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hubs.

To learn how to create the connection in the Azure portal or with an ARM template, see [Create an Event Grid data connection](create-event-grid-connection.md).

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md).

> [!NOTE]
> To achieve the best performance with the Event Grid connection, set the `rawSizeBytes` ingestion property via the blob metadata. For more information, see [ingestion properties](ingest-data-event-grid-overview.md#ingestion-properties).

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/create-event-grid-connection).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).
* Have the [Event Grid resource provider registered](/azure/event-grid/blob-event-quickstart-portal#register-the-event-grid-resource-provider).

## Create an Event Grid data connection

In this section, you'll establish a connection between Event Grid and your Azure Data Explorer table.

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
    var eventGridConnectionName = "myeventgridconnect";
    //The event hub and storage account that are created as part of the Prerequisites
    var eventHubResourceId = new ResourceIdentifier("/subscriptions/<storageAccountSubscriptionId>/resourceGroups/<storageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>");
    var storageAccountResourceId = new ResourceIdentifier("/subscriptions/<eventHubSubscriptionId>/resourceGroups/<eventHubResourceGroupName>/providers/Microsoft.EventHub/namespaces/<eventHubNamespaceName>/eventhubs/<eventHubName>");
    var consumerGroup = "$Default";
    var location = AzureLocation.CentralUS;
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = KustoEventGridDataFormat.Csv;
    var blobStorageEventType = BlobStorageEventType.MicrosoftStorageBlobCreated;
    var databaseRouting = KustoDatabaseRouting.Multi;
    var eventGridConnectionData = new KustoEventGridDataConnection
    {
        StorageAccountResourceId = storageAccountResourceId, EventHubResourceId = eventHubResourceId,
        ConsumerGroup = consumerGroup, TableName = tableName, Location = location, MappingRuleName = mappingRuleName,
        DataFormat = dataFormat, BlobStorageEventType = blobStorageEventType, DatabaseRouting = databaseRouting
    };
    await dataConnections.CreateOrUpdateAsync(WaitUntil.Completed, eventGridConnectionName, eventGridConnectionData);
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
    | eventGridConnectionName | *myeventgridconnect* | The desired name of your data connection.|
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

1. [Create a Microsoft Entra application principal](/azure/active-directory/develop/howto-create-service-principal-portal) to use for authentication. You'll need the directory (tenant) ID, application ID, and client secret.

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

---

## Use the Event Grid data connection

This section shows how to trigger ingestion from Azure Blob Storage or Azure Data Lake Gen 2 to your cluster following blob creation or blob renaming.

Select the relevant tab based on the type of storage SDK used to upload blobs.

### [Azure Blob Storage](#tab/azure-blob-storage)

The following code sample uses the [Azure Blob Storage SDK](https://www.nuget.org/packages/Azure.Storage.Blobs/) to upload a file to Azure Blob Storage. The upload triggers the Event Grid data connection, which ingests the data into Azure Data Explorer.

```csharp
var azureStorageAccountConnectionString=<storage_account_connection_string>;
var containerName = <container_name>;
var blobName = <blob_name>;
var localFileName = <file_to_upload>;
var uncompressedSizeInBytes = <uncompressed_size_in_bytes>;
var mapping = <mappingReference>;
// Create a new container in your storage account.
var azureStorageAccount = CloudStorageAccount.Parse(azureStorageAccountConnectionString);
var blobClient = azureStorageAccount.CreateCloudBlobClient();
var container = blobClient.GetContainerReference(containerName);
container.CreateIfNotExists();
// Set metadata and upload a file to the blob.
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
blob.Metadata.Add("kustoIngestionMappingReference", mapping);
blob.UploadFromFile(localFileName);
// Confirm success of the upload by listing the blobs in your container.
var blobs = container.ListBlobs();
```

> [!NOTE]
> Azure Data Explorer won't delete the blobs post ingestion. Retain the blobs for three to five days by using [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.

### [Azure Data Lake](#tab/azure-data-lake)

The following code sample uses the [Azure Data Lake SDK](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) to upload a file to Data Lake Storage Gen2. The upload triggers the Event Grid data connection, which ingests the data into Azure Data Explorer.

```csharp
var accountName = <storage_account_name>;
var accountKey = <storage_account_key>;
var fileSystemName = <file_system_name>;
var fileName = <file_name>;
var localFileName = <file_to_upload>;
var uncompressedSizeInBytes = <uncompressed_size_in_bytes>;
var mapping = <mapping_reference>;
var sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
var dfsUri = "https://" + accountName + ".dfs.core.windows.net";
var dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), sharedKeyCredential);
// Create the filesystem.
var dataLakeFileSystemClient = dataLakeServiceClient.CreateFileSystem(fileSystemName).Value;
// Define file metadata and uploading options.
IDictionary<String, String> metadata = new Dictionary<string, string>();
metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
metadata.Add("kustoIngestionMappingReference", mapping);
var uploadOptions = new DataLakeFileUploadOptions
{
    Metadata = metadata,
    Close = true // Note: The close option triggers the event being processed by the data connection.
};
// Write to the file.
var dataLakeFileClient = dataLakeFileSystemClient.GetFileClient(fileName);
dataLakeFileClient.Upload(localFileName, uploadOptions);
```

> [!NOTE]
>
> * When uploading a file with the Azure Data Lake SDK, the initial file creation event has a size of 0, which is ignored by Azure Data Explorer during data ingestion. To ensure proper ingestion, set the `Close` parameter to `true`. This parameter causes the upload method to trigger a *FlushAndClose* event, indicating that the final update has been made and the file stream is closed.
> * To reduce traffic coming from Event Grid and the subsequent processing when ingesting events into Azure Data Explorer, we recommend [filtering](ingest-data-event-grid-manual.md#create-an-event-grid-subscription) the *data.api* key to only include *FlushAndClose* events, thereby removing file creation events with size 0. For more information about flushing, see [Azure Data Lake flush method](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flush).

### Rename blobs

In ADLSv2, it's possible to rename directories. However, it's important to note that renaming a directory doesn't trigger blob renamed events or initiate the ingestion of blobs contained within the directory. If you want to ensure the ingestion of blobs after renaming a directory, you should directly rename the individual blobs within the directory.

The following code sample shows how to rename a blob in an ADLSv2 storage account.

```csharp
var accountName = <storage_account_name>;
var accountKey = <storage_account_key>;
var fileSystemName = <file_system_name>;
var sourceFilePath = <source_file_path>;
var destinationFilePath = <destination_file_path>;
var sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
var dfsUri = "https://" + accountName + ".dfs.core.windows.net";
var dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), sharedKeyCredential);
// Get a client to the the filesystem
var dataLakeFileSystemClient = dataLakeServiceClient.GetFileSystemClient(fileSystemName);
// Rename a file in the file system
var dataLakeFileClient = dataLakeFileSystemClient.GetFileClient(sourceFilePath);
dataLakeFileClient.Rename(destinationFilePath);
```

> [!NOTE]
> If you defined filters to track specific subjects while [creating the data connection](ingest-data-event-grid.md) or while creating [Event Grid resources manually](ingest-data-event-grid-manual.md#create-an-event-grid-subscription), these filters are applied on the destination file path.

---

> [!NOTE]
> Triggering ingestion following a `CopyBlob` operation is not supported for storage accounts that have the hierarchical namespace feature enabled on them.

## Remove an Event Grid data connection

### [C#](#tab/c-sharp-2)

To remove the Event Grid connection, run the following command:

```c#
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```

### [Python](#tab/python-2)

To remove the Event Grid connection, run the following command:

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```

---

## Next steps

* [Process data from your event hub using Azure Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics)
