---
title: .drop graph_model command
description: Learn how to delete an existing graph model and all its versions using the .drop graph_model command.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/28/2025
---

# .drop graph_model (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Deletes an existing graph model and all its versions from the database, including any associated snapshots.

## Permissions

To run this command, you need [Database admin permissions](../../access-control/role-based-access-control.md) or [Graph admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.drop` `graph_model` *GraphModelName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The name of the graph model to drop.|

## Returns

This command doesn't return any output.

## Examples

### Drop a graph model

```kusto
.drop graph_model SocialNetwork
```

## Notes

- The `.drop graph_model` command permanently deletes the graph model and all its versions. This operation can't be undone.
- This command also deletes all snapshots associated with the graph model.
- Dropping a graph model doesn't affect the source data that was used to create it.

## Related content

- [Graph model overview](graph-model-overview.md)
- [.create-or-alter graph_model](graph-model-create-or-alter.md)
- [.show graph_model](graph-model-show.md)
- [.show graph_models](graph-models-show.md)
- [.drop graph_snapshot](graph-snapshot-drop.md)
