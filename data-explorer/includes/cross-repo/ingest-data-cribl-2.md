---
ms.topic: include
ms.date: 07/03/2024
---

## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programmatically, as in the following example.

This service principal will be the identity used by the connector to write data to your table in Kusto. You'll later grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create a target table

Create a target table for the incoming data and an ingestion mapping to map the ingested data columns to the columns in the target table.

1. Run the following [table creation command](/azure/data-explorer/kusto/management/create-table-command.md) in your query editor, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (_raw: string, _time: long, cribl_pipe: dynamic)
    ```

1. Run the following [.create ingestion mapping command](/azure/data-explorer/kusto/management/create-ingestion-mapping-command.md), replacing the placeholders *TableName* with the target table name and *TableNameMapping* with the name of the ingestion mapping:

    ```kusto
    .create table <TableName> ingestion csv mapping '<TableNameMapping>' 'CriblLogMapping' '[{"Name":"_raw","DataType":"string","Ordinal":"0","ConstValue":null},{"Name":"_time","DataType":"long","Ordinal":"1","ConstValue":null},{"Name":"cribl_pipe","DataType":"dynamic","Ordinal":"2","ConstValue":null}]'
    ```

1. Grant the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) [database ingestor](/azure/data-explorer/kusto/access-control/role-based-access-control.md) role permissions to work with the database. For more information, see [Examples](../../kusto/management/manage-database-security-roles.md). Replace the placeholder *DatabaseName* with the name of the target database and *ApplicationID* with the `AppId` value you saved when creating a Microsoft Entra service principal.

    ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'App Registration'
    ```
<!--1. Create an [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy) on the table for configurable queued ingestion latency.

    > [!TIP]
    > The ingestion batching policy is a performance optimizer and includes three parameters. The first condition satisfied triggers ingestion into the Azure Data Explorer table.

    ```kusto
    .alter table SyslogMapping policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
    ```
-->
## Connect a KQL table to Cribl Stream

The following section describes how to connect your KQL table to Cribl Stream. For each KQL table that you want to connect, you'll need a separate Cribl Stream destination connector.

### Select destination

To connect Cribl Stream to your KQL database do the following:

1. From the top navigation in Cribl select **Manage** then select a Worker Group.

1. Select **Routing** > **QuickConnect (Stream)** > **Add Destination**. <!-- confirm with Ram that this is how its called>

1. In the **Set up new QuickConnect Destination** window, choose **Azure Data Explorer**, then **Add now**.
:::image type="content" source="../media/ingest-data-cribl/add-azure-data-explorer.png" alt-text="Screenshot of the Set up new QuickConnect Destination window in Cribl with Azure Data Explorer selected."  lightbox="../media/ingest-data-cribl/add-azure-data-explorer.png":::

### Setup general settings

In the **New Data Explorer** window in **General Settings** set the following settings:

|Setting  |Description  |
|---------|---------|
|*Output ID*| The name by which to identify your destination. |
| *Ingestion Mode* | Select **Batching** (default) or **Streaming** for ingestion. Batching allows your table to pull batches of data from a Cribl storage container when ingesting large amounts of data over a short amount of time. Streaming sends data directly to the target KQL
 table. Streaming is useful for ingesting smaller amounts of data and can achieve lower latency than batching. |
|*Retries* | Available when Ingestion mode is **Streaming**.|
| *Cluster base URI* | The [base URI](#ingestion-uri).|
| *Ingestion service URI*|  Displays when **Batching** mode is selected. The [ingestion URI](#ingestion-uri). |
| *Database name* | The name of your target database.|
| *Table name* | The name of your target table.|
|*Validate database settings*| Options are **Yes** (default) or **No**. Validates the database name and credentials you've entered when you save or start your destination and validates the table name, except when **Add mapping object** is on.  This setting should be disabled if your app doesn't have both *Database Viewer* and *Table Viewer* roles.|
| *Add mapping object* | Options are **Yes** or **No** (default). Displayed only when Batching mode is selected instead of the default **Data mapping** text field. Selecting **Yes** opens a window to enter a data mapping as a JSON object. |
| *Data mapping*| The default view when **Add mapping object** is set to **No**. The name of the mapping schema defined in the [Create a target table](#create-a-target-table) step.|
| *Compress* | gzip (default) When *Data format* is set to Parquet, *Compress* isn't available. |
| *Data format*| JSON (default), Raw, or Parquet. Parquet is only available in **Batching** mode and supported only on Linux. Choosing Parquet opens a Parquet Settings tab, to select the Parquet schema.|
|*Backpressure behavior*| Choose whether to **Block** (default) or **Drop** events when receivers are exerting backpressure.|
|*Tags*| Optional tags to filter and group destinations in Cribl Stream’s Manage Destinations page. Use a tab or hard return between tag names. These tags aren’t added to processed events. |
|*Persistent Queue* | When **Ingestion mode** is set to **Streaming**, and **Backpressure behavior** is set to **Persistent Queue**, additional settings become available. |

When completed, select **Next**.

### Setup authentication settings

Select **Authentication Settings** in the sidebar. Use the values you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) along with your [base URI](#ingestion-uri) as follows:
|Setting  |Description  |
|---------|---------|
|*Tenant ID*| Use the `tenant` value you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal).  |
| *Client ID*| Use the `appId` values you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal).  |
|*Scope*| `<baseuri>/.default` For *baseuri* use the value from [base URI](#ingestion-uri).  |
|*Authentication method*| Options are **Client secret** (the client secret of the Entra application you created in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal)),  **Client secret (text secret)**, or **Certificate** (a certificate whose public key you registered/will register for the Entra application you created in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal)). |

Then select **Next**.

<!-- I skipped processing settings, are any changes needed?-->

### Setup advanced settings

1. Select **Advanced Settings** from the sidebar.  The following describes the advanced settings when **Batching** is selected:

|Setting  |Description  |
|---------|---------|
| *Flush immediately* | Options are **Yes** or **No** (default). Set to **Yes** to override data aggregation in Kusto. For more information, see [Best practices for the Kusto Ingest library](../../kusto/api/netfx/kusto-ingest-best-practices.md).|
|*Retain blob on success* | Options are **Yes** or **No** (default). Set to **Yes** to retain data blob upon ingestion completion.|
|*Extent tags* | Set tags to partitioned extants of the target table. |
|*Enforce uniqueness via tag values* | Select **Add value** to specify an `ingest-by` value list to use to filter incoming extents and discard those matching a listed value. For more information, see [Extents (data shards)](../../kusto/management/extents-overview.md)|
|*Report level* | The ingestion status reporting level. Options are **DoNotReport**, **FailuresOnly** (default), and **FailuresAndSuccesses**.|
|*Report method* | Target for ingestion status reporting. Options are **Queue** (default), **Table**, and **QueueAndTable** (Recommended).|
|*Additional fields* | Add additional configuration properties, if desired, to send to the ingestion service.|
|*Staging location* | Local filesystem location in which to buffer files before compressing and moving them to the final destination. Cribl recommends that this location be stable and high-performance. Defaults to /tmp.|
|*File name suffix expression* | A JavaScript expression enclosed in quotes or backticks used as the output filename suffix. </br>Default value: `.${C.env["CRIBL_WORKER_ID"]}.${__format}${__compression === "gzip" ? ".gz" : ""}`, where `__format` can be `json` or `raw`, and `__compression` can be `none` or `gzip`. A random sequence of 6 characters is appended to the end of the file names to prevent them from getting overwritten.|
| *Max file size (MB)* | The maximum uncompressed output file size that files can reach before they are closed and moved to the storage container. The default is 32 MB. |
| *Max file open time (sec)* | The maximum amount of time in seconds to write to a file before it is closed and moved to the storage container. The default is 300 seconds. |
| *Max file idle time (sec)* | The maximum amount of time in seconds to keep inactive files open before they are closed and moved to the storage container. The default is  30 seconds. |
| *Max open files* | The maximum number of files to keep open at the same time before the oldest open files are closed and moved to the storage container. The default is 100. |
| *Max concurrent file parts* | The maximum number of file parts to upload at the same time. The default is 1, the highest is 10. Setting the value to 1 sets sending to one part at a time, sequentially. |
| *Remove empty staging dirs* | Options are **Yes** or **No** (default). When toggled on (the default), Cribl Stream deletes empty staging directories after moving files. This prevents the proliferation of orphaned empty directories. When enabled, exposes this additional option:|
| *Staging cleanup period* | The amount in time in seconds until empty directories are deleted when *Remove staging dirs* is enabled. Displays when *Remove empty staging dirs* is set to **Yes**. Default is 300, minimum is 10 seconds, and maximum is 86400 seconds (every 24 hours). |
| *Environment* | When empty (default) the configuration will be enabled everywhere. If you’re using GitOps, you can specify the Git branch where you want to enable the configuration. |
<!--confirm that these are the default settings for setting a Cribl connection does this exist? | *Add output ID* | Options are **On** or **Off**. Set to **On** if you want your destination name appended to staging directory pathnames for organization or troubleshooting between multiple destinations. |
-->
When completed, select **Save**.

### Setup connection configuration

From the *Connection Configuration* window that opens, select **Passthru connection** then **Save**.
The connector will start queueing the data.

### Confirm data ingestion

1. Wait for data to arrive in the  table. To confirm the transfer of data, check the row count:

    ```kusto
    <Tablename> 
    | count
    ```

1. Confirm that there are no failures in the ingestion process:

    ```kusto
    .show ingestion failures
    ```

1. Verify data in your table:

    ```kusto
    <TableName>
    | take 10
    ```

For query examples and guidance, see [Write queries in KQL](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) and [Kusto Query Language documentation](/azure/data-explorer/kusto/query/index).
