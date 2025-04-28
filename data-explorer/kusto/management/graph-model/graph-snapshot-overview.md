---
title: Graph snapshots in Kusto - Overview
description: This article describes graph snapshots in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/28/2025
---

# Graph snapshots in Kusto (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

A graph snapshot is a database entity that represents an instance of a graph model materialized at a specific point in time. While a [graph model](graph-model-overview.md) defines the structure and data sources for a graph, a snapshot is the actual graph that can be queried.

## What is a graph snapshot?

A graph snapshot:
* Is linked to a specific graph model
* Represents the materialized graph based on the model's definition at creation time
* Persists in the database until explicitly dropped
* Can be queried directly without rebuilding the graph each time
* Contains metadata such as creation time and model information

You can create multiple snapshots from the same graph model to represent the state of data at different points in time. This allows for historical analysis and comparison of graph data over time.

## Graph snapshot structure

A graph snapshot consists of:

### 1. Metadata

* **Name**: The unique name of the snapshot
* **SnapshotTime**: The timestamp when the snapshot was created
* **Model information**:
  * **ModelName**: The name of the graph model this snapshot is based on
  * **ModelVersion**: The version of the graph model used
  * **ModelCreationTime**: When the source model was created

### 2. Graph data

* **Nodes**: All nodes materialized from the model's AddNodes steps
* **Edges**: All relationships materialized from the model's AddEdges steps
* **Properties**: All node and edge properties as defined in the model

## Example of a graph snapshot configuration

```json
{
  "Metadata": {
    "Name": "MySnapshot",
    "SnapshotTime": "2025-04-28T10:15:30Z"
  },
  "ModelInformation": {
    "ModelName": "MyGraph",
    "ModelVersion": "v1.2",
    "ModelCreationTime": "2025-04-15T08:20:10Z"
  }
}
```

## Creating and managing graph snapshots

To create and manage graph snapshots, use these commands:

* [.create graph snapshot](graph-snapshot-create.md): Create a new graph snapshot from an existing graph model
* [.drop graph snapshot](graph-snapshot-drop.md): Remove a graph snapshot from the database
* [.show graph snapshots](graph-snapshot-show.md): List available graph snapshots in the database

## Querying graph snapshots

Graph snapshots can be queried using the graph operators directly on the snapshot:

```kusto
.query graph snapshot <snapshot_name>
| graph-match (person)-[knows]->(friend)
  where person.age > 30
  project person.name, friend.name
```

For complex graph traversals and pattern matching, see [Graph operators](../../query/graph-operators.md).

## Benefits of using graph snapshots

* **Performance**: Avoid rebuilding the graph for each query
* **Consistency**: Ensure all queries operate on the same graph state
* **Historical analysis**: Keep snapshots from different time periods for comparison
* **Resource efficiency**: Reduce CPU and memory usage for repeated graph queries

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create graph snapshot](graph-snapshot-create.md)
* [.drop graph snapshot](graph-snapshot-drop.md)
* [.show graph snapshots](graph-snapshot-show.md)
* [Graph operators](../../query/graph-operators.md)