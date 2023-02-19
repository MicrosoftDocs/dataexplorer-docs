---
title: 'Create an Event Grid data connection for Azure Data Explorer by using C#'
description: In this article, you learn how to create an Event Grid data connection for Azure Data Explorer by using C#.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 07/31/2022
---

# Create an Event Grid data connection for Azure Data Explorer by using C\#

> [!div class="op_single_selector"]
> * [Ingestion wizard](./ingestion-wizard-new-table.md)
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]
 In this article, you create an Event Grid data connection for Azure Data Explorer by using C#.

## Prerequisites

* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* A A [table and column mapping](./net-sdk-ingest-data.md#create-a-table-on-your-test-cluster).
* A [storage account with an Event Grid subscription](ingest-data-event-grid.md).

[!INCLUDE [data-explorer-data-connection-install-nuget-csharp](includes/data-explorer-data-connection-install-nuget-csharp.md)]

[!INCLUDE [data-explorer-authentication](includes/data-explorer-authentication.md)]

## Add an Event Grid data connection

The following example shows you how to add an Event Grid data connection programmatically. See [create an Event Grid data connection in Azure Data Explorer](ingest-data-event-grid.md) for adding an Event Grid data connection using the Azure portal.

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

## Generate sample data

Now that Azure Data Explorer and the storage account are connected, you can create a sample data and upload it to the storage.

> [!NOTE]
> Azure Data Explorer won't delete the blobs post ingestion. Retain the blobs for three to five days by using [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.

### Upload file using Azure Blob Storage SDK

The following code snippet creates a new container in your storage account, uploads an existing file (as a blob) to that container, and then lists the blobs in the container.

```csharp
var azureStorageAccountConnectionString=<storage_account_connection_string>;

var containerName = <container_name>;
var blobName = <blob_name>;
var localFileName = <file_to_upload>;
var uncompressedSizeInBytes = <uncompressed_size_in_bytes>;
var mapping = <mappingReference>;

// Creating the container
var azureStorageAccount = CloudStorageAccount.Parse(azureStorageAccountConnectionString);
var blobClient = azureStorageAccount.CreateCloudBlobClient();
var container = blobClient.GetContainerReference(containerName);
container.CreateIfNotExists();

// Set metadata and upload file to blob
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
blob.Metadata.Add("kustoIngestionMappingReference", mapping);
blob.UploadFromFile(localFileName);

// List blobs
var blobs = container.ListBlobs();
```

### Upload file using Azure Data Lake SDK

When working with Data Lake Storage Gen2, you can use [Azure Data Lake SDK](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) to upload files to storage. The following code snippet uses Azure.Storage.Files.DataLake v12.5.0 to create a new filesystem in Azure Data Lake storage and to upload a local file with metadata to that filesystem.

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

// Create the filesystem
var dataLakeFileSystemClient = dataLakeServiceClient.CreateFileSystem(fileSystemName).Value;

// Define metadata
IDictionary<String, String> metadata = new Dictionary<string, string>();
metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
metadata.Add("kustoIngestionMappingReference", mapping);

// Set uploading options
var uploadOptions = new DataLakeFileUploadOptions
{
    Metadata = metadata,
    Close = true // Note: The close option triggers the event being processed by the data connection
};

// Write to the file
var dataLakeFileClient = dataLakeFileSystemClient.GetFileClient(fileName);
dataLakeFileClient.Upload(localFileName, uploadOptions);
```

> [!NOTE]
> When using the [Azure Data Lake SDK](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) to upload a file, the file creation triggers an Event Grid event with size 0, which Azure Data Explorer ignores when ingesting the data. File flushing with the *close* parameter set to *true* triggers another event indicating that this is the final update and the file stream has been closed. This *FlushAndClose* event is processed by Azure Data Explorer during ingestion. In the upload file code snippet, the *Close* parameter is set to *true* causing the Upload method to trigger the *FlushAndClose* event.
To reduce traffic coming from Event Grid and the subsequent processing when ingesting events into Azure Data Explorer, we highly recommend [filtering](ingest-data-event-grid-manual.md#create-an-event-grid-subscription) the *data.api* key to only include *FlushAndClose* events, thereby removing file creation events with size 0. For more information about flushing, see [Azure Data Lake flush method](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flush).

### Rename file using Azure Data Lake SDK

The following code snippet uses [Azure Data Lake SDK](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) to rename a blob in an ADLSv2 storage account.

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
> * Directory renaming is possible in ADLSv2, but it doesn't trigger *blob renamed* events and ingestion of blobs inside the directory. To ingest blobs following renaming, directly rename the desired blobs.
> * If you defined filters to track specific subjects while [creating the data connection](ingest-data-event-grid.md) or while creating [Event Grid resources manually](ingest-data-event-grid-manual.md#create-an-event-grid-subscription), these filters are applied on the destination file path.

[!INCLUDE [data-explorer-data-connection-clean-resources-csharp](includes/data-explorer-data-connection-clean-resources-csharp.md)]