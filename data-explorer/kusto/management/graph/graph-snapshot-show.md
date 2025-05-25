---
title: .show graph_snapshot command
description: Learn how to display information about a specific graph snapshot using the .show graph_snapshot command.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .show graph_snapshot (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Shows detailed information about a specific graph snapshot.

## Syntax

`.show` `graph_snapshot` *GraphModelName*`.`*SnapshotName* [`details`]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model that the snapshot belongs to.|
|*SnapshotName*|String|✅|The name of the graph snapshot to show.|
|`details`|String|❌|Optional parameter to show additional detailed information about the snapshot, including node count, edge count, and retention policy.|

## Returns

This command returns a table with different columns depending on whether the `details` parameter is specified.

### Basic output (without `details`)

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph snapshot.|
|SnapshotTime|DateTime|The date and time when the snapshot was created.|
|ModelName|String|The name of the graph model that the snapshot belongs to.|
|ModelId|String|The unique identifier of the graph model.|
|ModelCreationTime|DateTime|The date and time when the graph model was created.|

### Detailed output (with `details`)

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph snapshot.|
|SnapshotTime|DateTime|The date and time when the snapshot was created.|
|ModelName|String|The name of the graph model that the snapshot belongs to.|
|ModelId|String|The unique identifier of the graph model.|
|ModelCreationTime|DateTime|The date and time when the graph model was created.|
|NodesCount|Long|The number of nodes in the graph snapshot.|
|EdgesCount|Long|The number of edges in the graph snapshot.|
|RetentionPolicy|Dynamic|A JSON object containing the retention policy settings for the snapshot.|

## Examples

### Show basic graph snapshot information

```kusto
.show graph_snapshot SomeGraph.Latest2
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|
|---|---|---|---|---|
|Latest2|2025-05-24 06:34:51.6518833|SomeGraph|55953ea5-e03e-47b1-9126-35d8271bed90|2025-05-21 10:47:05.8611670|

### Show detailed graph snapshot information

```kusto
.show graph_snapshot SomeGraph.Latest2 details
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|NodesCount|EdgesCount|RetentionPolicy|
|---|---|---|---|---|---|---|---|
|Latest2|2025-05-24 06:34:51.6518833|SomeGraph|55953ea5-e03e-47b1-9126-35d8271bed90|2025-05-21 10:47:05.8611670|2|1|{<br>  "SoftDeletePeriod": "365000.00:00:00"<br>}|

## Notes

- The `.show graph_snapshot` command provides information about a specific graph snapshot.
- Use the basic format to get essential snapshot information including creation time and model details.
- Use the `details` parameter to get additional information including node count, edge count, and retention policy.
- The retention policy shows the soft delete period, which determines how long the snapshot is retained before being permanently deleted.

## Required permissions

To run this command, the user needs [Database Viewer permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
