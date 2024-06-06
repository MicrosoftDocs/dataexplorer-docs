---
title:  Create or alter continuous data export
description:  This article describes how to create or alter continuous data export.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/29/2023
---
# Create or alter continuous export

Creates or alters a continuous export job.

## Permissions

You must have at least [Database Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create-or-alter` `continuous-export` *continuousExportName* [`over` `(`*T1*, *T2* `)`] `to` `table` *externalTableName* [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *query*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *continuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. Must be unique within the database. |
| *externalTableName* | `string` |  :heavy_check_mark: | The name of the [external table](../../query/schema-entities/external-tables.md) export target. |
| *query* | `string` |  :heavy_check_mark: | The query to export. |
| *T1*, *T2* | `string` | | A comma-separated list of fact tables in the query. If not specified, all tables referenced in the query are assumed to be fact tables. If specified, tables *not* in this list are treated as dimension tables and won't be scoped, so all records will participate in all exports. See [continuous data export overview](continuous-data-export.md) for details. |
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of optional [properties](#supported-properties).|

> [!NOTE]
> If the target external table uses [impersonation](../../api/connection-strings/storage-authentication-methods.md#impersonation) authentication, you must specify a managed identity to run the continuous export. For more information, see [Use a managed identity to run a continuous export job](continuous-export-with-managed-identity.md).

## Supported properties

| Property | Type | Description |
|--|--|--|
| `intervalBetweenRuns` | `Timespan` | The time span between continuous export executions. Must be greater than 1 minute. |
| `forcedLatency` | `Timespan` | An optional period of time to limit the query to records that were ingested only prior to this period (relative to current time). This property is useful if, for example, the query performs some aggregations/joins and you would like to make sure all relevant records have already been ingested before running the export. |
| `sizeLimit` | `long` | The size limit in bytes of a single storage artifact being written (prior to compression). Valid range: 100 MB (default) to 1 GB. |
| `distributed` | `bool` | Disable/enable distributed export. Setting to false is equivalent to `single` distribution hint. Default is true. |
| `parquetRowGroupSize` | `int` | Relevant only when data format is Parquet. Controls the row group size in the exported files. Default row group size is 100,000 records. |
| `useNativeParquetWriter` | `bool` | Use the new export implementation when exporting to Parquet, this implementation is a more performant, resource light export mechanism. Note that an exported 'datetime' column is currently unsupported by Synapse SQL 'COPY'. Default is false. |
| `managedIdentity` | `string` | The managed identity on behalf of which the continuous export job will run. The managed identity can be an object ID, or the `system` reserved word. For more information, see [Use a managed identity to run a continuous export job](continuous-export-with-managed-identity.md#use-a-managed-identity-to-run-a-continuous-export-job).|
| `isDisabled` | `bool` | Disable/enable the continuous export. Default is false. |

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

| Name | ExternalTableName | Query | ForcedLatency | IntervalBetweenRuns | CursorScopedTables | ExportProperties |
|--|--|--|--|--|--|--|
| MyExport | ExternalBlob | S | 00:10:00 | 01:00:00 | [<br>  "['DB'].['S']"<br>] | {<br>  "SizeLimit": 104857600<br>} |
