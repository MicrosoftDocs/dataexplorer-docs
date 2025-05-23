---
title: .show graph_snapshot command
description: Learn how to display information about a specific graph snapshot
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .show graph_snapshot (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Shows detailed information about a specific graph snapshot.

## Syntax

`.show` `graph_snapshot` *GraphModelName*`.`*SnapshotName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model that the snapshot belongs to.|
|*SnapshotName*|String|Yes|The name of the graph snapshot to show.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|GraphModelName|String|The name of the graph model that the snapshot belongs to.|
|SnapshotName|String|The name of the graph snapshot.|
|GraphModelVersion|String|The version of the graph model used to create this snapshot.|
|NodeCount|Long|The number of nodes in the graph snapshot.|
|EdgeCount|Long|The number of edges in the graph snapshot.|
|Created|DateTime|The date and time when the snapshot was created.|
|Size|Long|The approximate size of the snapshot in bytes.|
|Status|String|The current status of the snapshot (e.g., "Ready", "Creating", "Failed").|
|Properties|Dynamic|A JSON object containing additional properties of the snapshot.|

## Examples

### Show a graph snapshot

```kusto
.show graph_snapshot SocialNetwork.WeeklySnapshot
```

**Output**

|GraphModelName|SnapshotName|GraphModelVersion|NodeCount|EdgeCount|Created|Size|Status|Properties|
|---|---|---|---|---|---|---|---|---|
|SocialNetwork|WeeklySnapshot|v3|15426|67845|2025-04-25T10:30:15Z|128456789|Ready|{"createdBy":"user@contoso.com"}|

## Notes

- The `.show graph_snapshot` command provides detailed information about a specific graph snapshot, including its size and creation time.
- The status field indicates whether the snapshot is ready to be queried:
  - "Ready" means the snapshot is fully created and can be queried
  - "Creating" means the snapshot is still being built
  - "Failed" indicates an error occurred during the snapshot creation

## Required permissions

To run this command, the user needs [Database Viewer permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)