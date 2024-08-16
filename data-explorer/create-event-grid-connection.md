---
title: Create an Event Grid data connection - Azure Data Explorer
description: Learn how to create an Event Grid data connection to ingest data into Azure Data Explorer.
ms.topic: how-to
ms.date: 02/20/2024
---

# Create an Event Grid data connection for Azure Data Explorer

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hubs.

[!INCLUDE [ingestion-size-limit](includes/cross-repo/ingestion-size-limit.md)]

To learn how to create the connection using the Kusto SDKs, see [Create an Event Grid data connection with SDKs](create-event-grid-connection-sdk.md).

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md).

> [!NOTE]
>
> To achieve the best performance with the Event Grid connection, set the `rawSizeBytes` ingestion property via the blob metadata. For more information, see [ingestion properties](ingest-data-event-grid-overview.md#ingestion-properties).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).
* Have the [Event Grid resource provider registered](/azure/event-grid/blob-event-quickstart-portal#register-the-event-grid-resource-provider).

## Create an Event Grid data connection

In this section, you establish a connection between Event Grid and your Azure Data Explorer table.

### [Portal - Azure Data Explorer](#tab/portal-adx)

1. Browse to your Azure Data Explorer cluster in the Azure portal.
1. Under **Data**, select **Databases** > **TestDatabase**.

    :::image type="content" source="media/create-event-grid-connection/select-test-database.png" alt-text="Screenshot of the cluster's database section showing a list of databases it contains.":::

1. Under **Settings**, select **Data connections** and then select **Add data connection** > **Event Grid (Blob storage)**.

    :::image type="content" source="media/create-event-grid-connection/data-ingestion-create.png" alt-text="Screenshot of the data connections page. The option to add a data connection is highlighted.":::

1. Fill out the Event Grid data connection form with the following information:

    :::image type="content" source="media/create-event-grid-connection/data-connection-basics.png" alt-text="Screenshot of Event Grid pane showing the details for the data connection."  lightbox="media/create-event-grid-connection/data-connection-basics.png":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer. Data connection names can contain only alphanumeric, dash and dot characters, and be up to 40 characters in length.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Storage account | *gridteststorage1* | The name of the storage account that you created previously.|
    | Resources creation | *Automatic* | Turning on automatic resource creation means that Azure Data Explorer creates an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. Otherwise, you need to create these resources manually to ensure the creation of the data connection. See [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

    1. Optionally, you can track specific Event Grid subjects. Set the filters for the notifications as follows:

        * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *starts with*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
            * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
            * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
        * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
        * **Case-Sensitive** field indicates whether the prefix and suffix filters are case-sensitive

        For more information on filtering events, see [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).

    1. Optionally, you can specify the **Data routing settings** according to the following information. You don't have to specify all **Data routing settings**. Partial settings are also accepted.

        |**Setting** | **Suggested value** | **Field description**|
        |---|---|---|
        | Allow routing the data to other databases (Multi database data connection) | Don't allow | Toggle on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
        | Table name | *TestTable* | The table you created in **TestDatabase**. |
        | Data format | *JSON* | Supported formats are APACHEAVRO, Avro, CSV, JSON, ORC, PARQUET, PSV, RAW, SCSV, SOHSV, TSV, TSVE, TXT, and W3CLOG. Supported compression options are Zip and Gzip. |
        | Mapping name | *TestTable_mapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is autogenerated. |
        | Ignore format errors | *Ignore* | Toggle on this option if you want to ignore format errors for JSON data format.|

        > [!NOTE]
        > Table and mapping names are case-sensitive.

    1. Optionally, under **Advanced settings**, you can specify the **Managed identity type** that is used by your data connection. By default, **System-assigned** is selected.

        If you select **User-assigned**, you need to manually assign a managed identity. If you select a user that isn't assigned to your cluster yet, it will be auto-assigned. For more information, see [Configure managed identities for your Azure Data Explorer cluster](configure-managed-identities-cluster.md).

        If you select **None**, the storage account and Event Hub are authenticated via connection strings. This method isn't recommended.

        :::image type="content" source="media/create-event-grid-connection/managed-identity-type.png" alt-text="Screenshot of the advanced settings section showing the managed identity types that can be used for the data connection.":::

1. Select **Create**

### [Portal - Azure storage](#tab/portal-storage)

1. Browse to your storage account in the Azure portal.
1. Select **Events**.
1. In the **Get Started** tab, select the **Azure Data Explorer** tab.
1. In the **Create continuous data ingestion** tile, select **Create**.

:::image type="content" source="media/create-event-grid-connection/storage-account.png" alt-text="Screenshot of the Azure storage account Events page, showing the Azure Data Explorer tab."  lightbox="media/create-event-grid-connection/storage-account.png":::

#### Choose destination to route events into

1. Select a cluster in which you want to ingest data.
1. Select a target database.
1. Select **Select**.

#### Create data connection

1. Fill out the form with the following information:

    :::image type="content" source="media/create-event-grid-connection/portal-create-data-connection.png" alt-text="Screenshot of Event Grid pane showing the details for the data connection." lightbox="media/create-event-grid-connection/portal-create-data-connection.png":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed.|
    | Storage account | *gridteststorage1* | The storage account from which you accessed this wizard is autopopulated.|
    | Resources creation | *Automatic* | Turning on automatic resource creation means that Azure Data Explorer creates an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. Otherwise, you need to create these resources manually to ensure the creation of the data connection. See [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

    1. Optionally, you can track specific Event Grid subjects. Set the filters for the notifications as follows:

        * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *starts with*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
            * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
            * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
        * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
        * **Case-Sensitive** field indicates whether the prefix and suffix filters are case-sensitive

        For more information on filtering events, see [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).

    1. Optionally, you can specify the **Data routing settings** according to the following information. You don't have to specify all **Data routing settings**. Partial settings are also accepted.

        |**Setting** | **Suggested value** | **Field description**|
        |---|---|---|
        | Allow routing the data to other databases (Multi database data connection) | Don't allow | Toggle on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
        | Table name | *TestTable* | The table you created in **TestDatabase**. |
        | Data format | *JSON* | Supported formats are APACHEAVRO, Avro, CSV, JSON, ORC, PARQUET, PSV, RAW, SCSV, SOHSV, TSV, TSVE, TXT, and W3CLOG. Supported compression options are Zip and Gzip. |
        | Mapping name | *TestTable_mapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is autogenerated. |
        | Ignore format errors | *Ignore* | Toggle on this option if you want to ignore format errors for JSON data format.|

        > [!NOTE]
        > Table and mapping names are case-sensitive.

    1. Optionally, under **Advanced settings**, you can specify the **Managed identity type** that is used by your data connection. By default, **System-assigned** is selected.

        If you select **User-assigned**, you need to manually assign a managed identity. If you select a user that isn't assigned to your cluster yet, it will be auto-assigned. For more information, see [Configure managed identities for your Azure Data Explorer cluster](configure-managed-identities-cluster.md).

        If you select **None**, the storage account and Event Hub are authenticated via connection strings. This method isn't recommended.

        :::image type="content" source="media/create-event-grid-connection/managed-identity-type.png" alt-text="Screenshot of the advanced settings section showing the managed identity types that can be used for the data connection.":::

1. Select **Create**.

### [ARM template](#tab/arm-template)

The following example shows an Azure Resource Manager template for adding an Event Grid data connection. You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

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

---

## Use the Event Grid data connection

This section shows how to trigger ingestion from Azure Blob Storage or Azure Data Lake Gen 2 to your cluster following blob creation or blob renaming.

Select the relevant tab based on the type of storage SDK used to upload blobs.

### [Azure Blob Storage](#tab/azure-blob-storage)

The following code sample uses the [Azure Blob Storage SDK](https://www.nuget.org/packages/Azure.Storage.Blobs/) to upload a file to Azure Blob Storage. The upload triggers the Event Grid data connection, which ingests the data into Azure Data Explorer.

```csharp
var azureStorageAccountConnectionString = <storage_account_connection_string>;
var containerName = <container_name>;
var blobName = <blob_name>;
var localFileName = <file_to_upload>;
var uncompressedSizeInBytes = <uncompressed_size_in_bytes>;
var mapping = <mapping_reference>;
// Create a new container if it not already exists.
var azureStorageAccount = new BlobServiceClient(azureStorageAccountConnectionString);
var container = azureStorageAccount.GetBlobContainerClient(containerName);
container.CreateIfNotExists();
// Define blob metadata and uploading options.
IDictionary<String, String> metadata = new Dictionary<string, string>();
metadata.Add("rawSizeBytes", uncompressedSizeInBytes);
metadata.Add("kustoIngestionMappingReference", mapping);
var uploadOptions = new BlobUploadOptions
{
    Metadata = metadata,
};
// Upload the file.
var blob = container.GetBlobClient(blobName);
blob.Upload(localFileName, uploadOptions);
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
// Upload the file.
var dataLakeFileClient = dataLakeFileSystemClient.GetFileClient(fileName);
dataLakeFileClient.Upload(localFileName, uploadOptions);
```

> [!NOTE]
>
> * When uploading a file with the Azure Data Lake SDK, the initial file creation event has a size of 0, which is ignored by Azure Data Explorer during data ingestion. To ensure proper ingestion, set the `Close` parameter to `true`. This parameter causes the upload method to trigger a *FlushAndClose* event, indicating that the final update has been made and the file stream is closed.
> * To reduce traffic coming from Event Grid and optimize the ingestion of events into Azure Data Explorer, we recommend [filtering](ingest-data-event-grid-manual.md#create-an-event-grid-subscription) the *data.api* key to exclude *CreateFile* events. This ensure that file creation events with size 0 are filtered out, preventing ingestion errors of empty file. For more information about flushing, see [Azure Data Lake flush method](/dotnet/api/azure.storage.files.datalake.datalakefileclient.flush).

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
> If you defined filters to track specific subjects while [creating the data connection](#create-an-event-grid-data-connection) or while creating [Event Grid resources manually](ingest-data-event-grid-manual.md#create-an-event-grid-subscription), these filters are applied on the destination file path.

---

> [!NOTE]
> Triggering ingestion following a `CopyBlob` operation is not supported for storage accounts that have the hierarchical namespace feature enabled on them.

## Remove an Event Grid data connection

To remove the Event Grid connection from the Azure portal, do the following steps:

1. Go to your cluster. From the left menu, select **Databases**. Then, select the database that contains the target table.
1. From the left menu, select **Data connections**. Then, select the checkbox next to the relevant Event Grid data connection.
1. From the top menu bar, select **Delete**.

---

## Related content

* [Process data from your event hub using Azure Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics)
