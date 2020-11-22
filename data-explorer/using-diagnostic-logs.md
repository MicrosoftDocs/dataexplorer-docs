---
title: Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs
description: Learn how to set up diagnostic logs for Azure Data Explorer to monitor ingestion commands, and query operations.
author: orspod
ms.author: orspodek
ms.reviewer: guregini
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/16/2020
---

# Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) provide data about the operation of Azure resources. Azure Data Explorer uses diagnostic logs for insights on ingestion successes, ingestion failures, commands, and query operations. You can export operation logs to Azure Storage, Event Hub, or Log Analytics to monitor ingestion, commands, and query status. Logs from Azure Storage and Azure Event Hub can be routed to a table in your Azure Data Explorer cluster for further analysis.

> [!IMPORTANT] 
> Diagnostic log data may contain sensitive data. Restrict permissions of the logs destination according to your monitoring needs. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).
* Create a [cluster and database](create-cluster-database-portal.md).

## Set up diagnostic logs for an Azure Data Explorer cluster

Diagnostic logs can be used to configure the collection of the following log data:

# [Ingestion](#tab/ingestion)

> [!NOTE]
> Ingestion logs are supported for queued ingestion to the ingestion endpoint using SDKs, data connections, and connectors.
>
> Ingestion logs aren't supported for streaming ingestion, direct ingestion to the engine, ingestion from query, or set-or-append commands.

* **Successful ingestion operations**: These logs have information about successfully completed ingestion operations.
* **Failed ingestion operations**: These logs have detailed information about failed ingestion operations including error details. 
* **Ingestion batching operations**: These logs have detailed statistics of batches ready for ingestion (duration, batch size and blobs count).

# [Commands and Queries](#tab/commands-and-queries)

* **Commands**: These logs have information about admin commands that have reached a final state.
* **Queries**: These logs have detailed information about queries that have reached a final state. 

    > [!NOTE]
    > The query log data doesn't contain the query text.

---

The data is then archived into a Storage account, streamed to an Event Hub, or sent to Log Analytics, as per your specifications.

### Enable diagnostic logs

Diagnostic logs are disabled by default. To enable diagnostic logs, do the following steps:

1. In the [Azure portal](https://portal.azure.com), select the Azure Data Explorer cluster resource that you want to monitor.
1. Under **Monitoring**, select **Diagnostic settings**.
  
    ![Add diagnostics logs](media/using-diagnostic-logs/add-diagnostic-logs.png)

1. Select **Add diagnostic setting**.
1. In the **Diagnostics settings** window:

    :::image type="content" source="media/using-diagnostic-logs/configure-diagnostics-settings.png" alt-text="Configure diagnostics settings":::

    1. Select **Name** for your diagnostic setting.
    1. Select one or more targets: a Storage account, Event Hub, or Log Analytics.
    1. Select logs to be collected: `SucceededIngestion`, `FailedIngestion`, `Command`, or `Query`.
    1. Select [metrics](using-metrics.md#supported-azure-data-explorer-metrics) to be collected (optional).  
    1. Select **Save** to save the new diagnostic logs settings and metrics.

New settings will be set in a few minutes. Logs then appear in the configured archival target (Storage account, Event Hub, or Log Analytics). 

> [!NOTE]
> If you send logs to Log Analytics, the `SucceededIngestion`, `FailedIngestion`, `Command`, and `Query` logs will be stored in Log Analytics tables named: `SucceededIngestion`, `FailedIngestion`, `ADXIngestionBatching`, `ADXCommand`, `ADXQuery`, respectively.

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
    "time": "",
    "resourceId": "",
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
    "time": "",
    "resourceId": "",
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
|ErrorCode          |Error code 
|FailureStatus      |`Permanent` or `Transient`. Retry of a transient failure may succeed.
|OriginatesFromUpdatePolicy|True if failure originates from an update policy
|ShouldRetry        |True if retry may succeed

#### Ingestion batching operation log

**Example:**

```json
{
  "resourceId": "/SUBSCRIPTIONS/12534EB3-8109-4D84-83AD-576C0D5E1D06/RESOURCEGROUPS/KEREN/PROVIDERS/MICROSOFT.KUSTO/CLUSTERS/KERENEUS",
  "time": "2020-05-27T07:55:05.3693628Z",
  "operationVersion": "1.0",
  "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGESTIONBATCHING/ACTION",
  "category": "IngestionBatching",
  "correlationId": "2bb51038-c7dc-4ebd-9d7f-b34ece4cb735",
  "properties": {
    "Database": "Samples",
    "Table": "StormEvents",
    "BatchingType": "Size",
    "SourceCreationTime": "2020-05-27 07:52:04.9623640",
    "BatchTimeSeconds": 215.5,
    "BatchSizeBytes": 2356425,
    "DataSourcesInBatch": 4,
    "RootActivityId": "2bb51038-c7dc-4ebd-9d7f-b34ece4cb735"
  }
}

```
**Properties of an ingestion batching operation diagnostic log**

|Name               |Description
|---                   |---
| TimeGenerated        | The time (UTC) at which this event was generated |
| Database             | Name of the database holding the target table |
| Table                | Name of the target table into which the data is ingested |
| BatchingType         | Type of batching: whether the batch reached batching time, data size or number of files limit set by batching policy |
| SourceCreationTime   | Minimal time (UTC) at which blobs in this batch were created |
| BatchTimeSeconds     | Total batching time of this batch (seconds) |
| BatchSizeBytes       | Total uncompressed size of data in this batch (bytes) |
| DataSourcesInBatch   | Number of data sources in this batch |
| RootActivityId       | The operation's activity Id |


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
        "Principal": "aadapp=0571b364-eeeb-4f28-ba74-90a3b4136b53;5c443533-c927-4410-a5d6-4d6a5443b64f"
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

---

## Next steps

* [Use metrics to monitor cluster health](using-metrics.md)
* [Tutorial: Ingest and query monitoring data in Azure Data Explorer](ingest-data-no-code.md) for ingestion diagnostic logs
