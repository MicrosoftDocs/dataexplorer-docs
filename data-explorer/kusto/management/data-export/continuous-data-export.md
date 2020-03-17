---
title: Continuous data export - Azure Data Explorer | Microsoft Docs
description: This article describes Continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/12/2020
---
# Continuous data export

Continuously export data from Kusto to an [external table](../externaltables.md). The external table 
defines the destination (for example, Azure Blob Storage) and the schema of the exported data. 
The exported data is defined by a periodically-run query. The results are stored in the external table. 
The process guarantees that all records are exported "exactly-once" (excluding dimension tables, in which all records are evaluated in all executions). 

Continuous data export requires you to [create an external table](../externaltables.md#create-or-alter-external-table) 
and then [create a continuous export definition](#create-or-alter-continuous-export) pointing to the external table. 

> [!NOTE] 
> * Kusto doesn't support exporting historical records ingested before continuous export creation (as part of continuous export). Historical records can be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). 
For more information, see [exporting historical data](#exporting-historical-data). 
> * Continuous export doesn't work for data ingested using streaming ingestion. 
> * Currently, continuous export can't be configured on a table on which a [Row Level Security policy](../../management/rowlevelsecuritypolicy.md) is enabled.
> * Continuous export is not supported for external tables with `impersonate` in their 
[connection strings](../../api/connection-strings/storage.md).
 
## Notes

* To guarantee "exactly-once" export, continuous export uses [database cursors](../databasecursor.md). 
[IngestionTime policy](../ingestiontime-policy.md) must therefore be enabled on all tables referenced in the query that should be processed "exactly-once" in the export. The policy is enabled by default on all newly created tables.
* The output schema of the export query *must* match the schema of the external table to which you export. 
* Continuous export doesn't support cross-database/cluster calls.
* Continuous export doesn't guarantee that each record will be written only once to the external table. If a failure occurs after export has begun and some of the artifacts were already written to the external table, the external table _may_ contain duplicates. In such (rare) cases, artifacts are not deleted from the external table but they will *not* be reported in the
[show exported artifacts command](#show-continuous-export-exported-artifacts). Continuous export
*does* guarantee no duplication when using the show exported-artifacts command to read the exported artifacts. 
* Continuous export runs according to the time period configured for it. The recommended value for this interval is at least several minutes, depending on the latencies you're willing to accept. 
Continuous export *isn't* designed for constantly streaming data out of Kusto. It runs in a distributed mode, where all nodes export concurrently. So if the range of data queried by each run is small, the output of the continuous export would be many small artifacts (the number depends on the number of nodes in the cluster). 
* The number of export operations that can run concurrently is limited by the cluster's data export capacity (see [throttling](../../management/capacitypolicy.md#throttling)). 
If the cluster doesn't have sufficient capacity to handle all continuous exports, some will start lagging behind. 
 
* By default, all tables referenced in the export query are assumed to be [fact tables](../../concepts/fact-and-dimension-tables.md). 
Therefore, they are *scoped* to the database cursor. Records included in the export query are only those that joined since the previous export execution. 
The export query may contain [dimension tables](../../concepts/fact-and-dimension-tables.md) in which *all* records of the dimension table are included in *all* export queries. 
Continuous-export of only dimension tables isn't supported. The export query must include at least a single fact table.
The syntax explicitly declares which tables are scoped (fact) and which are not scoped (dimension). See the `over` parameter in the [create command](#create-or-alter-continuous-export) for details.

* The number of files exported in each continuous export iteration depends on how the 
external table is partitioned. Refer to the notes section in 
[export to external table command](export-data-to-an-external-table.md) for further information. 
Note that each continuous export iteration always writes to *new* files, and never appends 
to existing ones. As a result, the number of exported files also depends on 
the frequency in which the continuous export runs (`intervalBetweenRuns` parameter).

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
| forcedLatency        | Timespan | An optional period of time to limit the query to records that were ingested only prior to this period (relative to current time). This is useful if, for example, the query performs some aggregations/joins and you would like to make sure all relevant records have already been ingested before running the export.

In addition to the above, all properties supported in [export to external table command](export-data-to-an-external-table.md) are supported in the continuous export create command. 

**Example:**

```
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

## Show continuous export exported artifacts

**Syntax:**

`.show` `continuous-export` *ContinuousExportName* `exported-artifacts`

Returns all artifacts exported by the continuous-export in all runs. It is recommended to filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 

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
| 2018-12-20 07:31:30.2634216 | ExternalBlob      | http://storageaccount.blob.core.windows.net/container1/1_6ca073fd4c8740ec9a2f574eaa98f579.csv | 10                          | 1024              |

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

```
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
When enabling a continuous export that has been disabled for a long time, exporting will continue from where it last stopped, when disabled. This may result in a long running export, blocking other exports from running, if there isn't sufficient cluster capacity to serve all processes. 
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

```
.show continuous-export MyExport | project StartCursor
```

| StartCursor        |
|--------------------|
| 636751928823156645 |

Followed by: 

```
.export async to table ExternalBlob
<| T | where cursor_before_or_at("636751928823156645")
```