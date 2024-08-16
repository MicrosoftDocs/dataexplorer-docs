---
title: .show table details command
description: Learn how to use the `.show table details` command to show the properties of the specified tables in the database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# .show table details command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a set that contains the specified table or all tables in the database with a detailed summary of each table's properties.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `details`

`.show` `tables` `(`*TableName* [`,` ...]`)` `details`

`.show` `tables` `details`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show details.|

## Returns

| Output parameter           | Type     | Description                                                                                     |
|----------------------------|----------|-------------------------------------------------------------------------------------------------|
| `TableName`                | `string` | The name of the table.                                                                          |
| `DatabaseName`             | `string` | The database that the table belongs to.                                                         |
| `Folder`                   | `string` | The table's folder.                                                                             |
| `DocString`                | `string` | A string documenting the table.                                                                 |
| `TotalExtents`             | Int64    | The total number of extents in the table`**`.                                                   |
| `TotalExtentSize`          | Double   | The total size of extents (compressed size + index size) in the table (in bytes)`**`.           |
| `TotalOriginalSize`        | Double   | The total original size of data in the table (in bytes)`**`.                                    |
| `TotalRowCount`            | Int64    | The total number of rows in the table`**`.                                                      |
| `HotExtents`               | Int64    | The total number of extents in the table, stored in the hot cache`**`.                          |
| `HotExtentSize`            | Double   | The total size of extents (compressed size + index size) in the table, stored in the hot cache (in bytes)`**`. |
| `HotOriginalSize`          | Double   | The total original size of data in the table, stored in the hot cache (in bytes)`**`.           |
| `HotRowCount`              | Int64    | The total number of rows in the table, stored in the hot cache`**`.                             |
| `AuthorizedPrincipals`     | `string` | The table's authorized principals, serialized as JSON.                                          |
| `RetentionPolicy`          | `string` | The table's effective`*` retention policy, serialized as JSON.                                  |
| `CachingPolicy`            | `string` | The table's effective`*` caching policy, serialized as JSON.                                    |
| `ShardingPolicy`           | `string` | The table's effective`*` sharding policy, serialized as JSON.                                   |
| `MergePolicy`              | `string` | The table's effective`*` merge policy, serialized as JSON.                                      |
| `StreamingIngestionPolicy` | `string` | The table's effective`*` streaming ingestion policy, serialized as JSON.                        |
| `IngestionBatchingPolicy`  | `string` | The table's effective`*` ingestion batching policy, serialized as JSON.                         |
| `MinExtentsCreationTime`   | `datetime` | The minimum creation time of an extent in the table (or null, if there are no extents)`**`.     |
| `MaxExtentsCreationTime`   | `datetime` | The maximum creation time of an extent in the table (or null, if there are no extents)`**`.     |
| `RowOrderPolicy`           | `string` | The table's effective row order policy, serialized as JSON.                                     |
| `TableId`                  | `string` | The table's unique ID.                                                           |

`*` *Taking into account policies of parent entities.*

`**` *Values may be up to 15 minutes old, as they're taken from a cached summary of the table's extents.*

**Output example**

| TableName         | DatabaseName | Folder | DocString | TotalExtents | TotalExtentSize | TotalOriginalSize | TotalRowCount | HotExtents | HotExtentSize | HotOriginalSize | HotRowCount | AuthorizedPrincipals                                                                                                                                                                               | RetentionPolicy                                                                                                                                       | CachingPolicy                                                                        | ShardingPolicy                                                                    | MergePolicy                                                                                                                                             | StreamingIngestionPolicy | IngestionBatchingPolicy | MinExtentsCreationTime      | MaxExtentsCreationTime      | TableID                      |
|-------------------|--------------|--------|-----------|--------------|-----------------|-------------------|---------------|------------|---------------|-----------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|-------------------------|-----------------------------|-----------------------------|-------------------------------|
| Operations        | Operations   |        |           | 1164         | 37687203        | 53451358          | 223325        | 29         | 838752        | 1388213         | 5117        | [{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] | {"SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 }  | { "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } | { "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } | { "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } | null                     | null                    |                             |                             | 99490f60-ba91-4188-a9ad-7ce3c0cc2b0c |
| ServiceOperations | Operations   |        |           | 1109         | 76588803        | 91553069          | 110125        | 27         | 2635742       | 2929926         | 3162        | [{"Type": "AAD User", "DisplayName": "My Name (upn: alias@fabrikam.com)", "ObjectId": "a7a77777-4c21-4649-95c5-350bf486087b", "FQN": "aaduser=a7a77777-4c21-4649-95c5-350bf486087b", "Notes": ""}] | { "SoftDeletePeriod": "365.00:00:00", "ContainerRecyclingPeriod": "1.00:00:00", "ExtentsDataSizeLimitInBytes": 0, "OriginalDataSizeLimitInBytes": 0 } | { "DataHotSpan": "4.00:00:00", "IndexHotSpan": "4.00:00:00", "ColumnOverrides": [] } | { "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048 } | { "RowCountUpperBoundForMerge": 0, "MaxExtentsToMerge": 100, "LoopPeriod": "01:00:00", "MaxRangeInHours": 3, "AllowRebuild": true, "AllowMerge": true } | null                     | null                    | 2018-02-08 15:30:38.8489786 | 2018-02-14 07:47:28.7660267 | 873a0f60-97c1-8158-daad-b0cce73c0cc2 |

## Related content

* [Estimate table size](../management/estimate-table-size.md)
