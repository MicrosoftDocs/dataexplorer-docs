---
title: Continuous data export - Azure Data Explorer | Microsoft Docs
description: This article describes Continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2019

---
# Continuous data export

Continuous data export enables you to continuously export data from Kusto to an [external table](../externaltables.md). The external table 
defines the destination (for example, Azure Blob Storage) and the schema of the exported data. 
The exported data is defined by a periodically-run query whose results are stored in the external table. 
The process guarantees that all records are exported "exactly-once" (excluding dimension tables, in which all records are evaluated in all executions). 

Continuous data export requires you to [create an external table](../externaltables.md#create-or-alter-external-table) 
and then [create a continuous export definition](#create-or-alter-continuous-export) pointing to the external table. 

> [!NOTE] 
> * Currently, there is no support (as part of continuous export) for exporting historical records ingested before continuous export creation. Historical records can be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). 
For more information, see [exporting historical data](#exporting-historical-data). 
> * Currently, continuous export doesn't work for data ingested using streaming ingestion. 
 
## Notes

* To guarantee "exactly-once" export, continuous export uses [database cursors](../databasecursor.md). 
[IngestionTime policy](../ingestiontime-policy.md) must therefore be enabled on all tables referenced in the query that should be processed "exactly-once" in the export. The policy is enabled by default on all newly created tables.
* The output schema of the export query *must* match the schema of the external table to which you export. 
* Continuous export doesn't support cross-database/cluster calls.
* Continuous export *doesn't* guarantee that each record will be written only once to the external table. The external table _may_ contain duplicates, if a failure occurs after export has begun and some of the artifacts were already written to the external table. In such (rare) cases, artifacts are not deleted from the external table but they will *not* be reported in the
[show exported artifacts command](#show-continuous-export-exported-artifacts). Continuous export
*does* guarantee no duplications when using the show exported-artifacts command to read the exported artifacts. 
* Continuous export runs periodically, according to the time period configured for it. The recommended value for this interval is at least several minutes, depending on the latencies you're willing to accept. 
Continuous export *isn't* designed for constantly streaming data out of Kusto. It runs in a distributed mode, where all nodes export concurrently, so if the range of data queried by each run is small, the output of the continuous export would be many small artifacts (number depends on number of nodes in cluser). 
* The number of export operations that can run concurrently is limited by the cluster's data export capacity, which is 75% of the number of working nodes in the cluster (see [throttling](../../concepts/capacitypolicy.md#throttling)). 
If the cluster doesn't have sufficient capacity to handle all continuous exports, some will start lagging behind. 
 
* By default, all tables referenced in the export query are assumed to be [fact tables](https://en.wikipedia.org/wiki/Fact_table). 
Therefore, they are *scoped* to the database cursor - records included in the export query are only those that joined since the previous export execution. 
The export query may contain [dimension tables](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)#Dimension_table) as well, in which *all* records of the dimension table are included in *all* export queries. 
Continuous-export of only dimension tables isn't supported. The export query must include at least a single fact table.
The syntax explicitly declares which tables are scoped (fact) and which shouldn't (dimension). See the `over` parameter in the [create command](#create-or-alter-continuous-export) for details.

All of the continuous export commands require [Database admin permission](../access-control/role-based-authorization.md).

## Create or alter continuous export

**Syntax:**

`.create-or-alter` `continuous-export` *ContinuousExportName* <br>
[ `over` `(`*T1*, *T2* `)`] <br>
`to` `table` *ExternalTableName* <br> 
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
<| *Query*

**Properties**:

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export. Name must be unique within the database and is used to periodically run the continuous export.|
|ExternalTableName|String|Name of [external table](../externaltables.md) to export to.|
|Query|String|Query to export.|
|over (T1, T2)|String|An optional comma separated list of fact tables in the query. If not specified, all tables referenced in the query are assumed to be fact tables. If specified, tables *not* in this list are treated as dimension tables and will not be scoped (all records will participate in all exports). See the [notes section](#notes) for details.|
|intervalBetweenRuns|Timespan|The time span between continuous export executions. Must be greater than 1 minute.|
|forcedLatency|Timespan|An optional period of time to limit the query to records that were ingested only prior to this period (relative to current time) This is useful if, for example, query performs some aggregations/joins and you would like to make sure all relevant records have already been ingested before running the export.|
|sizeLimit|long|The size limit (in bytes) at which to switch to the next blob (before compression). The default value is 100MB, max 1GB.|

**Examples:**
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

|Name|ExternalTableName|Query|ForcedLatency|IntervalBetweenRuns|CursorScopedTables|ExportProperties|
|---|---|---|---|---|---|---|
|MyExport|ExternalBlob|S|00:10:00|01:00:00|[<br>  "['DB'].['S']"<br>]|{<br>  "SizeLimit": 104857600<br>}|

## Show continuous export

**Syntax:**

`.show` `continuous-export` *ContinuousExportName*

Returns the continuous export properties of *ContinuousExportName*. 

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export.|


`.show` `continuous-exports`

Returns all continuous exports in the database. 

**Output:**

|Output parameter |Type |Description
|---|---|---
|Name  |String |The name of the continuous export.
|ExternalTableName|String|The name of the external table.
|Query|String|The export query.
|ForcedLatency|TimeSpan |The forced latency (null if not provided).
|IntervalBetweenRuns|TimeSpan |The interval between runs.
|CursorScopedTables|String|A list of explicitly scoped (fact) tables (json serialized).
|ExportProperties|String|Export properties (json serialized).
|LastRunTime|DateTime|The last time the continuous export was executed (start time).
|StartCursor|String|The starting point of the first execution of this continuous export.
|IsDisabled|Boolean|True if the continuous export is disabled.
|LastRunResult|String|The results of the last continuous-export run (`Completed` or `Failed`).
|ExportedTo|DateTime|The last datetime (ingestion time) that was exported successfully.
|IsRunning|Boolean|True if the continuous export is currently running.

## Show continuous export exported artifacts

**Syntax:**

`.show` `continuous-export` *ContinuousExportName* `exported-artifacts`

Returns all artifacts exported by the continuous-export in all runs. It is recommended to filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|Timestamp  |Datetime |Timestamp of the continuous export run.
|ExternalTableName|String|The name of the external table.
|Path|String|Output path.
|NumRecords|long|Number of records exported to path.

**Example:** 

```kusto
.show continuous-export MyExport exported-artifacts | where Timestamp > ago(1h)
```

|Timestamp|ExternalTableName|Path|NumRecords|SizeInBytes|
|---|---|---|---|---|
|2018-12-20 07:31:30.2634216|ExternalBlob|http://storageaccount.blob.core.windows.net/container1/1_6ca073fd4c8740ec9a2f574eaa98f579.csv|10|1024

## Show continuous export failures

**Syntax:**

`.show` `continuous-export` *ContinuousExportName* `failures`

Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|Timestamp  |Datetime |Timestamp of the failure.
|OperationId|String|The operation id of the failure.
|Name|String|Continuous export name.
|LastSuccessRun|Timestamp|The last successful run of the continuous export.
|FailureKind|String|Failure/PartialFailure. PartialFailure indicates some artifacts were exported successfully before the failure occurred. 
|Details|String|Failure error details.

**Example:** 

<!-- -->
```
.show continuous-export MyExport failures 
```

|Timestamp|OperationId|Name|LastSuccessRun|FailureKind|Details|
|---|---|---|---|---|---|
|2019-01-01 11:07:41.1887304|ec641435-2505-4532-ba19-d6ab88c96a9d|MyExport|2019-01-01 11:06:35.6308140|Failure|Details...|


## Drop continuous export

**Syntax:**

`.drop` `continuous-export` *ContinuousExportName*

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export.|

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

|Property|Type|Description
|----------------|-------|---|
|ContinuousExportName|String|Name of continuous export.|

**Output:**

The result of the [show continuous export command](#show-continuous-export) of the altered continuous export. 




## Exporting historical data

Continuous export starts exporting data only from the point of its creation. Records ingested prior to that time should be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). To avoid duplicates with data exported by continuous export, use the StartCursor returned by the 
[show continuous export command](#show-continuous-export) and export only records where cursor_before_or_at the cursor value. See example below. 
Historical data may be too large to be exported in a single export command. Therefore, you should partition the query into several smaller batches. 

```kusto
.show continuous-export MyExport | project StartCursor
```

|StartCursor|
|---|
|636751928823156645|

Followed by: 

```
.export async to table ExternalBlob
<| T | where cursor_before_or_at("636751928823156645")
```