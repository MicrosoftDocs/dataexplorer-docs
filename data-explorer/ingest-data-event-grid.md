---
title: 'Ingest Azure Blobs into Azure Data Explorer'
description: In this article, you learn how to send storage account data to Azure Data Explorer using an Event Grid subscription.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 09/11/2022

# Customer intent: As a database administrator, I want Azure Data Explorer to track my blob storage and ingest new blobs.
---

# Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications

> [!div class="op_single_selector"]
> * [Ingestion wizard](./ingestion-wizard-new-table.md)
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that sets an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hubs. Then you'll see an example of the data flow throughout the system.

For general information about ingesting into Azure Data Explorer from Event Grid, see [Connect to Event Grid](ingest-data-event-grid-overview.md). To create resources manually in the Azure portal, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-portal.md).
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).

## Create a target table in Azure Data Explorer

Create a table in Azure Data Explorer where Azure Event Hubs will send data. Create the table in the cluster and database prepared in the prerequisites.

1. In the Azure portal, under your cluster, select **Query**.

    :::image type="content" source="media/ingest-data-event-grid/azure-portal.png" alt-text="Screenshot of the Azure portal Query page, showing a selected database.":::

1. Copy the following command into the window and select **Run** to create the table (TestTable) that will receive the ingested data.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Value: string, Source:string)
    ```

    :::image type="content" source="media/ingest-data-event-grid/run-create-table.png" alt-text="Screenshot of the Azure Data Explorer web U I query page, showing the create table command.":::

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

    ```kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp","path":"$.TimeStamp"},{"column":"Value","path":"$.Value"},{"column":"Source","path":"$.Source"}]'
    ```

## Create an Event Grid data connection

Now connect the storage account to Azure Data Explorer, so that data flowing into the storage is streamed to the test table. This connection can be created in the Azure portal under the storage account itself, or in the Azure portal under Azure Data Explorer.

### [Azure portal - Azure Data Explorer](#tab/adx)

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
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hubs namespace, and an Event Hubs for you. To create resources manually, see [Manually create resources for Event Grid ingestion](ingest-data-event-grid-manual.md)|

1. Select **Filter settings** if you want to track specific subjects. Set the filters for the notifications as follows:
    * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *startswith*, it can span multiple containers, folders, or blobs. No wildcards are allowed.
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

### [Azure portal - storage](#tab/portal-1)

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
    | Event type | *Blob created* or *Blob renamed* | The type of event that triggers ingestion. *Blob renamed* is supported only for ADLSv2 storage. Supported types are: Microsoft.Storage.BlobCreated or Microsoft.Storage.BlobRenamed. |
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

---

### Deployment

Wait until the deployment is completed. If your deployment failed, select **Operation details** next to the failed stage to get more information for the failure reason. Select **Redeploy** to try to deploy the resources again. You can alter the parameters before deployment.

:::image type="content" source="media/ingest-data-event-grid/deploy-event-grid-resources.png" alt-text="Screenshot of Deploy Event Grid overview page, showing a failed deployment.":::

## Generate sample data

Now that Azure Data Explorer and the storage account are connected, you can create sample data.

### Upload blob to the storage container

We'll work with a small shell script that issues a few basic Azure CLI commands to interact with Azure Storage resources. This script does the following actions:

1. Creates a new container in your storage account.
1. Uploads an existing file (as a blob) to that container.
1. Lists the blobs in the container.

You can use [Azure Cloud Shell](/azure/cloud-shell/overview) to execute the script directly in the portal.

Save the data into a file and upload it with this script:

```json
{"TimeStamp": "1987-11-16 12:00","Value": "Hello World","Source": "TestSource"}
```

```azurecli
#!/bin/bash
### A simple Azure Storage example script

    export AZURE_STORAGE_ACCOUNT=<storage_account_name>
    export AZURE_STORAGE_KEY=<storage_account_key>

    export container_name=<container_name>
    export blob_name=<blob_name>
    export file_to_upload=<file_to_upload>
    export destination_file=<destination_file>

    echo "Creating the container..."
    az storage container create --name $container_name

    echo "Uploading the file..."
    az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name --metadata "rawSizeBytes=1024"

    echo "Listing the blobs..."
    az storage blob list --container-name $container_name --output table

    echo "Done"
```

> [!NOTE]
> To achieve the best ingestion performance, the *uncompressed* size of the compressed blobs submitted for ingestion must be communicated. Because Event Grid notifications contain only basic details, the size information must be explicitly communicated. The uncompressed size information can be provided by setting the `rawSizeBytes` property on the blob metadata with the *uncompressed* data size in bytes.

### Rename blob

If you're ingesting data from ADLSv2 storage and have defined *Blob renamed* as the event type for the data connection, the trigger for blob ingestion is blob renaming. To rename a blob, navigate to the blob in Azure portal, right-click on the blob and select **Rename**:

   :::image type="content" source="media/ingest-data-event-grid/rename-blob-in-the-portal.png" alt-text="Screenshot of a blob shortcut menu, showing the Rename option.":::

### Ingestion properties

You can specify the [ingestion properties](ingest-data-event-grid-overview.md#ingestion-properties) of the blob ingestion via the blob metadata.

> [!NOTE]
> Azure Data Explorer won't delete the blobs post ingestion.
> Retain the blobs for three to five days.
> Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion.

## Review the data flow

> [!NOTE]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion designed to optimize the ingestion process.
> By default, the policy is configured to 5 minutes.
> You'll be able to alter the policy at a later time if needed. In this article you can expect a latency of a few minutes.

1. In the Azure portal, under your Event Grid, you see the spike in activity while the app is running.

    :::image type="content" source="media/ingest-data-event-grid/event-grid-graph.png" alt-text="Screenshot of an Event Grid Activity graph, showing a spike in activity.":::

1. To preview incoming Event Grid notifications sent to your event hub in the Azure portal, see [process data from your event hub using Azure Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics). You can use the insights you gain to refine your Event Grid filter settings and ensure that only the appropriate events are sent to your event hub and cluster.

1. To check how many messages have made it to the database so far, run the following query in your test database.

    ```kusto
    TestTable
    | count
    ```

1. To see the content of the messages, run the following query in your test database.

    ```kusto
    TestTable
    ```

    The result set should look like the following image:

    :::image type="content" source="media/ingest-data-event-grid/table-result.png" alt-text="Screenshot of the query results, showing the content of Event Grid messages.":::

## Clean up resources

If you don't plan to use your Event Grid again, clean up the Event Grid Subscription, Event Hubs namespace, and any event hubs that were autocreated for you, to avoid incurring costs.

1. In Azure portal, go to the left menu and select **All resources**.

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-all-resource.png" alt-text="Screenshot of Azure portal left menu, showing the All resources option.":::

1. Search for the Event Hubs namespace and select **Delete** to delete it:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-find-eventhub-namespace-delete.png" alt-text="Screenshot of the All resources page, showing the Delete menu option.":::

1. In the Delete resources form, confirm the deletion to delete the Event Hubs namespace and Event Hubs resources.

1. Go to your storage account. In the left menu, select **Events**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-events.png" alt-text="Screenshot of the Azure storage account left menu, showing the Events option.":::

1. Below the graph, select your Event Grid Subscription and then select **Delete** to delete it:

    :::image type="content" source="media/ingest-data-event-grid/delete-event-grid-subscription.png" alt-text="Screenshot of the Event Subscription page, showing the selected Event Grid subscription and the Delete option.":::

1. To delete your Event Grid data connection, go to your Azure Data Explorer cluster. On the left menu, select **Databases**.

1. Select your database **TestDatabase**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-database.png" alt-text="Screenshot of Azure Data Explorer web U I Databases page, showing a database.":::

1. On the left menu, select **Data ingestion**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-data-ingestion.png" alt-text="Screenshot of the Azure portal left menu, showing the Data ingestion option.":::

1. Select your data connection *test-grid-connection* and then select **Delete** to delete it.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)