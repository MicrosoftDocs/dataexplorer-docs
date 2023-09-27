---
title: Ingest from storage using Event Grid subscription - Azure Data Explorer
description: This article describes Ingest from storage using Event Grid subscription in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: how-to
ms.date: 06/05/2023
---
# Event Grid data connection

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

Event Grid ingestion is a pipeline that listens to Azure storage, and updates Azure Data Explorer to pull information when subscribed events occur. Azure Data Explorer offers continuous ingestion from Azure Storage (Blob storage and ADLSv2) with [Azure Event Grid](/azure/event-grid/overview) subscription for blob created or blob renamed notifications and streaming these notifications to Azure Data Explorer via an Azure Event Hubs.

The Event Grid ingestion pipeline goes through several steps. You create a target table in Azure Data Explorer into which the [data in a particular format](#data-format) will be ingested. Then you create an Event Grid data connection in Azure Data Explorer. The Event Grid data connection needs to know [events routing](#events-routing) information, such as what table to send the data to and the table mapping. You also specify [ingestion properties](#ingestion-properties), which describe the data to be ingested, the target table, and the mapping. You can generate sample data and [upload blobs](#upload-blobs) or [rename blobs](#rename-blobs) to test your connection. [Delete blobs](#delete-blobs-using-storage-lifecycle) after ingestion.

Event Grid ingestion can be managed through the [Azure portal](ingest-data-event-grid.md), using the [ingestion wizard](/azure/data-explorer/ingest-from-container), programmatically with [C#](data-connection-event-grid-csharp.md) or [Python](data-connection-event-grid-python.md), or with the [Azure Resource Manager template](data-connection-event-grid-resource-manager.md).

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

[!INCLUDE [data-connection-auth](includes/data-connection-auth.md)]

* So that the MI can fetch data from Azure Storage, it should have at least:
  * [Azure Event Hubs Data Receiver](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver) on the Azure Event Hubs.
  * [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) on the Azure Storage account.

## Data format

* See [supported formats](ingestion-supported-formats.md).
* See [supported compressions](ingestion-supported-formats.md#supported-data-compression-formats).
  * The original uncompressed data size should be part of the blob metadata, or else Azure Data Explorer will estimate it. The ingestion uncompressed size limit per file is 6 GB.

> [!NOTE]
> Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).

## Ingestion properties

You can specify [ingestion properties](ingestion-properties.md) of the blob ingestion via the blob metadata.
You can set the following properties:

|Property | Description|
|---|---|
| `rawSizeBytes` | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, that is the size before format-specific compression is applied. Provide the original data size by setting this property to the uncompressed data size in bytes.|
| `kustoDatabase` | The case-sensitive name of the target database. By default, data is ingested into the target database associated with the data connection. Use this property to override the default database and send data to a different database. To do so, you must first [set up the connection as a multi-database connection](#route-event-data-to-an-alternate-database). |
| `kustoTable` | The case-sensitive name of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| `kustoDataFormat` |  Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| `kustoIngestionMappingReference` | Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| `kustoIgnoreFirstRecord` | If set to `true`, Kusto ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| `kustoExtentTags` | String representing [tags](kusto/management/extents-overview.md#extent-tagging) that will be attached to resulting extent. |
| `kustoCreationTime` | Overrides [Extent Creation time](kusto/management/extents-overview.md#extent-creation-time) for the blob, formatted as an ISO 8601 string. Use for backfilling. |

## Events routing

When you create a data connection to your cluster, you specify the routing for where to send ingested data. The default routing is to the target table specified in the connection string that is associated with the target database. The default routing for your data is also referred to as *static routing*. You can specify an alternative routing for your data by using the event data properties.

### Route event data to an alternate database

Routing data to an alternate database is off by default. To send the data to a different database, you must first set the connection as a multi-database connection. You can do this in the Azure portal, C#, Python, or an ARM template. The user, group, service principal, or managed identity used to allow database routing must at least have the **contributor** role and write permissions on the cluster. For more information, see [Create an Event Grid data connection for Azure Data Explorer](create-event-grid-connection.md).

To specify an alternate database, set the *Database* [ingestion property](#ingestion-properties).

> [!WARNING]
> Specifying an alternate database without setting the connection as a multi-database data connection will cause the ingestion to fail.

### Route event data to an alternate table

When setting up a blob storage connection to Azure Data Explorer cluster, specify target table properties:

* table name
* data format
* mapping

You can also specify target table properties for each blob, using blob metadata. The data will dynamically route, as specified by [ingestion properties](#ingestion-properties).

The example below shows you how to set ingestion properties on the blob metadata before uploading it. Blobs are routed to different tables.

In addition, you can specify the target database. An Event Grid data connection is created within the context of a specific database. Hence this database is the data connection's default database routing. To send the data to a different database, set the "KustoDatabase" ingestion property and set the data connection as a Multi database data connection.
Routing data to another database is disabled by default (not allowed).
Setting a database ingestion property that is different than the data connection's database, without allowing data routing to multiple databases (setting the connection as a Multi database data connection), will cause the ingestion to fail.

For more information, see [upload blobs](#upload-blobs).

```csharp
var container = new BlobContainerClient("<storageAccountConnectionString>", "<containerName>");
await container.CreateIfNotExistsAsync();
var blob = container.GetBlobClient("<blobName>");
// Blob is dynamically routed to table `Events`, ingested using `EventsMapping` data mapping
await blob.SetMetadataAsync(
    new Dictionary<string, string>
    {
        { "rawSizeBytes", "4096" }, // the uncompressed size is 4096 bytes
        { "kustoTable", "Events" },
        { "kustoDataFormat", "json" },
        { "kustoIngestionMappingReference", "EventsMapping" },
        { "kustoDatabase", "AnotherDB" }
    }
);
await blob.UploadAsync(BinaryData.FromString(File.ReadAllText("<filePath>")));
```

## Upload blobs

You can create a blob from a local file, set ingestion properties to the blob metadata, and upload it. For examples, see [Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications](ingest-data-event-grid.md#generate-sample-data)

> [!NOTE]
>
> * We highly recommend using `BlockBlob` to generate data, as using `AppendBlob` may result in unexpected behavior.
> * Using Azure Data Lake Gen2 storage SDK requires using `CreateFile` for uploading files and `Flush` at the end with the close parameter set to `true`. For a detailed example of Data Lake Gen2 SDK correct usage, see [Use the Event Grid data connection](create-event-grid-connection.md?tabs=azure-data-lake#use-the-event-grid-data-connection).
> * Triggering ingestion following a `CopyBlob` operation is not supported for storage accounts that have the hierarchical namespace feature enabled on them.
> * When the event hub endpoint doesn't acknowledge receipt of an event, Azure Event Grid activates a retry mechanism. If this retry delivery fails, Event Grid can deliver the undelivered events to a storage account using a process of *dead-lettering*. For more information, see [Event Grid message delivery and retry](/azure/event-grid/delivery-and-retry#retry-schedule-and-duration).

## Rename blobs

When using ADLSv2, you can rename a blob to trigger blob ingestion to Azure Data Explorer. For example, see [Rename blobs](create-event-grid-connection.md?tabs=azure-data-lake#rename-blobs).

> [!NOTE]
>
> * Directory renaming is possible in ADLSv2, but it doesn't trigger *blob renamed* events and ingestion of blobs inside the directory. To ingest blobs following renaming, directly rename the desired blobs.
> * If you defined filters to track specific subjects while [creating the data connection](ingest-data-event-grid.md) or while creating [Event Grid resources manually](ingest-data-event-grid-manual.md#create-an-event-grid-subscription), these filters are applied on the destination file path.

## Delete blobs using storage lifecycle

Azure Data Explorer won't delete the blobs after ingestion. Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage your blob deletion. It's recommended to keep the blobs for three to five days.

## Known Event Grid issues

* When using Azure Data Explorer to [export](kusto/management/data-export/export-data-to-storage.md) the files used for Event Grid ingestion, note:
  * Event Grid notifications aren't triggered if the connection string provided to the export command or the connection string provided to an [external table](kusto/management/data-export/export-data-to-an-external-table.md) is a connecting string in [ADLS Gen2 format](kusto/api/connection-strings/storage-connection-strings.md#storage-connection-string-templates) (for example, `abfss://filesystem@accountname.dfs.core.windows.net`) but the storage account isn't enabled for hierarchical namespace.
  * If the account isn't enabled for hierarchical namespace, connection string must use the [Blob Storage](kusto/api/connection-strings/storage-connection-strings.md#storage-connection-string-templates) format (for example, `https://accountname.blob.core.windows.net`). The export works as expected even when using the ADLS Gen2 connection string, but notifications won't be triggered and Event Grid ingestion won't work.

## Next steps

* [Create an Event Grid data connection](create-event-grid-connection.md)
* [Ingest data from Azure Event Hubs into Azure Data Explorer using the ingestion wizard](./event-hub-wizard.md)
* [Ingest data from a container or Azure Data Lake Storage into Azure Data Explorer](/azure/data-explorer/ingest-from-container)
