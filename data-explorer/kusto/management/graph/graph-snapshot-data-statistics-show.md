---
title: .show graph_snapshot data statistics command
description: Learn how to display storage profile statistics for a graph snapshot by using the .show graph_snapshot data statistics command.
ms.reviewer: royo
ms.topic: reference
ms.date: 06/16/2026
---

# .show graph_snapshot data statistics (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in preview. Functionality and syntax are subject to change before General Availability.

Displays a storage profile for a specific graph snapshot, including persisted size, compression, index footprint, and element count for nodes, edges, and graph structure data.

## Permissions

You must have at least [Database User, Database Viewer, or Database Monitor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `graph_snapshot` *GraphModelName*`.`*SnapshotName* `data` `statistics`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|`string`|✅|The name of the graph model.|
|*SnapshotName*|`string`|✅|The name of the snapshot to display data statistics for.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*DatabaseName*|`string`|The name of the database containing the graph model and snapshot.|
|*GraphModelName*|`string`|The name of the graph model.|
|*SnapshotName*|`string`|The name of the snapshot.|
|*EntityKind*|`string`|The data category for the row: `Nodes`, `Edges`, or `GraphStructure`.|
|*TotalExtentSize*|`long`|Total persisted size in bytes (`DataCompressedSize + IndexSize`)`*`.|
|*OriginalSize*|`long`|Uncompressed data size in bytes`*`.|
|*DataCompressedSize*|`long`|Compressed data size in bytes, excluding index`*`.|
|*IndexSize*|`long`|Index size in bytes, including the shared text index`*`.|
|*CompressionRatio*|`real`|`OriginalSize / DataCompressedSize`; 0 when `DataCompressedSize` is 0`*`.|
|*TotalElementCount*|`long`|Number of elements in the entity`*`.|

The command returns two or three rows per snapshot: one row each for `Nodes` and `Edges`, and an additional `GraphStructure` row when graph structure data exists.

`*` *Values may be up to 15 minutes old, as they're taken from a cached summary of the graph's extents.*

## Examples

### Show data statistics for a specific snapshot

```kusto
.show graph_snapshot MyGraphModel.snapshot1 data statistics
```

#### Output

|DatabaseName|GraphModelName|SnapshotName|EntityKind|TotalExtentSize|OriginalSize|DataCompressedSize|IndexSize|CompressionRatio|TotalElementCount|
|--|--|--|--|--:|--:|--:|--:|--:|--:|
|MyDatabase|MyGraphModel|snapshot1|Nodes|17860000|56000000|16970000|890000|3.30|1000000|
|MyDatabase|MyGraphModel|snapshot1|Edges|23280000|60000000|22440000|840000|2.67|2000000|
|MyDatabase|MyGraphModel|snapshot1|GraphStructure|4120000|9800000|4120000|0|2.38|3000000|

## Notes

- This command reports storage profile metrics. For build-time metrics such as CPU, memory, and duration, use [.show graph_snapshot statistics](graph-snapshot-statistics-show.md).

## Related commands

- [.show graph_snapshots data statistics](graph-snapshots-data-statistics-show.md)
- [.show graph_snapshot statistics](graph-snapshot-statistics-show.md)
- [.show graph_snapshot](graph-snapshot-show.md)
