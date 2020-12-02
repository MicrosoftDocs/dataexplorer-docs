---
title: Create or alter continuous data export - Azure Data Explorer
description: This article describes how to create or alter continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Create or alter continuous export

Creates or alters a continuous export job.

## Syntax

`.create-or-alter` `continuous-export` *ContinuousExportName* <br>
[ `over` `(`*T1*, *T2* `)`] <br>
`to` `table` *ExternalTableName* <br> 
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]<br>
\<| *Query*

## Properties

| Property             | Type     | Description   |
|----------------------|----------|---------------------------------------|
| ContinuousExportName | String   | Name of continuous export. Name must be unique within the database and is used to periodically run the continuous export.      |
| ExternalTableName    | String   | Name of [external table](../external-table-commands.md) to export to.  |
| Query                | String   | Query to export.  |
| over (T1, T2)        | String   | An optional comma-separated list of fact tables in the query. If not specified, all tables referenced in the query are assumed to be fact tables. If specified, tables *not* in this list are treated as dimension tables and will not be scoped (all records will participate in all exports). See [continuous data export overview](continuous-data-export.md) for details. |
| intervalBetweenRuns  | Timespan | The time span between continuous export executions. Must be greater than 1 minute.   |
| forcedLatency        | Timespan | An optional period of time to limit the query to records that were ingested only prior to this period (relative to current time). This property is useful if, for example, the query performs some aggregations/joins and you would like to make sure all relevant records have already been ingested before running the export.

In addition to the above, all properties supported in [export to external table command](export-data-to-an-external-table.md) are supported in the continuous export create command. 

## Example

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