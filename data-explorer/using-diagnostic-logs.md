---
title: Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs
description: Learn how to set up diagnostic logs for Azure Data Explorer to monitor ingestion commands, and query operations.
ms.reviewer: guregini
ms.topic: how-to
ms.date: 06/21/2021
---

# Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) provide data about the operation of Azure resources. Azure Data Explorer uses diagnostic logs for insights on ingestion, commands, query, and tables. You can export operation logs to Azure Storage, event hub, or Log Analytics to monitor ingestion, commands, and query status. Logs from Azure Storage and Azure Event Hubs can be routed to a table in your Azure Data Explorer cluster for further analysis.

> [!IMPORTANT] 
> Diagnostic log data may contain sensitive data. Restrict permissions of the logs destination according to your monitoring needs. 

[!INCLUDE [azure-monitor-vs-log-analytics](includes/azure-monitor-vs-log-analytics.md)]

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).
* Create [a cluster and database](create-cluster-database-quickstart.md).

## Set up diagnostic logs for an Azure Data Explorer cluster

Diagnostic logs can be used to configure the collection of the following log data:

# [Ingestion](#tab/ingestion)

> [!NOTE]
> Ingestion logs are supported for queued ingestion to the ingestion endpoint using SDKs, data connections, and connectors.
>
> Ingestion logs aren't supported for streaming ingestion, direct ingestion to the engine, ingestion from query, or set-or-append commands.

> [!NOTE]
> Failed ingestion logs are only reported for the final state of an ingest operation, unlike the [Ingestion result](using-metrics.md#ingestion-metrics) metric, which is emitted for transient failures that are retried internally.

* **Successful ingestion operations**: These logs have information about successfully completed ingestion operations.
* **Failed ingestion operations**: These logs have detailed information about failed ingestion operations including error details. 
* **Ingestion batching operations**: These logs have detailed statistics of batches ready for ingestion (duration, batch size, blobs count, and [batching types](kusto/management/batchingpolicy.md#sealing-a-batch)).

# [Commands and Queries](#tab/commands-and-queries)

* **Commands**: These logs have information about admin commands that have reached a final state.
* **Queries**: These logs have detailed information about queries that have reached a final state.

    > [!NOTE]
    > The command and query log data contains the query text.
    
# [Tables](#tab/tables)

* **TableUsageStatistics**: These logs have detailed information about the tables whose extents were scanned during query execution.

    > [!NOTE]
    > The `TableUsageStatistics` log data doesn't contain the command or query text.

* **TableDetails**: These logs have detailed information about the cluster's tables.

---

The data is then archived into a Storage account, streamed to an event hub, or sent to Log Analytics, as per your specifications.

### Enable diagnostic logs

Diagnostic logs are disabled by default. To enable diagnostic logs, do the following steps:

1. In the [Azure portal](https://portal.azure.com), select the Azure Data Explorer cluster resource that you want to monitor.
1. Under **Monitoring**, select **Diagnostic settings**.
  
    ![Add diagnostics logs.](media/using-diagnostic-logs/add-diagnostic-logs.png)

1. Select **Add diagnostic setting**.
1. In the **Diagnostic settings** window:

    :::image type="content" source="media/using-diagnostic-logs/configure-diagnostics-settings.png" alt-text="Configure diagnostics settings.":::

    1. Enter a **Diagnostic setting name**.
    1. Select one or more targets: a Log Analytics workspace, a storage account, or an event hub.
    1. Select logs to be collected: `SucceededIngestion`, `FailedIngestion`, `IngestionBatching`, `Command`, or `Query`, `TableUsageStatistics`, or `TableDetails`.
    1. Select [metrics](using-metrics.md#supported-azure-data-explorer-metrics) to be collected (optional).  
    1. Select **Save** to save the new diagnostic logs settings and metrics.

New settings will be set in a few minutes. Logs then appear in the configured archival target (Storage account, Event Hub, or Log Analytics). 

> [!NOTE]
> If you send logs to Log Analytics, the `SucceededIngestion`, `FailedIngestion`, `IngestionBatching`, `Command`, `Query`, `TableUsageStatistics` and `TableDetails` logs will be stored in Log Analytics tables named: `SucceededIngestion`, `FailedIngestion`, `ADXIngestionBatching`, `ADXCommand`, `ADXQuery`, `ADXTableUsageStatistics` and `ADXTableDetails` respectively.

## Diagnostic logs schema

All [Azure Monitor diagnostic logs share a common top-level schema](/azure/azure-monitor/platform/diagnostic-logs-schema). Azure Data Explorer has unique properties for their own events. All logs are stored in a JSON format.

# [Ingestion](#tab/ingestion)

### Ingestion logs schema

Log JSON strings include elements listed in the following table:

|Name               |Description
|---                |---
|time               |Time of the report
|resourceId         |Azure Resource Manager resource ID
|operationName      |Name of the operation: 'MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION'
|operationVersion   |Schema version: '1.0' 
|category           |Category of the operation. `SucceededIngestion`, `FailedIngestion` or `IngestionBatching`. Properties differ for [successful operation](#successful-ingestion-operation-log), [failed operation](#failed-ingestion-operation-log) or [batching operation](#ingestion-batching-operation-log).
|properties         |Detailed information of the operation.

#### Successful ingestion operation log

**Example:**

```json
{
    "time": "2019-05-27 07:55:05.3693628",
    "resourceId": "/SUBSCRIPTIONS/12534000-8109-4D84-83AD-576C0D5E1AAA/RESOURCEGROUPS/myResourceGroup/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/mycluster",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION",
    "operationVersion": "1.0",
    "category": "SucceededIngestion",
    "properties":
    {
        "SucceededOn": "2019-05-27 07:55:05.3693628",
        "OperationId": "b446c48f-6e2f-4884-b723-92eb6dc99cc9",
        "Database": "Samples",
        "Table": "StormEvents",
        "IngestionSourceId": "66a2959e-80de-4952-975d-b65072fc571d",
        "IngestionSourcePath": "https://kustoingestionlogs.blob.core.windows.net/sampledata/events8347293.json",
        "RootActivityId": "d0bd5dd3-c564-4647-953e-05670e22a81d"
    }
}
```
**Properties of a successful operation diagnostic log**

|Name               |Description
|---                |---
|SucceededOn        |Time of ingestion completion
|OperationId        |Azure Data Explorer ingestion operation ID
|Database           |Name of the target database
|Table              |Name of the target table
|IngestionSourceId  |ID of the ingestion data source
|IngestionSourcePath|Path of the ingestion data source or blob URI
|RootActivityId     |Activity ID

#### Failed ingestion operation log

**Example:**

```json
{
    "time": "2019-05-27 08:57:05.4273524",
    "resourceId": "/SUBSCRIPTIONS/12534000-8109-4D84-83AD-576C0D5E1AAA/RESOURCEGROUPS/myResourceGroup/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/mycluster",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION",
    "operationVersion": "1.0",
    "category": "FailedIngestion",
    "properties":
    {
        "failedOn": "2019-05-27 08:57:05.4273524",
        "operationId": "5956515d-9a48-4544-a514-cf4656fe7f95",
        "database": "Samples",
        "table": "StormEvents",
        "ingestionSourceId": "eee56f8c-2211-4ea4-93a6-be556e853e5f",
        "ingestionSourcePath": "https://kustoingestionlogs.blob.core.windows.net/sampledata/events5725592.json",
        "rootActivityId": "52134905-947a-4231-afaf-13d9b7b184d5",
        "details": "Permanent failure downloading blob. URI: ..., permanentReason: Download_SourceNotFound, DownloadFailedException: 'Could not find file ...'",
        "errorCode": "Download_SourceNotFound",
        "failureStatus": "Permanent",
        "originatesFromUpdatePolicy": false,
        "shouldRetry": false
    }
}
```

**Properties of a failed operation diagnostic log**

|Name               |Description
|---                |---
|FailedOn           |Time of ingestion completion
|OperationId        |Azure Data Explorer ingestion operation ID
|Database           |Name of the target database
|Table              |Name of the target table
|IngestionSourceId  |ID of the ingestion data source
|IngestionSourcePath|Path of the ingestion data source or blob URI
|RootActivityId     |Activity ID
|Details            |Detailed description of the failure and error message
|ErrorCode          |[Ingestion error code](error-codes.md)
|FailureStatus      |`Permanent` or `RetryAttemptsExceeded` indicates that operation has exceeded the retry attempts limit or timespan limit following a recurring transient error.
|OriginatesFromUpdatePolicy|True if failure originates from an update policy
|ShouldRetry        |True if retry may succeed

#### Ingestion batching operation log

**Example:**

```json
{
  "resourceId": "/SUBSCRIPTIONS/12534000-8109-4D84-83AD-576C0D5E1AAA/RESOURCEGROUPS/myResourceGroup/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/mycluster",
  "time": "2021-04-18T19:19:57.0211782Z",
  "operationVersion": "1.0",
  "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGESTIONBATCHING/ACTION",
  "category": "IngestionBatching",
  "correlationId": "2bb51038-c7dc-4ebd-9d7f-b34ece4cb735",
  "properties": {
    "Timestamp": "2021-04-18T19:19:57.0211782Z",
    "Database": "Samples",
    "Table": "StormEvents",
    "BatchingType": "Time",
    "SourceCreationTime": "2021-04-18T19:14:53.9543732Z",
    "BatchTimeSeconds": 302.1449075,
    "BatchSizeBytes": 3988,
    "DataSourcesInBatch": 2,
    "RootActivityId": "2bb51038-c7dc-4ebd-9d7f-b34ece4cb735"
  }
}

```
**Properties of an ingestion batching operation diagnostic log**

|Name               |Description
|---                   |---
| Timestamp            | The time of the batching reporting |
| Database             | Name of the database holding the target table |
| Table                | Name of the target table into which the data is ingested |
| BatchingType         | The trigger for sealing a batch. For a complete list of batching types, see [Batching types](kusto/management/batchingpolicy.md#sealing-a-batch). |
| SourceCreationTime   | Minimal time (UTC) at which blobs in this batch were created |
| BatchTimeSeconds     | Total batching time of this batch (seconds) |
| BatchSizeBytes       | Total uncompressed size of data in this batch (bytes) |
| DataSourcesInBatch   | Number of data sources in this batch |
| RootActivityId       | The operation's activity ID |


# [Commands and Queries](#tab/commands-and-queries)

### Commands and Queries logs schema

Log JSON strings include elements listed in the following table:

|Name               |Description
|---                |---
|time               |Time of the report
|resourceId         |Azure Resource Manager resource ID
|operationName      |Name of the operation: 'MICROSOFT.KUSTO/CLUSTERS/COMMAND/ACTION' or "MICROSOFT.KUSTO/CLUSTERS/QUERY/ACTION". Properties differ for commands and query logs.
|operationVersion   |Schema version: '1.0' 
|category           |Category of the operation: `Command` or `Query`. Properties differ for commands and query logs.
|properties         |Detailed information of the operation.

#### Command log

**Example:**

```json
{
    "time": "",
    "resourceId": "",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/COMMAND/ACTION",
    "operationVersion": "1.0",
    "category": "Command",
    "properties":
    {
        "RootActivityId": "d0bd5dd3-c564-4647-953e-05670e22a81d",
        "StartedOn": "2020-09-12T18:06:04.6898353Z",
        "LastUpdatedOn": "2020-09-12T18:06:04.6898353Z",
        "Database": "DatabaseSample",
        "State": "Completed",
        "FailureReason": "XXX",
        "TotalCpu": "00:01:30.1562500",
        "CommandType": "ExtentsDrop",
        "Application": "Kusto.WinSvc.DM.Svc",
        "ResourceUtilization": "{\"CacheStatistics\":{\"Memory\":{\"Hits\":0,\"Misses\":0},\"Disk\":{\"Hits\":0,\"Misses\":0},\"Shards\":{\"Hot\":{\"HitBytes\":0,\"MissBytes\":0,\"RetrieveBytes\":0},\"Cold\":{\"HitBytes\":0,\"MissBytes\":0,\"RetrieveBytes\":0},\"BypassBytes\":0}},\"TotalCpu\":\"00:00:00\",\"MemoryPeak\":0,\"ScannedExtentsStatistics\":{\"MinDataScannedTime\":null,\"MaxDataScannedTime\":null,\"TotalExtentsCount\":0,\"ScannedExtentsCount\":0,\"TotalRowsCount\":0,\"ScannedRowsCount\":0}}",
        "Duration": "00:03:30.1562500",
        "User": "AAD app id=0571b364-eeeb-4f28-ba74-90a8b4132b53",
        "Principal": "aadapp=0571b364-eeeb-4f28-ba74-90a3b4136b53;5c443533-c927-4410-a5d6-4d6a5443b64f",
        "Text": ".show principal roles"
    }
}
```
**Properties of a command diagnostic log**

|Name               |Description
|---                |---
|RootActivityId |The root activity ID
|StartedOn        |Time (UTC) at which this command started
|LastUpdatedOn        |Time (UTC) at which this command ended
|Database          |The name of the database the command ran on
|State              |The state the command ended with
|FailureReason  |The failure reason
|TotalCpu |Total CPU duration
|CommandType     |Command type
|Application     |Application name that invoked the command
|ResourceUtilization     |Command resource utilization
|Duration     |Command duration
|User     |The user that invoked the query
|Principal     |The principal that invoked the query
|Text     |The command text

#### Query log

**Example:**

```json
{
    "time": "",
    "resourceId": "",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/QUERY/ACTION",
    "operationVersion": "1.0",
    "category": "Query",
    "properties": {
        "RootActivityId": "3e6e8814-e64f-455a-926d-bf16229f6d2d",
        "StartedOn": "2020-09-04T13:45:45.331925Z",
        "LastUpdatedOn": "2020-09-04T13:45:45.3484372Z",
        "Database": "DatabaseSample",
        "State": "Completed",
        "FailureReason": "[none]",
        "TotalCpu": "00:00:00",
        "ApplicationName": "MyApp",
        "MemoryPeak": 0,
        "Duration": "00:00:00.0165122",
        "User": "AAD app id=0571b364-eeeb-4f28-ba74-90a8b4132b53",
        "Principal": "aadapp=0571b364-eeeb-4f28-ba74-90a8b4132b53;5c823e4d-c927-4010-a2d8-6dda2449b6cf",
        "Text": "TestTable | take 10",
        "ScannedExtentsStatistics": {
            "MinDataScannedTime": "2020-07-27T08:34:35.3299941",
            "MaxDataScannedTime": "2020-07-27T08:34:41.991661",
            "TotalExtentsCount": 64,
            "ScannedExtentsCount": 64,
            "TotalRowsCount": 320,
            "ScannedRowsCount": 320
        },
        "CacheStatistics": {
            "Memory": {
                "Hits": 192,
                "Misses": 0
          },
            "Disk": {
                "Hits": 0,
                "Misses": 0
      },
            "Shards": {
                "Hot": {
                    "HitBytes": 0,
                    "MissBytes": 0,
                    "RetrieveBytes": 0
        },
                "Cold": {
                    "HitBytes": 0,
                    "MissBytes": 0,
                    "RetrieveBytes": 0
        },
            "BypassBytes": 0
      }
    },
    "ResultSetStatistics": {
        "TableCount": 1,
        "TablesStatistics": [
        {
          "RowCount": 1,
          "TableSize": 9
        }
      ]
    }
  }
}
```

**Properties of a query diagnostic log**

|Name               |Description
|---                |---
|RootActivityId |The root activity ID
|StartedOn        |Time (UTC) at which this command started
|LastUpdatedOn           |Time (UTC) at which this command ended
|Database              |The name of the database the command ran on
|State  |The state the command ended with
|FailureReason|The failure reason
|TotalCpu     |Total CPU duration
|ApplicationName            |Application name that invoked the query
|MemoryPeak          |Memory peak
|Duration      |Command duration
|User|The user that invoked the query
|Principal        |The principal that invoked the query
|ScannedExtentsStatistics        | Contains scanned extent statistics
|MinDataScannedTime        |Minimum data scan time
|MaxDataScannedTime        |Maximum data scan time
|TotalExtentsCount        |Total extent count
|ScannedExtentsCount        |Scanned extent count
|TotalRowsCount        |Total rows count
|ScannedRowsCount        |Scanned rows count
|CacheStatistics        |Contains cache statistics
|Memory        |Contains cache memory statistics
|Hits        |Memory cache hits
|Misses        |Memory cache misses
|Disk        |Contains cache disk statistics
|Hits        |Disk cache hits
|Misses        |Disk cache misses
|Shards        |Contains hot and cold shards cache statistics
|Hot        |Contains hot shards cache statistics
|HitBytes        |Shards hot cache hits
|MissBytes        |Shards hot cache misses
|RetrieveBytes        |	Shards hot cache retrieved bytes
|Cold        |Contains cold shards cache statistics
|HitBytes        |Shards cold cache hits
|MissBytes        |Shards cold cache misses
|RetrieveBytes        |Shards cold cache retrieved bytes
|BypassBytes        |Shards cache bypass bytes
|ResultSetStatistics        |Contains result set statistics
|TableCount        |Result set table count
|TablesStatistics        |Contains result set table statistics
|RowCount        | Result set table row count
|TableSize        |Result set table row count
|Text     |The query text


# [Tables](#tab/tables)

### TableUsageStatistics and TableDetails logs schema

Log JSON strings include elements listed in the following table:

|Name               |Description
|---                |---
|time               |Time of the report
|resourceId         |Azure Resource Manager resource ID
|operationName      |Name of the operation: 'MICROSOFT.KUSTO/CLUSTERS/DATABASE/SCHEMA/READ'. Properties are the same for TableUsageStatistics and TableDetails.
|operationVersion   |Schema version: '1.0' 
|properties         |Detailed information of the operation

#### TableUsageStatistics log

**Example:**

```json
{
    "resourceId": "/SUBSCRIPTIONS/0571b364-eeeb-4f28-ba74-90a8b4132b53/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/MYKUSTOCLUSTER",
    "time": "08-04-2020 16:42:29",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/DATABASE/SCHEMA/READ",
    "correlationId": "MyApp.Kusto.DM.MYKUSTOCLUSTER.ShowTableUsageStatistics.e10fe80b-6f4d-4b7e-9756-b87720f88901",
    "properties": {
        "RootActivityId": "3e6e8814-e64f-455a-926d-bf16229f6d2d",
        "StartedOn": "2020-08-19T11:51:41.1258308Z",
        "Database": "MyDB",
        "Table": "MyTable",
        "MinCreatedOn": "2020-07-20T09:16:00.9906347Z",
        "MaxCreatedOn": "2020-08-19T11:50:37.1233374Z",
        "Application": "MyApp",
        "User": "AAD app id=0571b364-eeeb-4f28-ba74-90a8b4132b53",
        "Principal": "aadapp=0571b364-eeeb-4f28-ba74-90a8b4132b53;5c823e4d-c927-4010-a2d8-6dda2449b6cf"
    }
}
```

**Properties of a TableUsageStatistics diagnostic log**

|Name               |Description
|---                |---
|RootActivityId |The root activity ID
|StartedOn        |Time (UTC) at which this command started
|Database          |The name of the database
|TableName              |The name of the table
|MinCreatedOn  |Oldest extent time of the table
|MaxCreatedOn |Latest extent time of the table
|ApplicationName     |application name that invoked the command
|User     |The user that invoked the query
|Principal     |The principal that invoked the query

#### TableDetails log

**Example:**

```json
{
    "resourceId": "/SUBSCRIPTIONS/0571b364-eeeb-4f28-ba74-90a8b4132b53/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/MYKUSTOCLUSTER",
    "time": "08-04-2020 16:42:29",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/DATABASE/SCHEMA/READ",
    "correlationId": "MyApp.Kusto.DM.MYKUSTOCLUSTER.ShowTableUsageStatistics.e10fe80b-6f4d-4b7e-9756-b87720f88901",
    "properties": {
        "RootActivityId": "3e6e8814-e64f-455a-926d-bf16229f6d2d",
        "TableName": "MyTable",
        "DatabaseName": "MyDB",
        "TotalExtentSize": 9632.0,
        "TotalOriginalSize": 4143.0,
        "HotExtentSize": 0.0,
        "RetentionPolicyOrigin": "table",
        "RetentionPolicy": "{\"SoftDeletePeriod\":\"90.00:00:00\",\"Recoverability\":\"Disabled\"}",
        "CachingPolicyOrigin": "database",
        "CachingPolicy": "{\"DataHotSpan\":\"7.00:00:00\",\"IndexHotSpan\":\"7.00:00:00\",\"ColumnOverrides\":[]}",
        "MaxExtentsCreationTime": "2020-08-30T02:44:43.9824696Z",
        "MinExtentsCreationTime": "2020-08-30T02:38:42.3031288Z",
        "TotalExtentCount": 1164,
        "TotalRowCount": 223325,
        "HotExtentCount": 29,
        "HotOriginalSize": 1388213,
        "HotRowCount": 5117
  }
}
```

**Properties of a TableDetails diagnostic log**

|Name               |Description
|---                |---
|RootActivityId |The root activity ID
|TableName        |The name of the table
|DatabaseName           |The name of the database
|TotalExtentSize              |The total original size of data in the table (in bytes)
|HotExtentSize  |The total size in bytes of extents (compressed size and index size) in the table, stored in the hot cache.
|RetentionPolicyOrigin |Retention policy origin entity (table/database/cluster)
|RetentionPolicy     |The table's effective entity retention policy, serialized as JSON
|CachingPolicyOrigin            |Caching policy origin entity (table/database/cluster)
|CachingPolicy          |The table's effective entity caching policy, serialized as JSON
|MaxExtentsCreationTime      |The maximum creation time of an extent in the table (or null, if there are no extents)
|MinExtentsCreationTime |The minimum creation time of an extent in the table (or null, if there are no extents)
|TotalExtentCount        |The total number of extents in the table
|TotalRowCount        |The total number of rows in the table
|MinDataScannedTime        |Minimum data scan time
|MaxDataScannedTime        |Maximum data scan time
|TotalExtentsCount        |Total extent count
|ScannedExtentsCount        |Scanned extent count
|TotalRowsCount        |Total rows count
|HotExtentCount        |The total number of extents in the table, stored in the hot cache
|HotOriginalSize        |The total original size in bytes of data in the table, stored in the hot cache
|HotRowCount        |The total number of rows in the table, stored in the hot cache

---

## Next steps

* [Use metrics to monitor cluster health](using-metrics.md)
* [Tutorial: Ingest and query monitoring data in Azure Data Explorer](ingest-data-no-code.md) for ingestion diagnostic logs
