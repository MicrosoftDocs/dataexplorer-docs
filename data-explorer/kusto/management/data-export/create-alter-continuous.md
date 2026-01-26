---
title:  .create or alter continuous-export
description:  This article describes how to create or alter continuous data export.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/18/2025
---
# .create or alter continuous-export

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

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
| *T1*, *T2* | `string` | | A comma-separated list of fact tables in the query. If not specified, all tables referenced in the query are assumed to be fact tables. If specified, tables *not* in this list are treated as dimension tables and aren't scoped, so all records participate in all exports. See [continuous data export overview](continuous-data-export.md) for details. |
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of optional [properties](#supported-properties).|

::: moniker range="azure-data-explorer"
> [!NOTE]
> If the target external table uses [impersonation](../../api/connection-strings/storage-connection-strings.md#impersonation) authentication, you must specify a managed identity to run the continuous export. For more information, see [Use a managed identity to run a continuous export job](continuous-export-with-managed-identity.md).
::: moniker-end

## Supported properties

::: moniker range="azure-data-explorer"

| Property | Type | Description |
|--|--|--|
| `intervalBetweenRuns` | `Timespan` | The time span between continuous export executions. Must be greater than 1 minute. |
| `forcedLatency` | `Timespan` | An optional period of time to limit the query to records ingested before a specified period relative to the current time. This property is useful if, for example, the query performs some aggregations or joins, and you want to make sure all relevant records have been ingested before running the export. |
| `sizeLimit` | `long` | The size limit in bytes of a single storage artifact written before compression. Valid range: 100 MB (default) to 1 GB. |
| `distributed` | `bool` | Disable or enable distributed export. Setting to false is equivalent to `single` distribution hint. Default is `true`. |
| `distribution` | `string` | Distribution hint (`single`, `per_node`, `per_shard`). See more details in [Distribution settings](export-data-to-an-external-table.md#distribution-settings). Default is `per_node` |
| `distributionKind` | `string` | Optionally switches to uniform distribution when the external table is partitioned by string partition. Valid values are `uniform` or `default`. See more details in [Distribution settings](export-data-to-an-external-table.md#distribution-settings) |
| `parquetRowGroupSize` | `int` | Relevant only when data format is Parquet. Controls the row group size in the exported files. Default row group size is 100,000 records. |
| `managedIdentity` | `string` | The managed identity for which the continuous export job runs. The managed identity can be an object ID, or the `system` reserved word. For more information, see [Use a managed identity to run a continuous export job](continuous-export-with-managed-identity.md#use-a-managed-identity-to-run-a-continuous-export-job). |
| `isDisabled` | `bool` | Disable or enable the continuous export. Default is false. |
| `managedIdentity` | `string` | The managed identity on behalf of which the continusou export runs. The managed identity can be an object ID, or the `system` reserved word. The continuous export must be configured with a managed identity when the query references tables in other databases or tables with an enabled [row level security policy](row-level-security-policy.md). For more information, see [Use a managed identity to run a continuous export job](continuous-export-with-managed-identity.md). |

::: moniker-end
::: moniker range="microsoft-fabric"

| Property | Type | Description |
|--|--|--|
| `intervalBetweenRuns` | `Timespan` | The time span between continuous export executions. Must be greater than 1 minute. |
| `forcedLatency` | `Timespan` | An optional period of time to limit the query to records ingested before a specified period relative to the current time. This property is useful if, for example, the query performs some aggregations or joins, and you want to make sure all relevant records have been ingested before running the export. |
| `sizeLimit` | `long` | The size limit in bytes of a single storage artifact written before compression. Valid range: 100 MB (default) to 1 GB. |
| `distributed` | `bool` | Disable or enable distributed export. Setting to false is equivalent to `single` distribution hint. Default is `true`. |
| `distribution` | `string` | Distribution hint (`single`, `per_node`, `per_shard`). See more details in [Distribution settings](export-data-to-an-external-table.md#distribution-settings). Default is `per_node` |
| `distributionKind` | `string` | Optionally switches to uniform distribution when the external table is partitioned by string partition. Valid values are `uniform` or `default`. See more details in [Distribution settings](export-data-to-an-external-table.md#distribution-settings) |
| `parquetRowGroupSize` | `int` | Relevant only when data format is Parquet. Controls the row group size in the exported files. Default row group size is 100,000 records. |
| `isDisabled` | `bool` | Disable or enable the continuous export. Default is false. |

::: moniker-end

## Example

The following example creates or alters a continuous export `MyExport` that exports data from the `T` table to `ExternalBlob`. The data exports occur every hour, and have a defined forced latency and size limit per storage artifact.

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

## Related content

* [Continuous export overview](continuous-data-export.md)
* [External tables](../../query/schema-entities/external-tables.md)
* [Disable or enable continuous export](disable-enable-continuous.md)
* [.show continuous-exports](show-continuous-export.md)
* [.show continuous-export](show-continuous-export.md)
* [.drop continuous-export](drop-continuous-export.md)
* [.show continuous-export failures](show-continuous-failures.md)
