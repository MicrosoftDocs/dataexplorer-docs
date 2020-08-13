---
title: Ingest from storage using Event Grid subscription - Azure Data Explorer
description: This article describes Ingest from storage using Event Grid subscription in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/01/2020
---
# Ingest from storage using Event Grid subscription

Event Grid is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created notifications and streaming these notifications to Azure Data Explorer via an Event Hub.

The Event Grid ingestion pipeline goes through several steps. You create a target table and in Azure Data Explorer to which the data will be ingested. Then you create an Event Grid data connection in Azure Data Explorer. The Event Grid data connection needs to know [events routing](#events-routing) information, such as what table to send the data to and the table mapping. You also specify [ingestion properties](#ingestion-properties), which describe the data to be ingested, the target table, and the mapping. This process can be managed through the Azure portal, the Azure Resource Manager template, or programatically with C# or Python.

For a walkthrough of how to set up an Event Grid subscription in the Azure portal, see [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md).

## Ingestion properties

You can specify [Ingestion properties](ingestion-properties.md) of the blob ingestion via the blob metadata.
You can set the following properties:

[!INCLUDE [ingestion-properties-event-grid](includes/ingestion-properties-event-grid.md)]

## Events routing

When setting up a blob storage connection to Azure Data Explorer cluster, specify target table properties:
* table name
* data format
* mapping

This setup is the default routing for your data, sometimes referred to as `static routing`.
You can also specify target table properties for each blob, using blob metadata. The data will dynamically route, as specified by [ingestion properties](#ingestion-properties).

Following is an example for setting ingestion properties to the blob metadata before uploading it. 
Blobs are routed to different tables.

For more information on how to generate data, see [sample code](#generating-data).

```csharp
// Blob is dynamically routed to table `Events`, ingested using `EventsMapping` data mapping
blob = container.GetBlockBlobReference(blobName2);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoTable", "Events");
blob.Metadata.Add("kustoDataFormat", "json");
blob.Metadata.Add("kustoIngestionMappingReference", "EventsMapping");
blob.UploadFromFile(jsonCompressedLocalFileName);
```

### Generating data

> [!NOTE]
> Use `BlockBlob` to generate data. `AppendBlob` is not supported.

Following is an example to create a blob from local file, set ingestion properties to the blob metadata, and upload it:

 ```csharp
 var azureStorageAccountConnectionString=<storage_account_connection_string>;

var containerName=<container_name>;
var blobName=<blob_name>;
var localFileName=<file_to_upload>;

// Creating the container
var azureStorageAccount = CloudStorageAccount.Parse(azureStorageAccountConnectionString);
var blobClient = azureStorageAccount.CreateCloudBlobClient();
var container = blobClient.GetContainerReference(containerName);
container.CreateIfNotExists();

// Set ingestion properties in blob's metadata & uploading the blob
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoIgnoreFirstRecord", "true"); // First line of this csv file are headers
blob.UploadFromFile(csvCompressedLocalFileName);
```

> [!NOTE]
> Using Azure Data Lake Gen2 storage SDK requires using `CreateFile` for uploading files and `Flush` at the end with the close parameter set to "true".
> For a detailed example of how to use Data Lake Gen2 SDK correctly, see [upload file using Azure Data Lake SDK](data-connection-event-grid-csharp.md#upload-file-using-azure-data-lake-sdk).


## Data format

* Blobs can be in any of the [supported formats](ingestion-supported-formats.md).
* Blobs can be compressed. For more information, see [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).
  * The original uncompressed data size should be part of the blob metadata. If the uncompressed size isn't specified, Azure Data Explorer will estimate it, based on the file size.  There's an ingestion uncompressed size limit per file of 4 GB.
 
## Blob lifecycle

Azure Data Explorer won't delete the blobs after ingestion. Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage your blob deletion. It's recommended to keep the blobs for three to five days.

## Known issues

* When using Azure Data Explorer to [export](kusto/management/data-export/export-data-to-storage.md) the files used for event grid ingestion, note: 
    * Event Grid notifications aren't triggered if the connection string provided to the export command or the connection string provided to an [external table](kusto/management/data-export/export-data-to-an-external-table.md) is a connecting string in [ADLS Gen2 format](kusto/api/connection-strings/storage.md#azure-data-lake-store) (for example, `abfss://filesystem@accountname.dfs.core.windows.net`) but the storage account isn't enabled for hierarchical namespace. 
    * If the account isn't enabled for hierarchical namespace, connection string must use the [Blob Storage](kusto/api/connection-strings/storage.md#azure-storage-blob) format (for example, `https://accountname.blob.core.windows.net`). The export works as expected even when using the ADLS Gen2 connection string, but notifications won't be triggered and Event Grid ingestion won't work.
