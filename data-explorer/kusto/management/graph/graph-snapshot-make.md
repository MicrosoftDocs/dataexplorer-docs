---
title: .make graph_snapshot command
description: Learn how to create a graph snapshot from a graph model using the .make graph_snapshot command with syntax, parameters, and examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .make graph_snapshot (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in Public Preview. Functionality and syntax are subject to change before General Availability.

Creates a new graph snapshot from a specified graph model. A graph snapshot is a materialized instance of a graph model that can be efficiently queried.

## Permissions

To run this command, the user needs [Database admin permissions](../../access-control/role-based-access-control.md).

## Syntax

`.make` [`async`] `graph_snapshot` *SnapshotName* `from` *GraphModelName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`|Keyword|❌|If specified, the command runs asynchronously and returns immediately.|
|*SnapshotName*|String|✅|The name of the snapshot to create. The name must be unique within the scope of the graph model.|
|*GraphModelName*|String|✅|The name of the graph model from which to create the snapshot.|

## Returns

If run synchronously, this command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*Name*|String|The name of the created snapshot.|
|*SnapshotTime*|DateTime|The timestamp when the snapshot was created.|
|*ModelName*|String|The name of the graph model.|
|*ModelId*|String|The unique identifier of the graph model.|
|*ModelCreationTime*|DateTime|The timestamp when the graph model was created.|
|*NodesCount*|Long|The number of nodes in the snapshot.|
|*EdgesCount*|Long|The number of edges in the snapshot.|
|*RetentionPolicy*|String|The retention policy applied to the snapshot in JSON format.|

If run asynchronously, the command returns an operation ID that can be used to check the status of the operation.

## Examples

### Create a graph snapshot synchronously

```kusto
.make graph_snapshot WeeklySnapshot from SocialNetwork
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|NodesCount|EdgesCount|RetentionPolicy|
|---|---|---|---|---|---|---|---|
|WeeklySnapshot|2025-05-24 05:26:35.1495944|SocialNetwork|55953ea5-e03e-47b1-9126-35d8271bed90|2025-05-21 10:47:05.8611670|2|1|{</br>  "SoftDeletePeriod": "365000.00:00:00"<//br>}|

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

## Related content

* [Graph model overview](graph-model-overview.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.show graph_snapshots](graph-snapshots-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
