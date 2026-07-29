---
title: .show graph_snapshots data statistics command
description: Learn how to display storage profile statistics for graph snapshots by using the .show graph_snapshots data statistics command.
ms.reviewer: royo
ms.topic: reference
ms.date: 06/16/2026
---

# .show graph_snapshots data statistics (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in preview. Functionality and syntax are subject to change before General Availability.

Displays a storage profile for graph snapshots, including persisted size, compression, index footprint, and element count for nodes, edges, and graph structure data.

## Permissions

You must have at least [Database User, Database Viewer, or Database Monitor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `graph_snapshots` *GraphModelName* `data` `statistics`

`.show` `graph_snapshots` `*` `data` `statistics`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|`string`|✅|The name of the graph model to display data statistics for. Use `*` to show data statistics for all graph models in scope.|

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

### Show data statistics for all snapshots of a graph model

```kusto
.show graph_snapshots MyGraphModel data statistics
```

#### Output

|DatabaseName|GraphModelName|SnapshotName|EntityKind|TotalExtentSize|OriginalSize|DataCompressedSize|IndexSize|CompressionRatio|TotalElementCount|
|--|--|--|--|--:|--:|--:|--:|--:|--:|
|MyDatabase|MyGraphModel|snapshot1|Nodes|17860000|56000000|16970000|890000|3.30|1000000|
|MyDatabase|MyGraphModel|snapshot1|Edges|23280000|60000000|22440000|840000|2.67|2000000|
|MyDatabase|MyGraphModel|snapshot1|GraphStructure|4120000|9800000|4120000|0|2.38|3000000|
|MyDatabase|MyGraphModel|snapshot2|Nodes|18620000|58400000|17610000|1010000|3.32|1050000|
|MyDatabase|MyGraphModel|snapshot2|Edges|24150000|62800000|23230000|920000|2.70|2100000|

### Show data statistics for all snapshots across all graph models on the current scope

```kusto
.show graph_snapshots * data statistics
```

This command returns data statistics for snapshots across all graph models in scope. The output shape is the same: two or three rows per snapshot.

## Notes

- This command reports storage profile metrics. For build-time metrics such as CPU, memory, and duration, use [.show graph_snapshots statistics](graph-snapshots-statistics-show.md).

## Related commands

- [.show graph_snapshot data statistics](graph-snapshot-data-statistics-show.md)
- [.show graph_snapshots statistics](graph-snapshots-statistics-show.md)
- [.show graph_snapshots](graph-snapshots-show.md)
