---
title: Blob storage subscription using Event Grid Notifications - Azure Data Explorer | Microsoft Docs
description: This article describes Blob storage subscription using Event Grid Notifications in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/26/2020
---
# Blob storage subscription using Event Grid Notifications

Kusto offers continuous ingestion from blobs written to blob containers. 
This is achieved by provisioning an [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) subscription for blob creation events and tunneling those events to Kusto via an Event Hub.

## Data Format

* Blobs can be in any of the [formats supported by Kusto](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats).
* Blobs can be compressed in any of the [compressions supported by Kusto](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats#supported-data-compression-formats)

> [!NOTE]
> To achieve the best ingestion performance, it's important to let Kusto know the **uncompressed** size of the compressed blobs submitted for ingestion.
> Since Event Grid notifications only contain the basic details, the size information needs to be communicated explicitly.
> Uncompressed size information can be provided by setting the `rawSizeBytes` [property](#ingestion-properties) on the blob metadata to **uncompressed** data size in bytes.

## Ingestion Properties

You can specify [Ingestion properties](https://docs.microsoft.com/azure/data-explorer/ingestion-properties) of the blob ingestion via the blob metadata.
You can set the following properties:

|Property | Description|
|---|---|
| rawSizeBytes | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, this is the size before format-specific compression is applied.|
| kustoTable |  Name of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| kustoDataFormat |  Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| kustoIngestionMappingReference |  Name of the existing ingestion mapping to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| kustoIgnoreFirstRecord | If set to `true`, Kusto ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| kustoExtentTags | String representing [tags](https://docs.microsoft.com/azure/kusto/management/extents-overview#extent-tagging) that will be attached to resulting extent. |
| kustoCreationTime |  Overrides [$IngestionTime](/azure/kusto/query/ingestiontimefunction?pivots=azuredataexplorer) for the blob, formatted as a ISO 8601 string. Use for backfilling. |

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

// Set metadata and upload file to blob
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoIgnoreFirstRecord", "true");
blob.Metadata.Add("kustoExtentTags", "Tag1,ingest-by:2019-02-17");
blob.Metadata.Add("kustoCreationTime", "2019-10-18T11:06:06.7992775Z");
blob.UploadFromFile(localFileName);
```

## Events Routing

When setting up a blob storage connection to Kusto cluster, you specify target table properties (table name, data format and mapping). This is the default routing for your data, also refered to as `static routig`.
You can also specify target table properties for each blob, using blob metadata. The connection will dynamically route the data as specified by properties.

 ```csharp
// Assuming data connection was set with csv format to `Events` table

// First blob is routed to default table `Events`
var blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.UploadFromFile(localFileName);

// Second blob, with data version V2, is routed to table `EventsV2`, ingested using `EventsMappingV2` data mapping
blob = container.GetBlockBlobReference(blobName);
blob.Metadata.Add("rawSizeBytes", "4096‬"); // the uncompressed size is 4096 bytes
blob.Metadata.Add("kustoTable", "EventsV2");
blob.Metadata.Add("kustoDataFormat", "json");
blob.Metadata.Add("kustoIngestionMappingReference", "EventsMappingV2");
blob.UploadFromFile(localFileName);
```

## Create Event Grid Subscription

> [!Note]
> For best performance, create all resources in the same Location as the Kusto cluster.

#### Prerequisites

* [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account). 
  Event Grid notification subscription can be set on Azure Storage Accounts of kind `BlobStorage` or `StorageV2`. 
  Enabling [Data Lake Storage Gen2](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction) is also supported.
* [Create an event hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-create).

#### Event Grid Subscription

A detailed walk-through can be found in the how-to [Create an Event Grid subscription in your storage account](https://docs.microsoft.com/azure/data-explorer/ingest-data-event-grid#create-an-event-grid-subscription-in-your-storage-account) guide.

1. In the Azure portal, find your storage account and select **Events** > **Event Subscription**. 
1. In the **Create Event Subscription** window within the **Basic** tab, set all required properties. Take a speciel care of the following values:
    * **Event Schema** is the schema used for notification events. Select `Event Grid schema`.
    * **Event Types** are the types of events to emit. Select `Blob Created` (other types are ignored by Kusto)
    * **Endpoint Type** is the channel used for tunneling notification events. Select `Event Hubs` and set the pre-created Event Hub as the endpoint.

1. Select the **Filters** tab if you want to track files from a specific container(s). Set the filters for the notifications as follows:
    * **Subject Begins With** field is the *literal* prefix of the blob container. As the pattern applied is *startswith*, it can span multiple containers. No wildcards are allowed.
     It *must* be set as follows: *`/blobServices/default/containers/<prefix>`*. For example: */blobServices/default/containers/StormEvents-2020-*
    * **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed. Useful for filtering file extensions.

#### Data Ingestion Connection to Kusto



[Create an Event Grid data connection in Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-data-event-grid#create-an-event-grid-data-connection-in-azure-data-explorer).

## Blob lifecycle

Azure Data Explorer won't delete the blobs post ingestion. Retain the blobs for three to five days. Use [Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.