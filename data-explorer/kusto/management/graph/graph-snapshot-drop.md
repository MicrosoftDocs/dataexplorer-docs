---
title: .drop graph_snapshot command
description: Learn how to delete a specific graph snapshot using the .drop graph_snapshot command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .drop graph_snapshot (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Deletes a specific graph snapshot from a graph model.

## Permissions

To run this command, the user needs [Database Admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.drop` `graph_snapshot` *GraphModelName*`.`*SnapshotName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model that the snapshot belongs to.|
|*SnapshotName*|String|✅|The name of the graph snapshot to drop.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the dropped snapshot.|
|SnapshotTime|DateTime|The time when the snapshot was created.|
|ModelName|String|The name of the graph model.|
|ModelId|String|The unique identifier of the graph model.|
|ModelCreationTime|DateTime|The time when the graph model was created.|

## Examples

### Drop a specific graph snapshot

```kusto
.drop graph_snapshot SocialNetwork.OldSnapshot
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|
|---|---|---|---|---|
|Latest|2025-05-21 10:47:05.9122575|SomeGraph|55953ea5-e03e-47b1-9126-35d8271bed90|2025-05-21 10:47:05.8611670|

## Notes

- The `.drop graph_snapshot` command permanently deletes a specific graph snapshot. This operation can't be undone.
- Before dropping a snapshot, ensure that no queries or processes are currently using it.
- Dropping a snapshot doesn't affect the graph model from which it was created.
- To drop all snapshots for a specific graph model, use the [.drop graph_snapshots](graph-snapshots-drop.md) command.

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshots](graph-snapshots-drop.md)
