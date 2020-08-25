---
title: 'Ingest Azure Blobs into Azure Data Explorer'
description: In this article, you learn how to send storage account data to Azure Data Explorer using an Event Grid subscription.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/13/2020

# Customer intent: As a database administrator, I want Azure Data Explorer to track my blob storage and ingest new blobs.
---

# Ingest blobs into Azure Data Explorer by subscribing to Event Grid notifications

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

[!INCLUDE [data-connector-intro](includes/data-connector-intro.md)]

In this article, you learn how to ingest blobs from your storage account into Azure Data Explorer using an Event Grid data connection. You'll create an Event Grid data connection that set an [Azure Event Grid](/azure/event-grid/overview) subscription. The Event Grid subscription routes events from your storage account to Azure Data Explorer via an Azure Event Hub. Then you'll see an example of the data flow throughout the system.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A cluster and database](create-cluster-database-portal.md).
* [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

## Create a target table in Azure Data Explorer

Create a table in Azure Data Explorer where Event Hubs will send data. Create the table in the cluster and database prepared in the prerequisites.

1. In the Azure portal, under your cluster, select **Query**.

    :::image type="content" source="media/ingest-data-event-grid/query-explorer-link.png" alt-text="Link to Query explorer":::    

1. Copy the following command into the window and select **Run** to create the table (TestTable) that will receive the ingested data.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Value: string, Source:string)
    ```

    :::image type="content" source="media/ingest-data-event-grid/run-create-table.png" alt-text="Run command create table":::

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

    ```kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp","path":"$.TimeStamp"},{"column":"Value","path":"$.Value"},{"column":"Source","path":"$.Source"}]'
    ```

## Create an Event Grid data connection in Azure Data Explorer

Now connect the storage account to Azure Data Explorer, so that data flowing into the storage is streamed to the test table. 

1. Under the cluster you created, select **Databases** > **TestDatabase**.

    :::image type="content" source="media/ingest-data-event-grid/select-test-database.png" alt-text="Select test database":::

1. Select **Data ingestion** > **Add data connection**.

    :::image type="content" source="media/ingest-data-event-grid/data-ingestion-create.png" alt-text="Add data connection for data ingestion":::

1. Select the connection type: **Blob storage**.

1. Fill out the form with the following information:

    :::image type="content" source="media/ingest-data-event-grid/create-event-grid-data-connection-basics.png" alt-text="Fill out event grid form with connection basics":::

     Data source:

    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | Data connection name | *test-grid-connection* | The name of the connection that you want to create in Azure Data Explorer.|
    | Storage account subscription | Your subscription ID | The subscription ID where your storage account is.|
    | Storage account | *gridteststorage1* | The name of the storage account that you created previously.|
    | Resources creation | *Automatic* | Define whether you want Azure Data Explorer to create an Event Grid Subscription, an Event Hub namespace and an Event Hub for you. A detailed explanation of how to create Event Grid subscription manually, can be found in the references under the [Create an Event Grid subscription in your storage account](ingest-data-event-grid.md) section.|

1. Select **Filter settings** if you want to track specific subjects. Set the filters for the notifications as follows:
    * **Prefix** field is the *literal* prefix of the subject. As the pattern applied is *startswith*, it can span multiple containers, folders or blobs. No wildcards are allowed.
        * To define a filter on the blob container, the field *must* be set as follows: *`/blobServices/default/containers/[container prefix]`*.
        * To define a filter on a blob prefix (or a folder in Azure Data Lake Gen2), the field *must* be set as follows: *`/blobServices/default/containers/[container name]/blobs/[folder/blob prefix]`*.
    * **Suffix** field is the *literal* suffix of the blob. No wildcards are allowed.
    * **Case Sensitive** field indicates whether the prefix and suffix filters are case-sensitive
    * For more information about filtering events, see [Blob storage events](/azure/storage/blobs/storage-blob-event-overview#filtering-events).
    
    :::image type="content" source="media/ingest-data-event-grid/filter-settings.png" alt-text="Filter settings Event Grid":::    

1. Select **Next: Ingest properties**.

1. Fill out the form with the following information and select **Next: Review + Create**. Table and mapping names are case-sensitive:

   :::image type="content" source="media/ingest-data-event-grid/create-event-grid-data-connection-ingest-properties.png" alt-text="Review and create table and mapping ingestion properties":::

    Ingest properties:

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table | *TestTable* | The table you created in **TestDatabase**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, ORC, PARQUET, PSV, SCSV, SOHSV, TSV, TXT, TSVE, APACHEAVRO, RAW, and W3CLOG. Supported compression options are Zip and GZip. |
    | Mapping | *TestMapping* | The mapping you created in **TestDatabase**, which maps incoming JSON data to the column names and data types of **TestTable**.|

1. Review the resources that were auto created for you and select **Create**.

    :::image type="content" source="media/ingest-data-event-grid/create-event-grid-data-connection-review-create.png" alt-text="Review and create data connection for event grid":::

1. Wait until the deployment is completed. If your deployment failed, select **Operation details** next to the failed stage to get more information for the failure reason. Select **Redeploy** to try to deploy the resources again.

    :::image type="content" source="media/ingest-data-event-grid/deploy-event-grid-resources.png" alt-text="Deploy event grid resources":::

## Generate sample data

Now that Azure Data Explorer and the storage account are connected, you can create sample data and upload it to the storage container.

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

### Ingestion properties

You can specify the [Ingestion properties](ingestion-properties.md) of the blob ingestion via the blob metadata.

These properties can be set:

[!INCLUDE [ingestion-properties-event-grid](includes/ingestion-properties-event-grid.md)]

> [!NOTE]
> Azure Data Explorer won't delete the blobs post ingestion.
> Retain the blobs for three to five days.
> Use [Azure Blob storage lifecycle](/azure/storage/blobs/storage-lifecycle-management-concepts?tabs=azure-portal) to manage blob deletion. 

## Review the data flow

> [!NOTE]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion designed to optimize the ingestion process.
By default, the policy is configured to 5 minutes.
You'll be able to alter the policy at a later time if needed. In this article you can expect a latency of a few minutes.

1. In the Azure portal, under your event grid, you see the spike in activity while the app is running.

    :::image type="content" source="media/ingest-data-event-grid/event-grid-graph.png" alt-text="Activity graph for event grid":::

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

    :::image type="content" source="media/ingest-data-event-grid/table-result.png" alt-text="Message result set for Event Grid":::

## Clean up resources

If you don't plan to use your event grid again, clean up the Event Grid Subscription, Event Hub namespace, and Event Hub that were auto created for you, to avoid incurring costs.

1. In Azure portal, go to the left menu and select **All resources**.

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-all-resource.png" alt-text="Select all resources for event grid cleanup":::    

1. Search for your Event Hub Namespace and select **Delete** to delete it:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-find-eventhub-namespace-delete.png" alt-text="Clean up Event Hub namespace":::

1. In the Delete resources form, confirm the deletion to delete the Event Hub Namespace and Event Hub resources.

1. Go to your storage account. In the left menu, select **Events**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-events.png" alt-text="Select events to clean up for Event Grid":::

1. Below the graph, Select your Event Grid Subscription and then select **Delete** to delete it:

    :::image type="content" source="media/ingest-data-event-grid/delete-event-grid-subscription.png" alt-text="Delete event grid subscription":::

1. To delete your Event Grid data connection, go to your Azure Data Explorer cluster. On the left menu, select **Databases**.

1. Select your database **TestDatabase**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-database.png" alt-text="Select database to clean up resources":::

1. On the left menu, select **Data ingestion**:

    :::image type="content" source="media/ingest-data-event-grid/clean-up-resources-select-data-ingestion.png" alt-text="Select data ingestion to clean up resources":::

1. Select your data connection *test-grid-connection* and then select **Delete** to delete it.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
