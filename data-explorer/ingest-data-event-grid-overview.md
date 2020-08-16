---
title: Ingest from storage using Event Grid subscription - Azure Data Explorer
description: This article describes Ingest from storage using Event Grid subscription in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 08/13/2020
---
# Connect to Event Grid

Event Grid is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created notifications and streaming these notifications to Azure Data Explorer via an Event Hub.

The Event Grid ingestion pipeline goes through several steps. You create a target table and in Azure Data Explorer to which the [data in a particular format](#data-format) will be ingested. Then you create an Event Grid data connection in Azure Data Explorer. The Event Grid data connection needs to know [events routing](#set-events-routing) information, such as what table to send the data to and the table mapping. You also specify [ingestion properties](#set-ingestion-properties), which describe the data to be ingested, the target table, and the mapping. This process can be managed through the [Azure portal](ingest-data-event-grid.md), programatically with [C#](data-connection-event-grid-csharp.md) or [Python](data-connection-event-grid-python.md), or with the [Azure Resource Manager template](data-connection-event-grid-resource-manager.md).

## Data format

* See [supported formats](ingestion-supported-formats.md).
* See [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).
  * The original uncompressed data size should be part of the blob metadata, or else Azure Data Explorer will estimate it.  The ingestion uncompressed size limit per file is 4 GB.
 
## Set ingestion properties

You can specify [ingestion properties](ingestion-properties.md) of the blob ingestion via the blob metadata.
You can set the following properties:

[!INCLUDE [ingestion-properties-event-grid](includes/ingestion-properties-event-grid.md)]

## Set events routing

When setting up a blob storage connection to Azure Data Explorer cluster, specify target table properties:
* table name
* data format
* mapping

This setup is the default routing for your data, sometimes referred to as `static routing`.
You can also specify target table properties for each blob, using blob metadata. The data will dynamically route, as specified by [ingestion properties](#set-ingestion-properties).

The following example shows you how to set ingestion properties on the blob metadata before uploading it. Blobs are routed to different tables.

For more information, see [generate data](#generate-data).

```csharp
// Blob is dynamically routed to table `Events`, ingested using `EventsMapping` data mapping
blob = container.GetBlockBlobReference(blobName2);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoTable", "Events");
blob.Metadata.Add("kustoDataFormat", "json");
blob.Metadata.Add("kustoIngestionMappingReference", "EventsMapping");
blob.UploadFromFile(jsonCompressedLocalFileName);
```

### Generate data

> [!NOTE]
> Use `BlockBlob` to generate data. `AppendBlob` is not supported.

You can create a blob from a local file, set ingestion properties to the blob metadata, and upload it as follows:

 ```csharp
 var azureStorageAccountConnectionString=<storage_account_connection_string>;

var containerName=<container_name>;
var blobName=<blob_name>;
var localFileName=<file_to_upload>;

// Create the container
var azureStorageAccount = CloudStorageAccount.Parse(azureStorageAccountConnectionString);
var blobClient = azureStorageAccount.CreateCloudBlobClient();
var container = blobClient.GetContainerReference(containerName);
container.CreateIfNotExists();

// Set ingestion properties in blob metadata and upload the blob
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoIgnoreFirstRecord", "true"); // First line of this csv file are headers
blob.UploadFromFile(csvCompressedLocalFileName);
```

> [!NOTE]
> Using Azure Data Lake Gen2 storage SDK requires using `CreateFile` for uploading files and `Flush` at the end with the close parameter set to "true".
> For a detailed example of Data Lake Gen2 SDK correct usage, see [upload file using Azure Data Lake SDK](data-connection-event-grid-csharp.md#upload-file-using-azure-data-lake-sdk).

## Delete blobs using storage lifecycle

Azure Data Explorer won't delete the blobs after ingestion. Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage your blob deletion. It's recommended to keep the blobs for three to five days.

## Known Event Grid issues

* When using Azure Data Explorer to [export](kusto/management/data-export/export-data-to-storage.md) the files used for event grid ingestion, note: 
    * Event Grid notifications aren't triggered if the connection string provided to the export command or the connection string provided to an [external table](kusto/management/data-export/export-data-to-an-external-table.md) is a connecting string in [ADLS Gen2 format](kusto/api/connection-strings/storage.md#azure-data-lake-store) (for example, `abfss://filesystem@accountname.dfs.core.windows.net`) but the storage account isn't enabled for hierarchical namespace. 
    * If the account isn't enabled for hierarchical namespace, connection string must use the [Blob Storage](kusto/api/connection-strings/storage.md#azure-storage-blob) format (for example, `https://accountname.blob.core.windows.net`). The export works as expected even when using the ADLS Gen2 connection string, but notifications won't be triggered and Event Grid ingestion won't work.

## Next steps

* [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md)
* [Create an Event Hub data connection for Azure Data Explorer by using C#](data-connection-event-hub-csharp.md)
* [Create an Event Grid data connection for Azure Data Explorer by using Python](data-connection-event-grid-python.md)
* [Create an Event Grid data connection for Azure Data Explorer by using Azure Resource Manager template](data-connection-event-grid-resource-manager.md)
