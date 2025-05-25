---
title: Graph snapshots in Kusto - Overview
description: Learn about graph snapshots in Kusto, including their structure, benefits, and how to create and query them for efficient graph data analysis.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# Graph snapshots in Kusto (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

A graph snapshot is a database entity that represents a materialized instance of a graph model at a specific point in time. While a [graph model](graph-model-overview.md) defines the structure and data sources, a snapshot is the queryable graph implementation.

## Overview

Graph snapshots provide:

- **Model linkage**: Connected to a specific graph model
- **Point-in-time materialization**: Represents the graph state at creation time
- **Persistence**: Stored in the database until explicitly dropped
- **Direct querying**: Enables queries without rebuilding the graph
- **Metadata storage**: Contains creation time and model information

Multiple snapshots from the same graph model enable historical analysis and temporal comparison of graph data.

## Graph snapshot structure

Each graph snapshot contains two primary components:

### Metadata

- **Name**: Unique snapshot identifier
- **SnapshotTime**: Creation timestamp
- **Model information**:
  - **ModelName**: Source graph model name
  - **ModelVersion**: Model version at snapshot creation
  - **ModelCreationTime**: Source model creation timestamp

### Graph data

- **Nodes**: Materialized nodes from the model's `AddNodes` operations
- **Edges**: Materialized relationships from the model's `AddEdges` operations
- **Properties**: Node and edge properties as defined in the model

## Example snapshot configuration

```json
{
  "Metadata": {
    "Name": "UserInteractionsSnapshot",
    "SnapshotTime": "2025-04-28T10:15:30Z"
  },
  "ModelInformation": {
    "ModelName": "SocialNetworkGraph",
    "ModelVersion": "v1.2",
    "ModelCreationTime": "2025-04-15T08:20:10Z"
  }
}
```

## Management commands

Use these commands to manage graph snapshots:

| Command | Purpose |
|---------|---------|
| [.create graph snapshot](graph-snapshot-create.md) | Create a snapshot from an existing graph model |
| [.drop graph snapshot](graph-snapshot-drop.md) | Remove a snapshot from the database |
| [.show graph snapshots](graph-snapshot-show.md) | List available snapshots in the database |

## Querying snapshots

Query graph snapshots using the `graph()` function:

### Query the latest snapshot

```kusto
graph("SocialNetworkGraph") 
| graph-match (person)-[knows]->(friend)
  where person.age > 30
  project person.name, friend.name
```

### Query a specific snapshot

```kusto
graph("SocialNetworkGraph", "UserInteractionsSnapshot") 
| graph-match (person)-[knows]->(friend)
  where person.age > 30
  project person.name, friend.name
```

For advanced pattern matching and traversals, see [Graph operators](../../query/graph-operators.md).

## Key benefits

Graph snapshots provide:

* **Enhanced performance**: Eliminates graph rebuilding for each query
* **Data consistency**: Ensures all queries operate on identical graph state
* **Temporal analysis**: Enables historical comparison across time periods
* **Resource optimization**: Reduces CPU and memory consumption for repeated operations

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create graph snapshot](graph-snapshot-create.md)
* [.drop graph snapshot](graph-snapshot-drop.md)
* [.show graph snapshots](graph-snapshot-show.md)
* [Graph operators](../../query/graph-operators.md)
