---
title: .drop graph_model command
description: Learn how to delete an existing graph model and all its versions
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .drop graph_model (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Deletes an existing graph model and all its versions from the database, including any associated snapshots.

## Syntax

`.drop` `graph_model` *GraphModelName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|Yes|The name of the graph model to drop.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*GraphModelName*|String|The name of the dropped graph model.|
|*Result*|String|The result of the operation. If successful, the message is "Graph model 'GraphModelName' was dropped".|

## Examples

### Drop a graph model

```kusto
.drop graph_model SocialNetwork
```

**Output**

|GraphModelName|Result|
|---|---|
|SocialNetwork|Graph model 'SocialNetwork' was dropped|

## Notes

- The `.drop graph_model` command permanently deletes the graph model and all its versions. This operation cannot be undone.
- This command also deletes all snapshots associated with the graph model.
- Before dropping a graph model, ensure that no queries or processes are currently using it or its snapshots.
- Dropping a graph model doesn't affect the source data that was used to create it.

## Required permissions

To run this command, the user needs [Database Admin permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.show graph_model](graph-model-show.md)
* [.show graph_models](graph-models-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)