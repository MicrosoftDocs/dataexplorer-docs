---
ms.topic: include
ms.date: 02/18/2024
---
[Cribl stream](https://docs.cribl.io/stream/) is a tool that collects and processes machine data and allows you to process machine data into a database for later analysis.

This article shows how to ingest data with Cribl Stream.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer [cluster and database](/azure/data-explorer/create-cluster-and-database) with the default cache and retention policies **or** a [KQL database in Microsoft Fabric](/fabric/real-time-analytics/create-database).

## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal will be the identity used by the connector to write data to your table in Kusto. You'll later grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create your secret key or certificate to authenticate with Cribl Stream

To create a client secret:  
<!-- need accurate code -->
```azurecli-interactive
az ad app credential reset --id <client_id>
```

To download a certificate:
<!-- NEED info-->

## Create a target table

1. From your query environment, create a table called `CriblSyslogs` using the following command:

    ```kusto
    .create table CriblSyslogs (_raw: string, _time: long, cribl_pipe: dynamic)
    ```  
<!--example seems to use the database Sample for ingesting, is this correct?-->
1. Create a database ingestion mapping `Sample` for ingested data using the following command:

    ```kusto
    .create database Sample ingestion json mapping "SyslogMapping"

    ```
-->
1. Add the ingestors role to your Entra ID application on the Sample database.

    ```kusto
.add database Sample ingestors ( 'aadapp=34803982-eb55-4f46-bd4f-c020c8e8dfc0;771d663d-da6c-44bd-bc0a-e9a46bc4bfb6') 
<!--
1. Create an [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy) on the table for configurable queued ingestion latency.

    > [!TIP]
    > The ingestion batching policy is a performance optimizer and includes three parameters. The first condition satisfied triggers ingestion into the Azure Data Explorer table.

    ```kusto
    .alter table SyslogMapping policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
    ```
-->
1. Use the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) to grant permission to work with the database.

    ```kusto
    .add database YOUR_DATABASE_NAME admins  ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'AAD App'
    ```

> [!NOTE]
> 

## Connect a KQL database to Cribl Stream

### Select destination

To connect Cribl Stream to your kql database do the following:

1. From the top navigation in Cribl select **Manage** then select a Worker Group.

1. Select **Routing** > **QuickConnect (Stream)** > **Add Destination**. <!-- confirm with Ram that this is how its called>

1. In the **Set up new QuickConnect Destination** window, choose **Azure Data Explorer**, then **Add now**.
:::image type="content" source="../media/ingest-data-cribl/add-azure-data-explorer.png" alt-text="Screenshot of the Set up new QuickConnect Destination window in Cribl with Azure Data Explorer selected."  lightbox="../media/ingest-data-cribl/add-azure-data-explorer.png":::

> [!NOTE]
> Currently the Azure Data Explorer choice serves for both Real-Time Intelligence and Azure Data Explorer.

### Setup general settings

In the **New Data Explorer** window set the following settings:

|Setting  |Description  |
|---------|---------|
|**Output ID**| The name by which to identify your destination. |
| **Ingestion Mode** | Select Batching (default) or Streaming for ingestion. Batching allows your table to pull batches of data from a Cribl storage container when ingesting large amounts of data over a short amount of time. Streaming sends data directly to the target kql table. Streaming is useful for ingesting smaller amounts of data and can achieve lower latency than batching. Batching is selected by default. |
|**Retries** section| Available when Ingestion mode is Streaming.  (left tab) becomes available.|
| **Cluster base URI** | Your ADX cluster base URI in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](add-cluster-connection.md#add-a-cluster-connection). |
| **Ingestion service URI**|  When Batching mode is selected an Ingestion service URI is needed. For more information, see |
| **Database name** | The name of the database holding your target table. |
| **Table name** | The name of your target table.|
|**Validate database settings**| Validates the database name and credentials you've entered when you save or start your destination and validates the table name, except when **Add mapping object** is on. Options are **Yes** (default) or **No**. This setting should be disabled if your app doesn't have both *Database Viewer* and *Table Viewer* roles.|
| **Add mapping object** | Displayed only when Batching mode is selected instead of the default **Data mapping** text field. Options are **Yes** or **No** (default). Selecting **Yes** opens a window to enter a data mapping as a JSON object. |
| **Data mapping**| The default view when **If Add mapping object** is set to **Off**. The data mapping as defined in the [Create a target table](#create-a-target-table) step.|
| **Compress** | By default, this Destination compresses data using gzip; otherwise it sends the data uncompressed. This setting is not available when Data format is set to Parquet.|
| **Data format**| ISON (default), Raw or Parquet. Parquet is only available in **Batching** mode and supported only on Linux). Choosing Parquet opens a Parquet Settings tab, to select the Parquet schema.|
|**Backpressure behavior**| Choose whether to block (default) or drop events when receivers are exerting backpressure. When **Ingestion mode** is set to Streaming, the Persistent Queue option becomes available. See Persistent Queue Settings below.|
|**Tags**| Optional tags to filter and group destinations in Cribl Stream’s Manage Destinations page. Use a tab or hard return between tag names. These tags aren’t added to processed events. |

<!-- from kafka -->
## Run the lab

The following lab is designed to give you the experience of starting to create data, setting up the Cribl Stream connector, and streaming this data to your kql query engine with the connector. You can then look at the ingested data.

### Map the 

### Authenticate 
You can authenticate with Cribl Stream using:

*  Client secret method
*  Client secret method
*  Client secret method



The connector will start queueing ingestion processes to Azure Data Explorer.



## Query and review data

### Confirm data ingestion

1. Wait for data to arrive in the `Storms` table. To confirm the transfer of data, check the row count:

    ```kusto
    Storms | count
    ```

1. Confirm that there are no failures in the ingestion process:

    ```kusto
    .show ingestion failures
    ```

    Once you see data, try out a few queries.

### Query the data

1. To see all the records, run the following [query](/azure/data-explorer/kusto/query/tutorials/learn-common-operators):

    ```kusto
    Syslog
    ```

1. Use `where` and `project` to filter specific data:

    ```kusto
    Storms
    | where EventType == 'Drought' and State == 'TEXAS'
    | project StartTime, EndTime, Source, EventId
    ```

1. Use the [`summarize`](/azure/data-explorer/kusto/query/summarize-operator) operator:

    ```kusto
    Storms
    | summarize event_count=count() by State
    | where event_count > 10
    | project State, event_count
    | render columnchart
    ```

    :::image type="content" source="/azure/data-explorer/includes/media/ingest-data-kafka/kusto-query.png" alt-text="Screenshot of Kafka query column chart results in Azure Data Explorer.":::

For more query examples and guidance, see [Write queries in KQL](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) and [Kusto Query Language documentation](/azure/data-explorer/kusto/query/index).

## Reset

To reset, do the following steps:

1. Stop the containers (`docker-compose down -v`)
1. Delete (`drop table Storms`)
1. Re-create the `Storms` table
1. Recreate table mapping
1. Restart containers (`docker-compose up`)

## Clean up resources

To delete the Azure Data Explorer resources, use [az cluster delete](/cli/azure/kusto/cluster#az-kusto-cluster-delete) or [az Kusto database delete](/cli/azure/kusto/database#az-kusto-database-delete):

```azurecli-interactive
az kusto cluster delete -n <cluster name> -g <resource group name>
az kusto database delete -n <database name> --cluster-name <cluster name> -g <resource group name>
```

