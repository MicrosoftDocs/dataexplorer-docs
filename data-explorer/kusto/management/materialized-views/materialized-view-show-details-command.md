---
title: .show materialized view details - Azure Data Explorer
description: This article describes .show materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---
# .show materialized view details

Returns a set that contains the specified materialized view or all materialized views in the database with a detailed summary of each materialized view's properties.

Requires [Database viewer permission](../access-control/role-based-access-control.md).

```kusto
.show materialized-view MV1 details
.show materialized-views (MV1, ..., MVn) details
.show materialized-views details
```

## Syntax

`.show` `materialized-view` *MaterializedViewName* `details`

`.show` `.materialized-views` `(`*MaterializedViewsNames*`)` `details`

`.show` `.materialized-views` `details`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |
| *MaterializedViewsNames* | string | &check; | One or more comma-separated materialized view names. |

## Output

Properties that describe policies or extents refer to the [materialized part of the view](materialized-view-overview.md#how-materialized-views-work).

| Column name           | Type     | Description                                                                                     |
|----------------------------|----------|-------------------------------------------------------------------------------------------------|
| `MaterializedViewName`     | String   | The name of the materialized view.                                                                          |
| `DatabaseName`             | String   | The database that the materialized view belongs to.                                                         |
| `Folder`                   | String   | The materialized view's folder.                                                                             |
| `DocString`                | String   | A string documenting the materialized view.                                                                 |
| `TotalExtents`             | Int64    | The total number of extents in the materialized view.                                                       |
| `TotalExtentSize`          | Double   | The total size of extents (compressed size + index size) in the materialized view (in bytes).               |
| `TotalOriginalSize`        | Double   | The total original size of data in the materialized view (in bytes).                                        |
| `TotalRowCount`            | Int64    | The total number of rows in the materialized view.                                                          |
| `HotExtents`               | Int64    | The total number of extents in the materialized view, stored in the hot cache.                              |
| `HotExtentSize`            | Double   | The total size of extents (compressed size + index size) in the materialized view, stored in the hot cache (in bytes). |
| `HotOriginalSize`          | Double   | The total original size of data in the materialized view, stored in the hot cache (in bytes).               |
| `HotRowCount`              | Int64    | The total number of rows in the materialized view, stored in the hot cache.                                 |
| `AuthorizedPrincipals`     | String   | The materialized view's authorized principals, serialized as JSON.                                          |
| `RetentionPolicy`          | String   | The materialized view's effective`*` retention policy, serialized as JSON.                                  |
| `CachingPolicy`            | String   | The materialized view's effective`*` caching policy, serialized as JSON.                                    |
| `ShardingPolicy`           | String   | The materialized view's effective`*` sharding policy, serialized as JSON.                                   |
| `MergePolicy`              | String   | The materialized view's effective`*` merge policy, serialized as JSON.                                      |
| `MinExtentsCreationTime`   | DateTime | The minimum creation time of an extent in the materialized view (or null, if there are no extents).         |
| `MaxExtentsCreationTime`   | DateTime | The maximum creation time of an extent in the materialized view (or null, if there are no extents).         |

`*` *Taking into account policies of parent entities (such as database/cluster).*

**Output example**

| MaterializedViewName         | DatabaseName | Folder | DocString | TotalExtents | TotalExtentSize | TotalOriginalSize | TotalRowCount | HotExtents | HotExtentSize | HotOriginalSize | HotRowCount | AuthorizedPrincipals | RetentionPolicy | CachingPolicy | ShardingPolicy |MergePolicy  | MinExtentsCreationTime  | MaxExtentsCreationTime      |
|-------------------|--------------|--------|-----------|--------------|-----------------|-------------------|---------------|------------|---------------|-----------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|-----------------------------|-----------------------------|
| OperationsView | Operations   |        |           | 1109         | 76588803        | 91553069          | 110125        | 27         | 2635742       | 2929926         | 3162        | [{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] | { "SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 } | { "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } | { "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } | { "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } |  2018-02-08 15:30:38.8489786 | 2018-02-14 07:47:28.7660267 |
