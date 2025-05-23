---
title: Persistent graphs in Kusto - Overview
description: This article provides an overview of persistent graphs in Kusto, explaining models, snapshots, and management concepts
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/23/2025
---

# Persistent graphs in Kusto (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Persistent graphs in Kusto provide a robust solution for storing, managing, and querying graph data structures. Unlike transient graphs created with the [make-graph](../../query/make-graph-operator.md) operator, persistent graphs are durable database objects that exist beyond individual query executions, enabling scalable graph analytics for enterprise scenarios.

## What are persistent graphs?

Persistent graphs in Kusto are implemented through two primary components:

1. **[Graph models](graph-model-overview.md)**: Database objects that define the structure and schema of a graph
2. **[Graph snapshots](graph-snapshot-overview.md)**: Materialized instances of graph models that can be queried

This two-tier architecture provides both flexibility in defining graph schemas and efficiency in querying graph data at scale.

### Key characteristics of persistent graphs

Persistent graphs offer several significant advantages for enterprise-scale graph analytics:

* **Durable storage**: Graph models and snapshots are stored in database metadata for consistent, long-term availability
* **Scalability**: Capable of handling large graphs that exceed single-node memory limitations
* **Reusability**: Multiple users and applications can query the same graph structure without reconstructing it
* **Performance optimization**: Eliminates graph construction overhead for repeated queries
* **Schema support**: Structured definitions for different node and edge types with their properties
* **Version control**: Multiple snapshots allow representation of graphs at different points in time

## Graph models

A graph model defines the specifications of a graph stored in the metadata of a Kusto database. It includes:

* **Schema definition**: Node and edge types with their properties
* **Data source mappings**: How to build the graph from tabular data
* **Labels**: Both static (predefined) and dynamic (generated at runtime) labels for nodes and edges

Graph models do not contain the actual graph data but provide the blueprint for creating graph snapshots.

### Managing graph models

The following commands are available for managing graph models:

| Command | Description |
|---------|-------------|
| [.create graph model](graph-model-create.md) | Creates a new graph model |
| [.create-or-alter graph model](graph-model-create-or-alter.md) | Creates a new graph model or alters an existing one |
| [.alter graph model](graph-model-alter.md) | Modifies an existing graph model |
| [.show graph model](graph-model-show.md) | Displays details of a specific graph model |
| [.show graph models](graph-models-show.md) | Lists all graph models in the database |
| [.drop graph model](graph-model-drop.md) | Removes a graph model |

## Graph snapshots

A graph snapshot is the actual graph instance materialized from a graph model. It represents:

* A specific time point's view of the data as defined by the model
* The nodes, edges, and their properties in a queryable format
* A self-contained entity that persists until explicitly removed

Snapshots are the entities that you query when working with persistent graphs.

### Managing graph snapshots

The following commands are available for managing graph snapshots:

| Command | Description |
|---------|-------------|
| [.make graph snapshot](graph-snapshot-make.md) | Creates a new graph snapshot from a graph model |
| [.show graph snapshot](graph-snapshot-show.md) | Displays details of a specific graph snapshot |
| [.show graph snapshots](graph-snapshots-show.md) | Lists all graph snapshots in the database |
| [.drop graph snapshot](graph-snapshot-drop.md) | Removes a single graph snapshot |
| [.drop graph snapshots](graph-snapshots-drop.md) | Removes multiple graph snapshots based on criteria |

## Workflow for persistent graphs

The typical workflow for creating and using persistent graphs involves:

1. **Create a graph model** - Define the structure and data sources for your graph
1. **Create a graph snapshot** - Materialize the graph model into a queryable snapshot
1. **Query the graph snapshot** - Use KQL graph operators to analyze the graph data
1. **Manage lifecycle** - Create new snapshots as needed and drop old ones

## Querying persistent graphs

Once a graph snapshot is created, it can be queried using the [`graph`](../../query/graph-operator.md) operator followed by other KQL graph operators:

```kusto
graph("MyGraphModel")
| graph-match (n)-[e]->(m)
| project n, e, m
```

To query a specific snapshot, provide the snapshot name:

```kusto
graph("MyGraphModel", "MyGraphSnapshot")
| graph-match (n)-[e]->(m)
| project n, e, m
```

The [`graph-match`](../../query/graph-match-operator.md) operator enables pattern matching and traversal operations, while [`graph-shortest-paths`](../../query/graph-shortest-paths-operator.md) helps find optimal connections between entities. The [`graph-to-table`](../../query/graph-to-table-operator.md) operator converts graph results back to tabular format.

## Limitations

For information about the current limitations of persistent graphs in Kusto, see [Graph persistent limitations](graph-persistent-limitations.md).

## Next steps

* [Graph model overview](graph-model-overview.md)
* [Graph snapshot overview](graph-snapshot-overview.md)
* [Graph operators in Kusto](../../query/graph-operators.md)
* [Graph best practices](../../query/graph-best-practices.md)
