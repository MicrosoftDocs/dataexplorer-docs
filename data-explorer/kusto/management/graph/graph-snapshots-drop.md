---
title: .drop graph_snapshots command
description: Learn how to delete all graph snapshots for a specific graph model using the drop graph_snapshots command.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .drop graph_snapshots (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Deletes all graph snapshots associated with a specific graph model.

## Permissions

To run this command, you need [Database admin permissions](../../access-control/role-based-access-control.md) or [Graph admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.drop` `graph_snapshots` *GraphModelName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model for which to drop all snapshots.|

## Returns

This command doesn't return any output upon successful completion.

## Examples

### Drop all snapshots for a graph model

```kusto
.drop graph_snapshots SocialNetwork
```

The command completes successfully without returning any output.

## Important notes

- The `.drop graph_snapshots` command permanently deletes all snapshots associated with a graph model. This operation can't be undone.
- Dropping snapshots doesn't affect the graph model itself.
- To drop a specific snapshot instead of all snapshots, use the [`.drop graph_snapshot`](graph-snapshot-drop.md) command.

## Next steps

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
