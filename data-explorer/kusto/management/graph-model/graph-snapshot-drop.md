---
title: .drop graph_snapshot command
description: Learn how to delete a specific graph snapshot
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .drop graph_snapshot (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Deletes a specific graph snapshot from a graph model.

## Syntax

`.drop` `graph_snapshot` *GraphModelName*`.`*SnapshotName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model that the snapshot belongs to.|
|*SnapshotName*|String|Yes|The name of the graph snapshot to drop.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|GraphModelName|String|The name of the graph model.|
|SnapshotName|String|The name of the dropped snapshot.|
|Result|String|The result of the operation. If successful, the message is "Graph snapshot 'GraphModelName.SnapshotName' was dropped".|

## Examples

### Drop a specific graph snapshot

```kusto
.drop graph_snapshot SocialNetwork.OldSnapshot
```

**Output**

|GraphModelName|SnapshotName|Result|
|---|---|---|
|SocialNetwork|OldSnapshot|Graph snapshot 'SocialNetwork.OldSnapshot' was dropped|

## Notes

- The `.drop graph_snapshot` command permanently deletes a specific graph snapshot. This operation cannot be undone.
- Before dropping a snapshot, ensure that no queries or processes are currently using it.
- Dropping a snapshot doesn't affect the graph model from which it was created.
- To drop all snapshots for a specific graph model, use the [.drop graph_snapshots](graph-snapshots-drop.md) command.

## Required permissions

To run this command, the user needs [Database Admin permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshots](graph-snapshots-drop.md)