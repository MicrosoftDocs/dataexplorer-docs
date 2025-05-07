---
ms.topic: include
ms.date: 09/17/2024
---

### Set up general settings

In the **New Data Explorer** window, in **General Settings** set the following settings:

|Setting  |Value| Description  |
|---------|---------|---------|
|*Output ID*|\<OutputID\>, for instance, *KustoDestination* |The name used to identify your destination. |
| *Ingestion Mode* |**Batching** (default) or **Streaming** |The settings for ingestion mode. Batching allows your table to pull batches of data from a Cribl storage container when ingesting large amounts of data over a short amount of time. Streaming sends data directly to the target KQL table. Streaming is useful for ingesting smaller amounts of data, or for example, sending a critical alert in real-time. Streaming can achieve lower latency than batching. If the ingestion mode is set to *Streaming*, you'll need to enable a streaming policy. For more information, see [Streaming ingestion policy](/azure/data-explorer/kusto/management/streaming-ingestion-policy). |
| *Cluster base URI* | [base URI](#ingestion-uri) |The [base URI](#ingestion-uri).|
| *Ingestion service URI*| [ingestion URI](#ingestion-uri) |Displays when **Batching** mode is selected. The [ingestion URI](#ingestion-uri). |
| *Database name* |\<DatabaseName\> |The name of your target database.|
| *Table name* |\<TableName\> |The name of your target table.|
|*Validate database settings*| **Yes** (default) or **No**. |Validates the service principal app credentials you entered when you save or start your destination. It validates the table name, except when **Add mapping object** is on. This setting should be disabled if your app doesn't have both *Database Viewer* and *Table Viewer* roles.|
| *Add mapping object* | **Yes** or **No** (default.) |Displayed only when Batching mode is selected instead of the default **Data mapping** text field. Selecting **Yes** opens a window to enter a data mapping as a JSON object. |
| *Data mapping*| The mapping schema name as defined in the [Create a target table](#create-a-target-table) step. | The mapping schema name. The default view when **Add mapping object** is set to **No**. |
| *Compress* | gzip (default) | When *Data format* is set to Parquet, *Compress* isn't available. |
| *Data format*| JSON (default), Raw, or Parquet. | The data format. Parquet is only available in **Batching** mode and only supported on Linux. |
|*Backpressure behavior*| **Block** (default) or **Drop** | Choose whether to block or drop events when receivers are exerting backpressure.|
|*Tags*|Optional values | Optional tags to filter and group destinations in Cribl Stream’s Manage Destinations page. Use a tab or hard return between tag names. These tags aren’t added to processed events. |

When completed, select **Next**.

### Authentication settings

Select **Authentication Settings** in the sidebar. Use the values you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) along with your [base URI](#ingestion-uri) as follows:

|Setting  |Value| Description  |
|---------|---------|---------|
|*Tenant ID*|\<TenantID\> |Use the `tenant` value you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |
| *Client ID*|\<ClientID\> | Use the `appId` values you saved in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal).  |
|*Scope*| `<baseuri>/.default`| Use the value from [base URI](#ingestion-uri) for *baseuri*. |
|*Authentication method*| **Client secret**, **Client secret (text secret)**, or **Certificate**  |Options are **Client secret** Use the client secret of the Microsoft Entra application you created in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) for **Client secret**. For  **Certificate** your certificate uses the public key you registered/will register for the Microsoft Entra application you created in [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal). |

Then select **Next**.

### Persistent Queue

Displays when *Ingestion mode* is set to **Streaming**, and *Backpressure behavior* is set to **Persistent Queue**.

|Setting  |Value| Description  |
|---------|---------|---------|
|*Max file size*| 1 MB (default) | The maximum queue file size to reach before closing the file. Include units such as KB or MB, when entering a number. |
|*Max queue size*| 5 GB (default) | The maximum amount of disk space that the queue can consume on each Worker Process before the Destination stops queueing data. A required value of positive numbers with units such as KB, MB, or GB. The maximum value is 1 TB.|
|*Queue file path*|`$CRIBL_HOME/state/queues` (default) | The persistent queue file location. Cribl Stream appends `/<worker‑id>/<output‑id>` to this value.|
|*Compression*|None (default), gzip | The compression method to use to compress the persisted data, upon closing. |
|*Queue-full behavior*|**Block** or **Drop** | Choose to block or drop events when the queue exerts backpressure due to low disk or full disk capacity.|
|*Strict ordering*|**Yes** (default) or **No** | When set to **Yes** events are forwarded based on first in, first out ordering. Set to **No** to send new events before earlier queued events. |
|*Drain rate limit (EPS)*| 0 (default)| This option is displayed when **Strict ordering** is set to **No**, to allow you to set a throttling rate (in events per second) on writing from the queue to receivers. Throttling the drain rate of queued events boosts new or active connection throughput. Zero disables throttling.|
|*Clear Persistent Queue*| NA | Select to delete files currently queued for delivery to your Destination. You'll need to confirm this action since queued data is permanently deleted without getting delivered. |

When complete, select **Next**.

### Processing settings

|Setting  |Value| Description  |
|---------|---------|---------|
|*Pipeline*|<\defined_pipeline\> | An optional pipeline to process data before sending it out using this output.|
|*System fields*|`cribl_pipe` (default), `cribl_host`, `cribl_input`, `cribl_output`, `cribl_route`, or `cribl_wp` | A list of fields that are automatically added to events before they're sent to their destination. Wildcards are supported.|

When complete, select **Next**.

### Parquet settings

Displays when **Parquet** is selected for *Data Format*.

Choosing Parquet opens a Parquet Settings tab, to select the Parquet schema.

|Setting  |Value| Description  |
|---------|---------|---------|
|Automatic schema|**On** or **Off** | Select **On** to generate a Parquet schema based on the events of each Parquet file that Cribl Stream writes.|
|*Parquet schema*|dropdown | Displays when *Automatic schema* is set to **Off** to allow you to select your parquet schema.|
| *Parquet version*|1.0, 2.4, 2.6 (default) | The version determines the supported data types and how they're represented. |
|*Data page version*|V1, V2 (default) |The data page serialization format. If your Parquet reader doesn't support Parquet V2, use V1.|
|*Group row limit*|1000 (default) |The maximum number of rows that every group can contain. |
|*Page size*|1 MB (default) |The target memory size for page segments. Lower values can improve reading speed, while higher values can improve compression. |
|*Log invalid rows*|**Yes** or **No** | When **Yes** is selected, and *Log level* is set to `debug`, outputs up to 20 unique rows that were skipped due to data format mismatch.|
|*Write statistics*| **On** (default) or **Off**|Select **On** if you have Parquet statistic viewing tools configured.|
|*Write page indexes*| **On** (default) or **Off** |Select **On** if your Parquet reader uses Parquet page index statistics to enable page skipping. |
|*Write page checksum*| **On** or **Off** |Select **On** if you use Parquet tools to check data integrity using Parquet page checksums.|
|Metadata (optional)*| |The Destination file metadata properties that can be included as key-value pairs. |

### Retries

Displays when Ingestion mode is set to **Streaming**.

|Setting  |Value| Description  |
|---------|---------|---------|
|*Honor Retry-After header* | **Yes** or **No** |Whether to honor a `Retry-After` header. When enabled, a received `Retry-After` header takes precedence is used before other configured options in the Retries section, as long as the header specifies a delay of 180 seconds or less. Otherwise, `Retry-After` headers are ignored.|
|*Settings for failed HTTP requests*|HTTP status codes|A list of HTTP status codes to automatically retry if they fail to connect. Cribl Stream automatically retries 429 failed requests.|
|*Retry timed-out HTTP requests*|**On** or **Off**|When set, more retry behavior settings become available.|
|Pre-backoff interval (ms)|1000 ms (default) | The wait time before retrying.|
|Backoff multiplier|2 s (default) | Used as the base for exponential backoff algorithm to determine the interval between retries.|
|*Backoff limit (ms)*| 10,000 ms (default)| The maximum backoff interval for the final streaming retry. Possible values range from 10,000 milliseconds (10 seconds) to 180,000 milliseconds (3 minutes.)|

When complete, select **Next**.

### Advanced settings

Select **Advanced Settings** from the sidebar. The following describes the advanced settings when **Batching** is selected:

|Setting  |Value| Description  |
|---------|---------|---------|
| *Flush immediately* | **Yes** or **No** (default.) | Set to **Yes** to override data aggregation in Kusto. For more information, see [Best practices for the Kusto Ingest library](/azure/data-explorer/kusto/api/netfx/kusto-ingest-best-practices).|
|*Retain blob on success* | **Yes** or **No** (default.) | Set to **Yes** to retain data blob upon ingestion completion.|
|*Extent tags* |<\ExtentTag, ET2,...\> |Set tags, if desired, to partitioned extents of the target table. |
|*Enforce uniqueness via tag values* | | Select **Add value** to specify an `ingest-by` value list to use to filter incoming extents and discard the extents matching a listed value. For more information, see [Extents (data shards)](/azure/data-explorer/kusto/management/extents-overview)|
|*Report level* | **DoNotReport**, **FailuresOnly** (default), and **FailuresAndSuccesses**.|The ingestion status reporting level. |
|*Report method* |**Queue** (default), **Table**, and **QueueAndTable** (Recommended.) |Target for ingestion status reporting. |
|*Additional fields* | |Add more configuration properties, if desired, to send to the ingestion service.|
|*Staging location* |`/tmp` (default) |Local filesystem location in which to buffer files before compressing and moving them to the final destination. Cribl recommends a stable and high-performance location.|
|*File name suffix expression* | `.${C.env["CRIBL_WORKER_ID"]}.${__format}${__compression === "gzip" ? ".gz" : ""}`(default)| A JavaScript expression enclosed in quotes or backticks used as the output filename suffix. `format` can be *JSON* or *raw*, and `__compression` can be *none* or *gzip*. A random sequence of six characters is appended to the end of the file names to prevent them from getting overwritten.|
| *Max file size (MB)* |32 MB (default) |The maximum uncompressed output file size that files can reach before they close and are moved to the storage container.|
| *Max file open time (sec)* | 300 seconds (default)|The maximum amount of time, in seconds, to write to a file before it's closed and moved to the storage container.  |
| *Max file idle time (sec)* |30 seconds (default)  | The maximum amount of time, in seconds, to keep inactive files open before they close and are moved to the storage container. |
| *Max open files* |100 (default) |The maximum number of files to keep open at the same time before the oldest open files are closed and moved to the storage container.|
| *Max concurrent file parts* | 1 (default) |The maximum number of file parts to upload at the same time. The default is 1 and the highest is 10. Setting the value to one allows sending one part at a time, sequentially. |
| *Remove empty staging dirs* | **Yes** (default) or **No** | When toggled on Cribl Stream deletes empty staging directories after moving files. This prevents the proliferation of orphaned empty directories. When enabled, exposes *Staging cleanup period*.|
| *Staging cleanup period* | 300 (default) | The amount in time in seconds until empty directories are deleted when *Remove staging dirs* is enabled. Displays when *Remove empty staging dirs* is set to **Yes**. The minimum value is 10 seconds, and maximum is 86,400 seconds (every 24 hours.) |
| *Environment* | | When empty (default) the configuration is enabled everywhere. If you’re using GitOps, you can specify the Git branch where you want to enable the configuration. |

When completed, select **Save**.

### Connection configuration

From the *Connection Configuration* window that opens, select **Passthru connection** then **Save**.
The connector starts queueing the data.

### Confirm data ingestion

1. Once data arrives in the table, confirm the transfer of data, by checking the row count:

    ```kusto
    <Tablename> 
    | count
    ```

1. Confirm the ingestions queued in the last five minutes:

    ```kusto
    .show commands-and-queries 
    | where Database == "" and CommandType == "DataIngestPull" 
    | where LastUpdatedOn >= ago(5m)
    ```

1. Confirm that there are no failures in the ingestion process:

    * For batching:

    ```kusto
    .show ingestion failures
    ```

    * For streaming:

    ```kusto
    .show streamingingestion failures 
    | order by LastFailureOn desc
    ```

1. Verify data in your table:

    ```kusto
    <TableName>
    | take 10
    ```

For query examples and guidance, see [Write queries in KQL](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) and [Kusto Query Language documentation](/azure/data-explorer/kusto/query/index).
