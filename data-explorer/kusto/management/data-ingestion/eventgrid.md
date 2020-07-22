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

Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created notifications and streaming these notifications to Azure Data Explorer via an Event Hub.

## Data format

* Blobs can be in any of the [supported formats](../../../ingestion-supported-formats.md).
* Blobs can be compressed. For more information, see [supported compressions](../../../ingestion-supported-formats.md#supported-data-compression-formats).

> [!NOTE]
> Ideally the original uncompressed data size should be part of the blob metadata.
> If the uncompressed size isn't specified, Azure Data Explorer will estimate it, based on the file size. 
> You can provide the original data size by setting the `rawSizeBytes` [property](#ingestion-properties) on the blob metadata to uncompressed data size in bytes.
> 
> There is an ingestion uncompressed size limit per file of 4GB.

## Ingestion properties

You can specify [Ingestion properties](../../../ingestion-properties.md) of the blob ingestion via the blob metadata.
You can set the following properties:

|Property | Description|
|---|---|
| rawSizeBytes | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, this value is the size before format-specific compression is applied.|
| kustoTable |  Name of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| kustoDataFormat |  Data format. Overwrites the **Data format** set on the **Data Connection** blade. |
| kustoIngestionMappingReference |  Name of the existing ingestion mapping to be used. Overwrites the **Column mapping** set on the **Data Connection** blade.|
| kustoIgnoreFirstRecord | If set to `true`, Azure Data Explorer ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| kustoExtentTags | String representing [tags](../extents-overview.md#extent-tagging) that will be attached to resulting extent. |
| kustoCreationTime |  Overrides [$IngestionTime](../../query/ingestiontimefunction.md?pivots=azuredataexplorer) for the blob, formatted as an ISO 8601 string. Use for backfilling. |

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

## Create an Event Grid subscription in your storage account

> [!NOTE]
> For best performance, create all resources in the same region as the Azure Data Explorer cluster.

### Prerequisites

* [Create a storage account](/azure/storage/common/storage-quickstart-create-account).
  Event Grid notification subscription can be set on Azure Storage Accounts for kind `BlobStorage` or `StorageV2`.
  Enabling [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction) is also supported.
* [Create an event hub](/azure/event-hubs/event-hubs-create).

### Event Grid subscription
 
1. In the Azure portal, find your storage account.
1. On the left menu, select **Events** > **Event Subscription**.

     :::image type="content" source="../images/eventgrid/create-event-grid-subscription-1.png" alt-text="Create event grid subscription":::

1. In the **Create Event Subscription** window within the **Basic** tab, provide the following values:

    :::image type="content" source="../images/eventgrid/create-event-grid-subscription-2.png" alt-text="Create event subscription values to enter":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Name | *test-grid-connection* | The name of the event grid subscription that you want to create.|
    | Event Schema | *Event Grid Schema* | The schema that should be used for the event grid. |
    | Topic Type | *Storage account* | The type of event grid topic. |
    | Source Resource | *gridteststorage1* | The name of your storage account. |
    | System Topic Name | *gridteststorage1...* | The system topic where Azure Storage publishes events. This system topic then forwards the event to a subscriber that receives and processes events. |
    | Filter to Event Types | *Blob Created* | Which specific events to get notified for. Currently supported type is Microsoft.Storage.BlobCreated. Make sure to select it when creating the subscription.|
    | Endpoint Type | *Event Hubs* | The type of endpoint to which you send the events. |
    | Endpoint | *test-hub* | The event hub you created. |

1. Select the **Filters** tab if you want to track specific subjects. Set the filters for the notifications as follows:
   * Select **Enable subject filtering**
   * **Subject Begins With** field is the *literal* prefix of the subject. Since the pattern applied is *startswith*, it can span multiple containers, folders or blobs. No wildcards are allowed.
       * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
       * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
   * **Subject Ends With** field is the *literal* suffix of the blob. No wildcards are allowed.
   * **Case-sensitive subject matching** field indicates whether the prefix and suffix filters are case-sensitive.
   * See [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events) for more details about filtering events.
    
        :::image type="content" source="../images/eventgrid/filters-tab.png" alt-text="Filters tab event grid":::

> [!NOTE]
> Azure Event Grid provides a retry mechanism in case that the endpoint doesn't acknowledge receipt of an event. When retry delivery fail, Event Grid also supports delivering of undelivered events to a storage account using a process of **dead-lettering**. For more information about Azure Event Grid retry mechanism, see [Event Grid message delivery and retry](/azure/event-grid/delivery-and-retry#retry-schedule-and-duration).

### Data ingestion connection to Azure Data Explorer

* Via Azure portal: [Create an Event Grid data connection in Azure Data Explorer](../../../ingest-data-event-grid.md#create-an-event-grid-data-connection-in-azure-data-explorer).
* Using Kusto management .NET SDK: [Add an Event Grid data connection](../../../data-connection-event-grid-csharp.md#add-an-event-grid-data-connection)
* Using Kusto management Python SDK: [Add an Event Grid data connection](../../../data-connection-event-grid-python.md#add-an-event-grid-data-connection)
* With [Azure Resource Manager template for adding an Event Grid data connection](../../../data-connection-event-grid-resource-manager.md#azure-resource-manager-template-for-adding-an-event-grid-data-connection)

### Generating data

> [!NOTE]
> * Use `BlockBlob` to generate data. `AppendBlob` is not supported.

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
>  For a detailed example of how to use Data Lake Gen2 SDK correctly, see [upload file using Azure Data Lake SDK](../../../data-connection-event-grid-csharp.md#upload-file-using-azure-data-lake-sdk).

## Blob lifecycle

Azure Data Explorer won't delete the blobs after ingestion. Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage your blob deletion. It's recommended to retain the blobs for three to five days.

## Known issues

* When using Azure Data Explorer to [export](../data-export/export-data-to-storage.md) the files used for event grid ingestion, note: 
    * Event Grid notifications aren't triggered if the connection string provided to the export command or the connection string provided to an [external table](../data-export/export-data-to-an-external-table.md) is a connecting string in [ADLS Gen2 format](../../api/connection-strings/storage.md#azure-data-lake-store) (for example, `abfss://filesystem@accountname.dfs.core.windows.net`) but the storage account isn't enabled for hierarchical namespace. 
    * If the account isn't enabled for hierarchical namespace, connection string must use the [Blob Storage](../../api/connection-strings/storage.md#azure-storage-blob) format (for example, `https://accountname.blob.core.windows.net`). The export works as expected even when using the ADLS Gen2 connection string, but notifications won't be triggered and Event Grid ingestion won't work.
