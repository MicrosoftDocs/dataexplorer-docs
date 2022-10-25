---
title: Continuous data export - Azure Data Explorer
description: This article describes Continuous data export in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/03/2020
---
# Continuous data export overview

This article describes continuous export of data from Kusto to an [external table](../../query/schema-entities/externaltables.md) with a periodically run query. The results are stored in the external table, which defines the destination, such as Azure Blob Storage, and the schema of the exported data. This process guarantees that all records are exported "exactly once", with some [exceptions](#exactly-once-export). 

To enable continuous data export, [create an external table](../external-tables-azurestorage-azuredatalake.md#create-or-alter-external-table) and then [create a continuous export definition](create-alter-continuous.md) pointing to the external table. 

> [!NOTE]
> All continuous export commands require [database admin permissions](../access-control/role-based-authorization.md).

## Continuous export guidelines

* **Output schema**:
  * The output schema of the export query must match the schema of the external table to which you export.
* **Frequency**:
  * Continuous export runs according to the time period configured for it in the `intervalBetweenRuns` property. The recommended value for this interval is at least several minutes, depending on the latencies you're willing to accept. The time interval can be as low as one minute, if the ingestion rate is high.

> [!NOTE]
> The `intervalBetweenRuns` serves as a recommendation only, and isn't guaranteed to be precise. Continuous export isn't suitable for exporting periodic aggregations.
> For example, a configuration of `intervalBetweenRuns`=`1h` with an hourly aggregation (`T | summarize by bin(Timestamp, 1h)`) won't work as expected, since the continuous export won't run exactly on-the-hour. Therefore, each hourly bin will receive multiple entries in the exported data.

* **Number of files**:
  * The number of files exported in each continuous export iteration depends on how the external table is partitioned. For more information, see [export to external table command](export-data-to-an-external-table.md#number-of-files). Each continuous export iteration always writes to new files, and never appends to existing ones. As a result, the number of exported files also depends on the frequency in which the continuous export runs. The frequency parameter is `intervalBetweenRuns`.
* **External table storage accounts**:
  * For best performance, the Azure Data Explorer cluster and the storage account(s) should be colocated in the same Azure region.
  * Continuous export works in a distributed manner, such that all nodes in the cluster are exporting concurrently. On large clusters, and if the exported data volume is large, this might lead to storage throttling. It's recommended to configure multiple storage accounts for the external table. See [storage failures during export commands](export-data-to-storage.md#failures-during-export-commands) for more details.

## Exactly once export

To guarantee "exactly once" export, continuous export uses [database cursors](../databasecursor.md). The continuous export query shouldn't include a timestamp filter - the database cursors mechanism ensures that records aren't processed more than once. Adding a timestamp filter in the query can lead to missing data in exported data.

[IngestionTime policy](../show-table-ingestion-time-policy-command.md) must be enabled on all tables referenced in the query that should be processed "exactly once" in the export. The policy is enabled by default on all newly created tables.

The guarantee for "exactly once" export is only for files reported in the [show exported artifacts command](show-continuous-artifacts.md). Continuous export doesn't guarantee that each record will be written only once to the external table. If a failure occurs after export has begun and some of the artifacts were already written to the external table, the external table may contain duplicates. If a write operation was aborted before completion, the external table may contain corrupted files. In such cases, artifacts aren't deleted from the external table, but they won't be reported in the [show exported artifacts command](show-continuous-artifacts.md). Consuming the exported files using the `show exported artifacts command` guarantees no duplications and no corruptions.

## Export from fact and dimension tables

By default, all tables referenced in the export query are assumed to be [fact tables](../../concepts/fact-and-dimension-tables.md). As such, they're scoped to the database cursor. The syntax explicitly declares which tables are scoped (fact) and which aren't scoped (dimension). See the `over` parameter in the [create command](create-alter-continuous.md) for details.

The export query includes only the records that joined since the previous export execution. The export query may contain [dimension tables](../../concepts/fact-and-dimension-tables.md) in which all records of the dimension table are included in all export queries. When using joins between fact and dimension tables in continuous-export, keep in mind that records in the fact table are only processed once. If the export runs while records in the dimension tables are missing for some keys, records for the respective keys will either be missed or include null values for the dimension columns in the exported files. Returning missed or null records depends on whether the query uses inner or outer join. The `forcedLatency` property in the continuous-export definition can be useful in such cases, where the fact and dimensions tables are ingested during the same time for matching records.

> [!NOTE]
> Continuous export of only dimension tables isn't supported. The export query must include at least a single fact table.

## Exporting historical data

Continuous export starts exporting data only from the point of its creation. Records ingested before that time should be exported separately using the non-continuous [export command](export-data-to-an-external-table.md). 

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

## Continuous export monitoring

Monitor the health of your continuous export jobs using the following [export metrics](../../../using-metrics.md#export-metrics):

* `Continuous export max lateness` - Max lateness (in minutes) of continuous exports in the cluster. This is the time between now and the min `ExportedTo` time of all continuous export jobs in cluster. For more information, see [`.show continuous export`](show-continuous-export.md) command.
* `Continuous export result` - Success/failure result of each continuous export execution. This metric can be split by the continuous export name.

Use the [`.show continuous export failures`](show-continuous-failures.md) command to see the specific failures of a continuous export job.

> [!WARNING]
> If a continuous export fails for over 7 days due to a permanent failure, the export will be automatically disabled by the system.
> Permanent errors include: external table not found, mismatch between schema of continuous export query and external table schema, storage account is not accessible.
> After the error has been fixed, you can re-enable the continuous export using the [`.enable continuous export`](disable-enable-continuous.md) command.

### Resource consumption

* The impact of the continuous export on the cluster depends on the query the continuous export is running. Most resources, such as CPU and memory, are consumed by the query execution. 
* The number of export operations that can run concurrently is limited by the cluster's data export capacity. For more information, see [Control commands throttling](../../management/capacitypolicy.md#control-commands-throttling). If the cluster doesn't have sufficient capacity to handle all continuous exports, some will start lagging behind.
* The [show commands-and-queries command](../commands-and-queries.md) can be used to estimate the resources consumption. 
  * Filter on `| where ClientActivityId startswith "RunContinuousExports"` to view the commands and queries associated with continuous export.

## Limitations

* Continuous export can't be configured on a table with [row level security policy](../../management/rowlevelsecuritypolicy.md), or a table with [restricted view access policy](../restrictedviewaccesspolicy.md).
* Continuous export cannot be created on [follower databases](../../../follower.md) since follower databases are read-only and continuous export requires write operations.  
* Continuous export will only work if records in source table are ingested to the table directly (either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools), using an [update policy](../updatepolicy.md), or [ingest from query commands](../data-ingestion/ingest-from-query.md). If records are moved into the table using [.move extents](../move-extents.md) or using [.rename table](../rename-table-command.md), continuous export may not process these records. See the limitations described in the [Database Cursors](../databasecursor.md#restrictions) page.
* Continuous export doesn't support cross-database and cross-cluster calls.
* Continuous export isn't designed to work over [materialized views](../materialized-views/materialized-view-overview.md), since a materialized view may be updated, while data exported to storage is always append only and never updated.
* Continuous export isn't designed for low-latency streaming data out of Azure Data Explorer.
* By default, continuous export runs in a distributed mode, where all nodes export concurrently, so the number of artifacts depends on the number of nodes in the cluster.
* If the artifacts used by continuous export are intended to trigger Event Grid notifications, see the [known issues section in the Event Grid documentation](../../../ingest-data-event-grid-overview.md#known-event-grid-issues).
