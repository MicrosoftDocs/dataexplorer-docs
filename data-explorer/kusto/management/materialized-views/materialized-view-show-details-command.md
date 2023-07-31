---
title:  .show materialized-view details
description: This article describes show materialized-view details command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .show materialized view details

Returns a set that contains the specified materialized view or all materialized views in the database with a detailed summary of each materialized view's properties.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `details`

`.show` `.materialized-views` `(`*MaterializedViewName*, [, ...n]`)` `details`

`.show` `.materialized-views` `details`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

## Returns

Properties that describe policies or extents refer to the [materialized part of the view](materialized-view-overview.md#how-materialized-views-work).

Following is the schema of the output returned:

| Column name              | Type     | Description                                                                                                            |
|--------------------------|----------|------------------------------------------------------------------------------------------------------------------------|
| MaterializedViewName     | string   | Name of the materialized view.                                                                                         |
| DatabaseName             | string   | Database that the materialized view belongs to.                                                                        |
| Folder                   | string   | Folder under which the materialized view is created.                                                                   |
| DocString                | string   | Description assigned to the materialized view.                                                                         |
| TotalExtents             | int      | Total number of extents in the materialized view.                                                                      |
| TotalExtentSize          | double   | Total size of extents (compressed size + index size) in the materialized view (in bytes).                              |
| TotalOriginalSize        | double   | Total original size of data in the materialized view (in bytes).                                                       |
| TotalRowCount            | int      | Total number of rows in the materialized view.                                                                         |
| HotExtents               | int      | Total number of extents in the materialized view, stored in the hot cache.                                             |
| HotExtentSize            | double   | Total size of extents (compressed size + index size) in the materialized view, stored in the hot cache (in bytes).     |
| HotOriginalSize          | double   | Total original size of data in the materialized view, stored in the hot cache (in bytes).                              |
| HotRowCount              | int      | Total number of rows in the materialized view, stored in the hot cache.                                                |
| AuthorizedPrincipals     | string   | Materialized view's authorized principals, serialized as JSON.                                                         |
| RetentionPolicy          | string   | Materialized view's effective`*` retention policy, serialized as JSON.                                                 |
| CachingPolicy            | string   | Materialized view's effective`*` caching policy, serialized as JSON.                                                   |
| ShardingPolicy           | string   | Materialized view's effective`*` sharding policy, serialized as JSON.                                                  |
| MergePolicy              | string   | Materialized view's effective`*` merge policy, serialized as JSON.                                                     |
| MinExtentsCreationTime   | datetime | Minimum creation time of an extent in the materialized view (or null, if there are no extents).                        |
| MaxExtentsCreationTime   | datetime | Maximum creation time of an extent in the materialized view (or null, if there are no extents).                        |

`*` *Taking into account policies of parent entities (such as database/cluster).*

## Examples

### Show details about one materialized view

The following command shows details for materialized view OperationsView:

```kusto
.show materialized-view OperationsView details
```

**Output:**

| MaterializedViewName | DatabaseName | Folder | DocString | TotalExtents | TotalExtentSize | TotalOriginalSize | TotalRowCount | HotExtents | HotExtentSize | HotOriginalSize | HotRowCount | AuthorizedPrincipals                                                                                                                                                                               | RetentionPolicy                                                                                                                                       | CachingPolicy                                                                        | ShardingPolicy                                                                    |MergePolicy                                                                                                                                              | MinExtentsCreationTime       | MaxExtentsCreationTime      |
|----------------------|--------------|--------|-----------|--------------|-----------------|-------------------|---------------|------------|---------------|-----------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|-----------------------------|
| OperationsView       | Operations   |        |           | 1109         | 76588803        | 91553069          | 110125        | 27         | 2635742       | 2929926         | 3162        | [{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] | { "SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 } | { "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } | { "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } | { "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } |  2023-02-08 15:30:38.8489786 | 2023-02-14 07:47:28.7660267 |
