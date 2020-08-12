---
title: Continuous data export - Azure Data Explorer | Microsoft Docs
description: This article describes Continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Continuous data export overview

This article describes continuous export of data from Kusto to an [external table](../externaltables.md) with a periodically run query. The results are stored in the external table, which defines the destination (for example, Azure Blob Storage) and the schema of the exported data. This process guarantees that all records are exported "exactly once", with some [exceptions](#exactly-once-export). 

To enable continuous data export, [create an external table](../external-tables-azurestorage-azuredatalake.md#create-or-alter-external-table) and then [create a continuous export definition](create-alter-continuous.md) pointing to the external table. 

> [!NOTE]
> All continuous export commands require [database admin permissions](../access-control/role-based-authorization.md).

## Continuous export guidelines

* **Output schema**:
  * The output schema of the export query *must* match the schema of the external table to which you export. 
* **Frequency**:
  * Continuous export runs according to the time period configured for it in the `intervalBetweenRuns` property. The recommended value for this interval is at least several minutes, depending on the latencies you're willing to accept. The time interval can be as low as one minute, if the ingestion rate is high.
* **Distribution**:
  * The default distribution in continuous export is `per_node` (all nodes are exporting concurrently). 
  * This setting can be overridden in the properties of the continuous export create command. Use `per_shard` distribution to increase concurrency (note that this distribution will increase the load on the storage account(s) and has a chance of hitting throttling limits). 
  * Use `single` (or `distributed`=`false`) to disable distribution altogether. This setting may significantly slow down the continuous export process. This setting also impacts the number of files created in each continuous export iteration. 
* **Number of files**:
  * The number of files exported in each continuous export iteration depends on how the external table is partitioned. For more information, see [export to external table command](export-data-to-an-external-table.md#numfiles). Each continuous export iteration always writes to *new* files, and never appends to existing ones. As a result, the number of exported files also depends on the frequency in which the continuous export runs (`intervalBetweenRuns` parameter).
* **Location**:
  * For best performance, the ADX cluster and the storage account(s) should be colocated in the same Azure region.
  * If the exported data volume is large, it's recommended to configure multiple storage accounts for the external table, to avoid storage throttling. See [export data to storage](export-data-to-storage.md#known-issues).

## Exactly once export

To guarantee "exactly once" export, continuous export uses [database cursors](../databasecursor.md). [IngestionTime policy](../ingestiontime-policy.md) must be enabled on all tables referenced in the query that should be processed "exactly once" in the export. The policy is enabled by default on all newly created tables.

The guarantee for "exactly once" export is only for files reported in the [show exported artifacts command](show-continuous-artifacts.md). Continuous export doesn't guarantee that each record will be written only once to the external table. If a failure occurs after export has begun and some of the artifacts were already written to the external table, the external table may contain duplicates. If a write operation was aborted before completion, the external table may contain corrupted files. In such cases, artifacts aren't deleted from the external table, but they won't be reported in the [show exported artifacts command](show-continuous-artifacts.md). Consuming the exported files using the `show exported artifacts command` guarantees no duplicates (and no corruptions).

## Export to fact and dimension tables

By default, all tables referenced in the export query are assumed to be [fact tables](../../concepts/fact-and-dimension-tables.md). As such, they're scoped to the database cursor. The syntax explicitly declares which tables are scoped (fact) and which aren't scoped (dimension). See the `over` parameter in the [create command](create-alter-continuous.md) for details.

The export query includes only the records that joined since the previous export execution. The export query may contain [dimension tables](../../concepts/fact-and-dimension-tables.md) in which *all* records of the dimension table are included in *all* export queries. When using joins between fact and dimension tables in continuous-export, keep in mind that records in the fact table are only processed once. If the export runs while records in the dimension tables are missing for some keys, records for the respective keys will either be missed or include null values for the dimension columns in the exported files. Returning missed or null records depends on whether the query uses inner or outer join. The `forcedLatency` property in the continuous-export definition can be useful in such cases, where the fact and dimensions tables are ingested during the same time for matching records.

> [!NOTE]
> Continuous-export of only dimension tables isn't supported. The export query must include at least a single fact table.

## Exporting historical data

Continuous export starts exporting data only from the point of its creation. Records ingested before that time should be exported separately using the (non-continuous) [export command](export-data-to-an-external-table.md). 

Historical data may be too large to be exported in a single export command. If needed, partition the query into several smaller batches. 

To avoid duplicates with data exported by continuous export, use `StartCursor` returned by the [show continuous export command](show-continuous-export.md) and export only records `where cursor_before_or_at` the cursor value. For example:

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

## Resource consumption

* The impact of the continuous export on the cluster depends on the query the continuous export is running. Most resources (CPU, memory) are consumed by the query execution. 
* The number of export operations that can run concurrently is limited by the cluster's data export capacity (see [throttling](../../management/capacitypolicy.md#throttling)). If the cluster doesn't have sufficient capacity to handle all continuous exports, some will start lagging behind.
* The [show commands-and-queries command](../commands-and-queries.md) can be used to estimate the resources consumption. 
  * Filter on `| where ClientActivityId startswith "RunContinuousExports"` to view the commands and queries associated with continuous export.

## Limitations

* Continuous export doesn't work for data ingested using streaming ingestion. 
* Continuous export can't be configured on a table on which a [Row Level Security policy](../../management/rowlevelsecuritypolicy.md) is enabled.
* Continuous export isn't supported for external tables with `impersonate` in their [connection strings](../../api/connection-strings/storage.md).
* Continuous export doesn't support cross-database/cluster calls.
* Continuous export isn't designed for constantly streaming data out of Kusto. Continuous export runs in a distributed mode, where all nodes export concurrently. If the range of data queried by each run is small, the output of the continuous export would be many small artifacts. The number of artifacts depends on the number of nodes in the cluster.
* If the artifacts used by continuous export are intended to trigger Event Grid notifications, see the [known issues section in the Event Grid documentation](../data-ingestion/eventgrid.md#known-issues).
