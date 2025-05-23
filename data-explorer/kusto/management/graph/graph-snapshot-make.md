---
title: .make graph_snapshot command
description: Learn how to create a graph snapshot from a graph model
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .make graph_snapshot (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Creates a new graph snapshot from a specified graph model. A graph snapshot is a materialized instance of a graph model that can be efficiently queried.

## Syntax

`.make` [`async`] `graph_snapshot` *SnapshotName* `from` *GraphModelName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`|Keyword|No|If specified, the command will run asynchronously and return immediately.|
|*SnapshotName*|String|Yes|The name of the snapshot to create. The name must be unique within the scope of the graph model.|
|*GraphModelName*|String|Yes|The name of the graph model from which to create the snapshot.|

## Returns

If run synchronously, this command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*GraphModelName*|String|The name of the graph model.|
|*SnapshotName*|String|The name of the created snapshot.|
|*Result*|String|The result of the operation. If successful, the message is "Graph snapshot 'GraphModelName.SnapshotName' was created".|

If run asynchronously, the command returns an operation ID that can be used to check the status of the operation.

## Examples

### Create a graph snapshot synchronously

```kusto
.make graph_snapshot WeeklySnapshot from SocialNetwork
```

**Output**

|GraphModelName|SnapshotName|Result|
|---|---|---|
|SocialNetwork|WeeklySnapshot|Graph snapshot 'SocialNetwork.WeeklySnapshot' was created|

### Create a graph snapshot asynchronously

```kusto
.make async graph_snapshot DailySnapshot from ProductRecommendations
```

**Output**

|OperationId|Status|
|---|---|
|fe4a1358-ce9c-4512-9425-3f6d028565e2|InProgress|

## Notes

- Creating a graph snapshot materializes the graph model definition into a queryable format. This process can be time-consuming for large graphs.
- For large graphs, it's recommended to use the `async` option to run the operation in the background.
- A graph model can have multiple snapshots, each representing the state of the graph at different points in time.
- Snapshots are immutable. To update a snapshot with fresh data, you need to create a new snapshot.
- To query a graph snapshot, use the [.query graph_snapshot](graph-snapshot-query.md) command.

## Required permissions

To run this command, the user needs [Database Admin permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
* [.query graph_snapshot](graph-snapshot-query.md)