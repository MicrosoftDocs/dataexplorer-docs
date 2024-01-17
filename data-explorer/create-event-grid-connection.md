---
title: 'Create an Event Grid data connection - Azure Data Explorer'
description: 'In this article, you learn how to ingest data into Azure Data Explorer from Event Grid.'
ms.topic: how-to
ms.date: 07/16/2023
---

# Create an Event Grid data connection for Azure Data Explorer

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hubs.

[!INCLUDE [ingestion-size-limit](includes/ingestion-size-limit.md)]

To learn how to create the connection using the Kusto SDKs, see [Create an Event Grid data connection with SDKs](create-event-grid-connection-sdk.md).

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md).

> [!NOTE]
> To achieve the best performance with the Event Grid connection, set the `rawSizeBytes` ingestion property via the blob metadata. For more information, see [ingestion properties](ingest-data-event-grid-overview.md#ingestion-properties).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A destination table. [Create a table](kusto/management/create-table-command.md) or use an existing table.
* An [ingestion mapping](kusto/management/mappings.md) for the table.
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).
* Have the [Event Grid resource provider registered](/azure/event-grid/blob-event-quickstart-portal#register-the-event-grid-resource-provider).

## Create an Event Grid data connection

In this section, you'll establish a connection between Event Grid and your Azure Data Explorer table.

### [Portal - Azure Data Explorer](#tab/portal-adx)

1. Under the cluster you created, select **Databases** > **TestDatabase**.

    :::image type="content" source="media/ingest-data-event-grid/select-test-database.png" alt-text="Screenshot of the Databases page, showing a database.":::

1. Select **Data ingestion** > **Add data connection**.

    :::image type="content" source="media/ingest-data-event-grid/data-ingestion-create.png" alt-text="Screenshot of the Data ingestion page, showing the add data connection option.":::

1. Under **Basics**, select the connection type: **Blob storage** and then fill out the form with the following information:

    :::image type="content" source="media/ingest-data-event-grid/data-connection-basics.png" alt-text="Screenshot of the Data Connection Basics tab, showing the options for the Blob storage connection type.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Storage account | *gridteststorage1* | The name of the storage account that you created previously.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

1. Select **Filter settings** if you want to track specific subjects. Set the filters for the notifications as follows:
    * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *starts with*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
        * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
        * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
    * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
    * **Case-Sensitive** field indicates whether the prefix and suffix filters are case-sensitive
    * For more information about filtering events, see [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).

    :::image type="content" source="media/ingest-data-event-grid/filter-settings.png" alt-text="Screenshot of the Filter settings form, showing the filter parameters.":::

1. Select **Next: Ingest properties**.

1. Fill out the form with the following information. Table and mapping names are case-sensitive:

   :::image type="content" source="media/ingest-data-event-grid/data-connection-ingest-properties.png" alt-text="Screenshot of the Data Connection Ingest properties tab, showing the target table properties.":::

    Ingest properties:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Allow routing the data to other databases (Multi database data connection) | Don't allow | Turn on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
    | Table name | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and Gzip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used. |
    | Advanced settings | *My data has headers* | Ignores headers. Supported for *SV type files.|

    > [!NOTE]
    > You don't have to specify all **Default routing settings**. Partial settings are also accepted.

1. Select **Next: Review + create**

1. Under ***Review + create**.
1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="media/ingest-data-event-grid/create-event-grid-data-connection-review-create.png" alt-text="Screenshot of the Data Connection Review and create tab, showing a summary of the selected data connection settings.":::

1. Wait until the deployment is completed. If your deployment failed, select **Operation details** next to the failed stage to get more information for the failure reason. Select **Redeploy** to try to deploy the resources again. You can alter the parameters before deployment.

    :::image type="content" source="media/ingest-data-event-grid/deploy-event-grid-resources.png" alt-text="Screenshot of Deploy Event Grid overview page, showing a failed deployment.":::

### [Portal - Azure storage](#tab/portal-storage)

1. Browse to the storage account in the Azure portal. On the left menu, select **Events**
1. In the main pane, select the **Azure Data Explorer** tab.

    :::image type="content" source="media/ingest-data-event-grid/storage-account.png" alt-text="Screenshot of the Azure storage account Events page, showing the Azure Data Explorer tab.":::

The **Data connection** pane opens with the **Basics** tab selected.

1. Under **Basics**, fill out the form with the following information:

    :::image type="content" source="media/ingest-data-event-grid/portal-basics-tab.png" alt-text="Screenshot of the Data Connection Basics tab, showing the options for the connection type.":::

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account | *gridteststorage1* | The storage account from which you accessed this wizard. Autopopulated.|
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

1. Select **Next> Ingest properties**.

1. Under **Ingest properties**.
1. Fill out the form with the following information. Table and mapping names are case-sensitive:

    :::image type="content" source="media/ingest-data-event-grid/portal-ingestion-tab.png" alt-text="Screenshot of the Data Connection Ingest properties tab, showing the subscription and data routing properties.":::

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription |  | Your Azure Data Explorer subscription.
    | Cluster Name | *TestCluster* | The name of the cluster in which you want to ingest data.
    | Database Name | *TestDatabase* | The target database you created in **TestCluster**.
    | Allow routing the data to other databases (Multi database data connection) | Don't allow | Turn on this option if you want to override the default target database associated with the data connection. For more information about database routing, see [Events routing](ingest-data-event-grid-overview.md#events-routing). |
    | Table name | *TestTable* | The target table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and Gzip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming data to the column names and data types of **TestTable**. If not specified, an [identity data mapping](kusto/management/mappings.md#identity-mapping) derived from the table's schema is used.|
    | Advanced settings | *My data has headers* | Ignores headers. Supported for *SV type files.|

   > [!NOTE]
   > You don't have to specify all **Data routing settings**. Partial settings are also accepted.

1. Select **Next: Review + create**

1. Under **Review + create**.
1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="media/ingest-data-event-grid/portal-review-create.png" alt-text="Screenshot of the Data Connection Review and create tab, showing a summary of the selected data connection settings.":::

1. Wait until the deployment is completed. If your deployment failed, select **Operation details** next to the failed stage to get more information for the failure reason. Select **Redeploy** to try to deploy the resources again. You can alter the parameters before deployment.

    :::image type="content" source="media/ingest-data-event-grid/deploy-event-grid-resources.png" alt-text="Screenshot of Deploy Event Grid overview page, showing a failed deployment.":::

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
> If you defined filters to track specific subjects while [creating the data connection](ingest-data-event-grid.md) or while creating [Event Grid resources manually](ingest-data-event-grid-manual.md#create-an-event-grid-subscription), these filters are applied on the destination file path.

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
