---
title: 'Use an Event Grid data connection - Azure Data Explorer'
description: 'In this article, you learn how to use an Event Grid data connection in Azure Data Explorer.'
ms.topic: how-to
ms.date: 06/01/2023
---

# Use an Event Grid data connection

This article shows how to use an Event Grid data connection in Azure Data Explorer. You'll programmatically upload data to Azure Blob Storage or Azure Data Lake. This upload triggers the Event Grid data connection, causing the data to be ingested into your Azure Data Explorer cluster.

## Prerequisites

* [Create an Event Grid data connection](create-event-grid-connection.md)

## Use the connection

Select the relevant tab for your Event Grid data connection.

### [Azure Blob Storage](#tab/azure-blob-storage)

The following steps use the [Azure Blob Storage SDK](https://www.nuget.org/packages/Azure.Storage.Blobs/) to upload a file to Azure Blob Storage. The upload triggers the Event Grid data connection, which ingests the data into Azure Data Explorer.

1. Define variables for use in the following steps.

    ```csharp
    var azureStorageAccountConnectionString=<storage_account_connection_string>;
    var containerName = <container_name>;
    var blobName = <blob_name>;
    var localFileName = <file_to_upload>;
    var uncompressedSizeInBytes = <uncompressed_size_in_bytes>;
    var mapping = <mappingReference>;
    ```

1. Create a new container in your storage account.

    ```csharp
    var azureStorageAccount = CloudStorageAccount.Parse(azureStorageAccountConnectionString);
    var blobClient = azureStorageAccount.CreateCloudBlobClient();
    var container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExists();
    ```

1. Set metadata and upload a file to the blob.

    ```csharp
    var blob = container.GetBlockBlobReference(blobName);
    blob.Metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
    blob.Metadata.Add("kustoIngestionMappingReference", mapping);
    blob.UploadFromFile(localFileName);
    ```

1. Confirm success of the upload by listing the blobs in your container.

    ```csharp
    var blobs = container.ListBlobs();
    ```

1. Check Azure Data Explorer to see that the content was ingested into your cluster.

> [!NOTE]
> Azure Data Explorer won't delete the blobs post ingestion. Retain the blobs for three to five days by using [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.

### [Azure Data Lake](#tab/azure-data-lake)

The following steps use the [Azure Data Lake SDK](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) to upload a file to Data Lake Storage Gen2. The upload triggers the Event Grid data connection, which ingests the data into Azure Data Explorer.

1. Define variables for use in the following steps.

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
    ```

1. Create the filesystem.

    ```csharp
    var dataLakeFileSystemClient = dataLakeServiceClient.CreateFileSystem(fileSystemName).Value;
    ```

1. Define file metadata and uploading options.

    ```csharp
    IDictionary<String, String> metadata = new Dictionary<string, string>();
    metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
    metadata.Add("kustoIngestionMappingReference", mapping);
    var uploadOptions = new DataLakeFileUploadOptions
    {
        Metadata = metadata,
        Close = true // Note: The close option triggers the event being processed by the data connection
    };
    ```

    > [!NOTE]
    > When uploading a file using the Azure Data Lake SDK, the initial file creation event has a size of 0, which is ignored by Azure Data Explorer during data ingestion. To ensure proper ingestion, set the *close* parameter to `true` in the upload file code snippet. By doing so, the upload method triggers a *FlushAndClose* event, indicating that the final update has been made and the file stream is closed.

1. Write to the file.

    ```csharp
    var dataLakeFileClient = dataLakeFileSystemClient.GetFileClient(fileName);
    dataLakeFileClient.Upload(localFileName, uploadOptions);
    ```

1. Check Azure Data Explorer to see that the content was ingested into your cluster.

> [!NOTE]
> To reduce traffic coming from Event Grid and the subsequent processing when ingesting events into Azure Data Explorer, we highly recommend [filtering](ingest-data-event-grid-manual.md#create-an-event-grid-subscription) the *data.api* key to only include *FlushAndClose* events, thereby removing file creation events with size 0. For more information about flushing, see [Azure Data Lake flush method](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flush).

### Ingest renamed blobs

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

## Next steps

* [Query data in the Web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
