---
title: Continuous data export - Azure Data Explorer | Microsoft Docs
description: This article describes Continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 03/27/2020
---
# Continuous data export

Continuously export data from Kusto to an [external table](../externaltables.md). The external table 
defines the destination (for example, Azure Blob Storage) and the schema of the exported data. 
The exported data is defined by a periodically run query. The results are stored in the external table. 
The process guarantees that all records are exported "exactly once" (excluding dimension tables, in which all records are evaluated in all executions). 

Continuous data export requires you to [create an external table](../external-tables-azurestorage-azuredatalake.md#create-or-alter-external-table) 
and then [create a continuous export definition](#create-or-alter-continuous-export) pointing to the external table. 

> [!NOTE] 
> * Kusto doesn't support exporting historical records ingested before continuous export creation (as part of continuous export). Historical records can be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). 
For more information, see [exporting historical data](#exporting-historical-data).
> * Continuous export doesn't work for data ingested using streaming ingestion. 
> * Currently, continuous export can't be configured on a table on which a [Row Level Security policy](../../management/rowlevelsecuritypolicy.md) is enabled.
> * Continuous export is not supported for external tables with `impersonate` in their 
[connection strings](../../api/connection-strings/storage.md).
> * If the artifacts used by continuous export are intended to trigger Event Grid notifications, please refer to the 
[known issues section in the Event Grid documentation](../data-ingestion/eventgrid.md#known-issues).

## Notes

* The guarantee for "exactly once" export is only for files reported in the [show exported artifacts command](#show-continuous-export-artifacts). 
Continuous export doesn't guarantee that each record will be written only once to the external table. If a failure occurs after export has begun and some of
 the artifacts were already written to the external table, the external table _may_ contain duplicates (or even corrupted files, in case a write operation was 
 aborted before completion). In such cases, artifacts are not deleted from the external table but they will *not* be reported in the
[show exported artifacts command](#show-continuous-export-artifacts). Consuming the exported files using the `show exported artifacts command`. 
guarantees no duplicates (and not corruptions).
* To guarantee "exactly once" export, continuous export uses [database cursors](../databasecursor.md). 
[IngestionTime policy](../ingestiontime-policy.md) must  be enabled on all tables referenced in the query that should be processed "exactly once" in the export. The policy is enabled by default on all newly created tables.
* The output schema of the export query *must* match the schema of the external table to which you export. 
* Continuous export doesn't support cross-database/cluster calls.
* Continuous export runs according to the time period configured for it. The recommended value for this interval is at least several minutes, depending on the latencies you're willing to accept. 
Continuous export *isn't* designed for constantly streaming data out of Kusto. It runs in a distributed mode, where all nodes export concurrently.
If the range of data queried by each run is small, the output of the continuous export would be many small artifacts (the number depends on the number of nodes in the cluster). 
* The number of export operations that can run concurrently is limited by the cluster's data export capacity (see [throttling](../../management/capacitypolicy.md#throttling)). 
If the cluster doesn't have sufficient capacity to handle all continuous exports, some will start lagging behind.
* By default, all tables referenced in the export query are assumed to be [fact tables](../../concepts/fact-and-dimension-tables.md). 
Therefore, they are *scoped* to the database cursor. The export query includes only the records that joined since the previous export execution. 
The export query may contain [dimension tables](../../concepts/fact-and-dimension-tables.md) in which *all* records of the dimension
 table are included in *all* export queries. 
    * When using joins between fact and dimension tables in continuous-export, you must keep in mind 
that records in the fact table are only processed once - if the export runs while records in the dimension tables are missing for some keys, 
records for the respective keys will either be missed or include null values for the dimension columns in the 
exported files (depending on whether the query uses inner or outer join). The forcedLatency property in the continuous-export definition 
can be useful for such cases, where the fact and dimensions tables are ingested during the same time (for matching records).
    * Continuous-export of only dimension tables isn't supported. The export query must include at least a single fact table.
    * The syntax explicitly declares which tables are scoped (fact) and which are not scoped (dimension). See the `over` parameter in the 
    [create command](#create-or-alter-continuous-export) for details.
* If the exported data volume is large, it is highly recommended to configure multiple storage accounts for the 
external table, to avoid storage throttling (see the Known issues section in the
 [export data to storage](export-data-to-storage.md#known-issues) document).
* For best performance, the ADX cluster and the storage account(s) should be co-located in the same Azure region.
* The default distribution in continuous export is `per_node` (all nodes are exporting concurrently). 
  This setting can be overridden in the properties of the continuous export create command. Use `per_shard`
  distribution to increase concurrency (note that this will increase the load on the storage account(s) and 
  has a chance of hitting throttling limits); 
  Use `single` (or `distributed`=`false`) to disable distribution altogether (this may significantly slow down 
  the continuous export process). This setting also impacts the number of files created in each continuous export 
  iteration (see the notes section in [export to external table command](export-data-to-an-external-table.md) 
  for more details).
* The number of files exported in each continuous export iteration depends on how the
external table is partitioned. For more information, see the notes section in [export to external table command](export-data-to-an-external-table.md).
Each continuous export iteration always writes to *new* files, and never appends 
to existing ones. As a result, the number of exported files also depends on 
the frequency in which the continuous export runs (`intervalBetweenRuns` parameter).
* The impact of the continuous export on the cluster depends on the query the continuous export is running, 
as most resources (CPU, memory) are consumed by the query execution. 
The [show commands-and-queries command](../commands-and-queries.md) can be used to estimate the resources
consumption. Filter on `| where ClientActivityId startswith "RunContinuousExports"` to view the commands and queries associated with continuous export.


All of the continuous export commands require [database admin permissions](../access-control/role-based-authorization.md).

## Create or alter continuous export

**Syntax:**

`.create-or-alter` `continuous-export` *ContinuousExportName* <br>
[ `over` `(`*T1*, *T2* `)`] <br>
`to` `table` *ExternalTableName* <br> 
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]<br>
\<| *Query*

**Properties**:

| Property             | Type     | Description   |
|----------------------|----------|---------------------------------------|
| ContinuousExportName | String   | Name of continuous export. Name must be unique within the database and is used to periodically run the continuous export.      |
| ExternalTableName    | String   | Name of [external table](../externaltables.md) to export to.  |
| Query                | String   | Query to export.  |
| over (T1, T2)        | String   | An optional comma-separated list of fact tables in the query. If not specified, all tables referenced in the query are assumed to be fact tables. If specified, tables *not* in this list are treated as dimension tables and will not be scoped (all records will participate in all exports). See the [notes section](#notes) for details. |
| intervalBetweenRuns  | Timespan | The time span between continuous export executions. Must be greater than 1 minute.   |
| forcedLatency        | Timespan | An optional period of time to limit the query to records that were ingested only prior to this period (relative to current time). This property is useful if, for example, the query performs some aggregations/joins and you would like to make sure all relevant records have already been ingested before running the export.

In addition to the above, all properties supported in [export to external table command](export-data-to-an-external-table.md) are supported in the continuous export create command. 

**Example:**

```kusto
.create-or-alter continuous-export MyExport
over (T)
to table ExternalBlob
with
(intervalBetweenRuns=1h, 
 forcedLatency=10m, 
 sizeLimit=104857600)
<| T
```

| Name     | ExternalTableName | Query | ForcedLatency | IntervalBetweenRuns | CursorScopedTables         | ExportProperties                   |
|----------|-------------------|-------|---------------|---------------------|----------------------------|------------------------------------|
| MyExport | ExternalBlob      | S     | 00:10:00      | 01:00:00            | [<br>  "['DB'].['S']"<br>] | {<br>  "SizeLimit": 104857600<br>} |

## Show continuous export

**Syntax:**

`.show` `continuous-export` *ContinuousExportName*

Returns the continuous export properties of *ContinuousExportName*. 

**Properties:**

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export. |


`.show` `continuous-exports`

Returns all continuous exports in the database. 

**Output:**

| Output parameter    | Type     | Description                                                             |
|---------------------|----------|-------------------------------------------------------------------------|
| CursorScopedTables  | String   | List of explicitly scoped (fact) tables (JSON serialized)               |
| ExportProperties    | String   | Export properties (JSON serialized)                                     |
| ExportedTo          | DateTime | The last datetime (ingestion time) that was exported successfully       |
| ExternalTableName   | String   | Name of the external table                                              |
| ForcedLatency       | TimeSpan | Forced latency (null if not provided)                                   |
| IntervalBetweenRuns | TimeSpan | Interval between runs                                                   |
| IsDisabled          | Boolean  | True if the continuous export is disabled                               |
| IsRunning           | Boolean  | True if the continuous export is currently running                      |
| LastRunResult       | String   | The results of the last continuous-export run (`Completed` or `Failed`) |
| LastRunTime         | DateTime | The last time the continuous export was executed (start time)           |
| Name                | String   | Name of the continuous export                                           |
| Query               | String   | Export query                                                            |
| StartCursor         | String   | Starting point of the first execution of this continuous export         |

## Show continuous export artifacts

**Syntax:**

`.show` `continuous-export` *ContinuousExportName* `exported-artifacts`

Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 

**Properties:**

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export. |

**Output:**

| Output parameter  | Type     | Description                            |
|-------------------|----------|----------------------------------------|
| Timestamp         | Datetime | Timestamp of the continuous export run |
| ExternalTableName | String   | Name of the external table             |
| Path              | String   | Output path                            |
| NumRecords        | long     | Number of records exported to path     |

**Example:** 

```kusto
.show continuous-export MyExport exported-artifacts | where Timestamp > ago(1h)
```

| Timestamp                   | ExternalTableName | Path             | NumRecords | SizeInBytes |
|-----------------------------|-------------------|------------------|------------|-------------|
| 2018-12-20 07:31:30.2634216 | ExternalBlob      | `http://storageaccount.blob.core.windows.net/container1/1_6ca073fd4c8740ec9a2f574eaa98f579.csv` | 10                          | 1024              |

## Show continuous export failures

**Syntax:**

`.show` `continuous-export` *ContinuousExportName* `failures`

Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 

**Properties:**

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export  |

**Output:**

| Output parameter | Type      | Description                                         |
|------------------|-----------|-----------------------------------------------------|
| Timestamp        | Datetime  | Timestamp of the failure.                           |
| OperationId      | String    | Operation ID of the failure.                    |
| Name             | String    | Continuous export name.                             |
| LastSuccessRun   | Timestamp | The last successful run of the continuous export.   |
| FailureKind      | String    | Failure/PartialFailure. PartialFailure indicates some artifacts were exported successfully before the failure occurred. |
| Details          | String    | Failure error details.                              |

**Example:** 

```kusto
.show continuous-export MyExport failures 
```

| Timestamp                   | OperationId                          | Name     | LastSuccessRun              | FailureKind | Details    |
|-----------------------------|--------------------------------------|----------|-----------------------------|-------------|------------|
| 2019-01-01 11:07:41.1887304 | ec641435-2505-4532-ba19-d6ab88c96a9d | MyExport | 2019-01-01 11:06:35.6308140 | Failure     | Details... |

## Drop continuous export

**Syntax:**

`.drop` `continuous-export` *ContinuousExportName*

**Properties:**

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export |

**Output:**

The remaining continuous exports in the database (post deletion). Output schema as in the [show continuous export command](#show-continuous-export).

## Disable or enable continuous export

**Syntax:**

`.enable` `continuous-export` *ContinuousExportName* 

`.disable` `continuous-export` *ContinuousExportName* 

You can disable or enable the continuous-export job. A disabled continuous export won't be executed, but its current state is persisted and can be resumed when the continuous export is enabled. 
When enabling a continuous export that has been disabled for a long time, exporting will continue from where it last stopped when the exporting disabled. This continuation may result in a long running export, blocking other exports from running, if there isn't sufficient cluster capacity to serve all processes. 
Continuous exports are executed by last run time in ascending order (oldest export will run first, until catch up is complete). 

**Properties:**

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export |

**Output:**

The result of the [show continuous export command](#show-continuous-export) of the altered continuous export. 




## Exporting historical data

Continuous export starts exporting data only from the point of its creation. Records ingested prior to that time should be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). To avoid duplicates with data exported by continuous export, use the StartCursor returned by the 
[show continuous export command](#show-continuous-export) and export only records where cursor_before_or_at the cursor value. See the example below. 
Historical data may be too large to be exported in a single export command. Therefore, partition the query into several smaller batches. 

```kusto
.show continuous-export MyExport | project StartCursor
```

| StartCursor        |
|--------------------|
| 636751928823156645 |

Followed by: 

```kusto
.export async to table ExternalBlob
<| T | where cursor_before_or_at("636751928823156645")
```
