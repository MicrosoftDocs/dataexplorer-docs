---
title: Graph model in Kusto - Overview
description: This article describes the graph model feature in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# Graph model in Kusto (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The Graph model in Kusto allows you to define and manage persistent graph structures within your database. Unlike the transient graphs created using the [make-graph](../../query/make-graph-operator.md) operator, graph models are stored representations of graphs that can be queried repeatedly without rebuilding the graph for each query.

## What is a Graph model?

A Graph model is a database object that represents a labelled property graph (LPG). It consists of nodes and edges, both of which can have properties that describe them. The model defines the schema of the graph (node and edge types with their properties) and the definition of how to build the graph from tabular data.

Key characteristics of Graph models in Kusto:

* **Metadata persistence**: Graph models are specifications of graphs stored in the metadata of a Kusto database.
* **Snapshots**: Model snapshots remove the need to rebuild the graph for each query, improving performance.
* **Schema definition**: Graph models have a defined schema for nodes and edges, ensuring data consistency.
* **Integration with KQL**: Graph models can be queried using the existing Kusto Query Language graph semantics.
* **Efficient querying**: Graph models optimize graph traversal operations, making complex pattern matching queries more efficient.

## When to use Graph models

Use Graph models when:

* You repeatedly run graph queries on the same underlying data
* You have complex relationship data that would benefit from a graph representation
* Your graph structure is relatively stable, with periodic updates
* You need to perform complex traversals, path finding, or pattern matching on your data

## Graph model components

A Graph model consists of two main components:

### 1. Schema (optional)

The Schema defines the structure of the nodes and edges in the graph:

* **Nodes**: Defines the types of nodes in the graph and their properties
* **Edges**: Defines the types of relationships between nodes and their properties

### 2. Definition

The Definition specifies how to build the graph from tabular data:

* **Steps**: A sequence of operations to add nodes and edges to the graph
  * **AddNodes**: Steps that define how to create nodes from tabular data
  * **AddEdges**: Steps that define how to create edges from tabular data

## Labels in Graph models

Labels are used to identify and categorize nodes and edges in the graph. Graph models support two types of labels:

### Static labels

* Defined explicitly in the Schema section of the graph model
* Represent node or edge types with predefined properties
* Provide a consistent schema for the graph elements
* Referenced in the "Labels" array in AddNodes and AddEdges steps

### Dynamic labels

* Not predefined in the Schema section
* Generated at runtime from data in the underlying tables
* Specified using "LabelsColumn" in the AddNodes or AddEdges steps
* Can be a single label (string column) or multiple labels (dynamic array column)
* Allow for more flexible graph structures that adapt to your data

## Definition steps in detail

The Definition section of a graph model contains steps that define how to construct the graph from tabular data. Each step has specific parameters depending on its kind.

### AddNodes steps

AddNodes steps define how to create nodes in the graph from tabular data:

| Parameter | Required | Description |
|-----------|----------|-------------|
| Kind | Yes | Must be set to "AddNodes" |
| Query | Yes | A KQL query that retrieves the data for nodes. The query result must include all columns required for node properties and identifiers |
| NodeIdColumn | Yes | The column from the query result that will be used as the unique identifier for each node |
| Labels | No | An array of static label names defined in the Schema section to apply to these nodes |
| LabelsColumn | No | A column from the query result that provides dynamic labels for each node. Can be a string column (single label) or dynamic array column (multiple labels) |

### AddEdges steps

AddEdges steps define how to create relationships between nodes in the graph:

| Parameter | Required | Description |
|-----------|----------|-------------|
| Kind | Yes | Must be set to "AddEdges" |
| Query | Yes | A KQL query that retrieves the data for edges. The query result must include source and target node identifiers and any edge properties |
| SourceColumn | Yes | The column from the query result that contains the source node identifiers |
| TargetColumn | Yes | The column from the query result that contains the target node identifiers |
| Labels | No | An array of static label names defined in the Schema section to apply to these edges |
| LabelsColumn | No | A column from the query result that provides dynamic labels for each edge. Can be a string column (single label) or dynamic array column (multiple labels) |

### Example with both static and dynamic labels

```json
{
  "Schema": {
    "Nodes": {
      "Person": {"Name": "string", "Age": "long"},
      "Company": {"Name": "string", "Industry": "string"}
    },
    "Edges": {
      "WORKS_AT": {"StartDate": "datetime", "Position": "string"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "Employees | project Id, Name, Age, NodeType",
        "NodeIdColumn": "Id",
        "Labels": ["Person"],
        "LabelsColumn": "NodeType"
      },
      {
        "Kind": "AddEdges",
        "Query": "EmploymentRecords | project EmployeeId, CompanyId, StartDate, Position, RelationType",
        "SourceColumn": "EmployeeId",
        "TargetColumn": "CompanyId",
        "Labels": ["WORKS_AT"],
        "LabelsColumn": "RelationType"
      }
    ]
  }
}
```

## Creating and managing Graph models

To create and manage Graph models, use the [.create graph model](graph-model-create.md) and [.alter graph model](graph-model-alter.md) commands. To remove a Graph model, use the [.drop graph model](graph-model-drop.md) command.

## Graph snapshots

Graph snapshots are database entities that represent instances of graph models at specific points in time. While a graph model defines the structure and data sources for a graph, a snapshot is the actual materialized graph that can be queried.

Key aspects of graph snapshots:

* Each snapshot is linked to a specific graph model
* A single graph model can have multiple snapshots associated with it
* Snapshots are created with the `.create graph snapshot` command
* Snapshots include metadata such as creation time and the source graph model
* Snapshots enable querying the graph as it existed at a specific point in time

For more detailed information about working with graph snapshots, see [Graph snapshots in Kusto](graph-snapshot-overview.md).

## Querying Graph models

Graph models can be queried using the same graph operators as transient graphs, but without the need to construct the graph first:

```kusto
.query graph <graph_model_name>
| graph-match (person)-[comments]->(employee)
  where person.age > 30 and comments.CreateTime > ago(7d)
  project person.Name, employee.UserName
```

## Related content

* [.create graph model](graph-model-create.md)
* [.alter graph model](graph-model-alter.md)
* [.drop graph model](graph-model-drop.md)
* [.show graph models](graph-model-show.md)
* [Graph model limitations](graph-model-limitations.md)
* [Graph model policies](graph-model-policies.md)
* [Graph operators](../../query/graph-operators.md)
* [Graph best practices](../../query/graph-best-practices.md)