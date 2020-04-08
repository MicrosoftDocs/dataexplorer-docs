---
title: Ingest from storage using Event Grid subscription - Azure Data Explorer | Microsoft Docs
description: This article describes Ingest from storage using Event Grid subscription in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
---
# Ingest from storage using Event Grid subscription

Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) subscription for blob created notifications and streaming these notifications to Kusto via an Event Hub.

## Data format

* Blobs can be in any of the [supported formats](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats).
* Blobs can be compressed in any of the [ supported compressions](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats#supported-data-compression-formats)

> [!NOTE]
> Ideally the original uncompressed data size should be part of the blob metadata.
> If uncompressed size is not specified, Azure Data Explorer will estimate it based on the file size. 
> Provide original data size by setting the `rawSizeBytes` [property](#ingestion-properties) on the blob metadata to **uncompressed** data size in bytes.
> Please note that there is an ingestion uncompressed size limit per file of 4GB.

## Ingestion properties

You can specify [Ingestion properties](https://docs.microsoft.com/azure/data-explorer/ingestion-properties) of the blob ingestion via the blob metadata.
You can set the following properties:

|Property | Description|
|---|---|
| rawSizeBytes | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, this is the size before format-specific compression is applied.|
| kustoTable |  Name of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| kustoDataFormat |  Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| kustoIngestionMappingReference |  Name of the existing ingestion mapping to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| kustoIgnoreFirstRecord | If set to `true`, Azure Data Explorer ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| kustoExtentTags | String representing [tags](../extents-overview.md#extent-tagging) that will be attached to resulting extent. |
| kustoCreationTime |  Overrides [$IngestionTime](../../query/ingestiontimefunction.md?pivots=azuredataexplorer) for the blob, formatted as a ISO 8601 string. Use for backfilling. |

## Events routing

When setting up a blob storage connection to Azure Data Explorer cluster, specify target table properties (table name, data format and mapping). This is the default routing for your data, also refered to as `static routig`.
You can also specify target table properties for each blob, using blob metadata. The data will be dynamically routed as specified by [ingestion properties](#ingestion-properties).

Following is an example for setting ingestion properties to the blob metadata before uploading it. 
Blobs are routed to different tables.

Please refer to the [sample code](#generating-data) for more details on how to generate data.

 ```csharp
// Blob is dynamically routed to table `Events`, ingested using `EventsMapping` data mapping
blob = container.GetBlockBlobReference(blobName2);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoTable", "Events");
blob.Metadata.Add("kustoDataFormat", "json");
blob.Metadata.Add("kustoIngestionMappingReference", "EventsMapping");
blob.UploadFromFile(jsonCompressedLocalFileName);
```

## Create Event Grid subscription

> [!Note]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Prerequisites

* [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account). 
  Event Grid notification subscription can be set on Azure Storage Accounts of kind `BlobStorage` or `StorageV2`. 
  Enabling [Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction) is also supported.
* [Create an event hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-create).

### Event Grid subscription

* Kusto selected `Event Hub` as the endpoind type, used for transporting blob storage events notifications. `Event Grid schema` is the selected schema for notifications. Note that each Even Hub can serve one connection.
* The blob storage subscription connection handles notifications of type `Microsoft.Storage.BlobCreated`. Make sure to select it when creating the subscription. Note that other types of notifications, if selected, are ignored.
* One subscription can notify on storage events in one container or more. If you want to track files from a specific container(s), set the filters for the notifications as follows:
When setting up a connection, take a speciel care of the following values: 
   * **Subject Begins With** filter is the *literal* prefix of the blob container. As the pattern applied is *startswith*, it can span multiple containers. No wildcards are allowed.
     It *must* be set as follows: *`/blobServices/default/containers/<prefix>`*. For example: */blobServices/default/containers/StormEvents-2020-*
   * **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed. Useful for filtering file extensions.

A detailed walk-through can be found in the how-to [Create an Event Grid subscription in your storage account](https://docs.microsoft.com/azure/data-explorer/ingest-data-event-grid#create-an-event-grid-subscription-in-your-storage-account) guide.

### Data ingestion connection to Azure Data Explorer

* Via Azure Portal: [Create an Event Grid data connection in Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-data-event-grid#create-an-event-grid-data-connection-in-azure-data-explorer).
* Using Kusto management .NET SDK: [Add an Event Grid data connection](https://docs.microsoft.com/azure/data-explorer/data-connection-event-grid-csharp#add-an-event-grid-data-connection)
* Using Kusto management Python SDK: [Add an Event Grid data connection](https://docs.microsoft.com/azure/data-explorer/data-connection-event-grid-python#add-an-event-grid-data-connection)
* With ARM template: [Azure Resource Manager template for adding an Event Grid data connection](https://docs.microsoft.com/azure/data-explorer/data-connection-event-grid-resource-manager#azure-resource-manager-template-for-adding-an-event-grid-data-connection)

### Generating data

> [!NOTE]
> * Use `BlockBlob` to generate data. `AppendBlob` is not supported.
<!--> * Using ADLSv2 storage requires using `CreateFile` API for uploading blobs and flush at the end. 
    Kusto will get 2 notificatiopns: when blob is created and when stream is flushed. First notification arrives before the data is ready and ignored. Second notification is processed.-->

Following is an example for creating a blob from local file, setting ingestion properties to the blob metadata and uploading it:

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

## Blob lifecycle

Azure Data Explorer won't delete the blobs post ingestion, but will retain them for three to five days. Use [Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage your blob deletion.