---
title: Graph model in Kusto - Overview
description: This article describes the graph model feature in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# Graph model in Kusto (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The Graph model in Kusto allows you to define and manage persistent graph structures within your database. Unlike the transient graphs created using [graph operators](../../query/graph-operators.md), graph models are stored representations of graphs that can be queried repeatedly without rebuilding the graph for each query.

## What is a Graph model?

A Graph model is a database object that represents a directed property graph. It consists of nodes and edges, both of which can have properties that describe them. The model defines the schema of the graph (node and edge types with their properties) and the definition of how to build the graph from tabular data.

Key characteristics of Graph models in Kusto:

* **Persistence**: Graph models are persisted in the database, which removes the need to rebuild the graph for each query.
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

### 1. Schema

The Schema defines the structure of the nodes and edges in the graph:

* **Nodes**: Defines the types of nodes in the graph and their properties
* **Edges**: Defines the types of relationships between nodes and their properties

### 2. Definition

The Definition specifies how to build the graph from tabular data:

* **Steps**: A sequence of operations to add nodes and edges to the graph
  * **AddNodes**: Steps that define how to create nodes from tabular data
  * **AddEdges**: Steps that define how to create edges from tabular data

## Graph model definition example

```json
{
  "Schema": {
    "Nodes": {
      "Person": {"UserName": "string", "Name": "string", "age": "long"},
      "Employee": {"UserName": "string", "EmployeeNumber": "string"}
    },
    "Edges": {
      "Comments": {"UserName": "string", "Link": "string", "CreateTime": "datetime"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "external_table('nodes') | extend nodeId = strcat(key1, key2, … keyN)",
        "NodeIdColumn": "nodeId",
        "Labels": ["Person", "Employee"]
      },
      {
        "Kind": "AddEdges",
        "Query": "external_table('edges') | extend src = strcat(srcKey1, scrKey2, … srcKeyN), dst = strcat(dstKey1, dstKey2, … dstKeyN)",
        "SourceColumn": "src",
        "TargetColumn": "dst",
        "Labels": ["Comments"]
      }
    ]
  }
}
```

In this example:

* The **Schema** defines two node types (`Person` and `Employee`) and one edge type (`Comments`), each with their own properties.
* The **Definition** specifies how to construct the graph:
  * First step adds nodes from an external table, using a concatenation of keys to create a unique node identifier
  * Second step adds edges between these nodes, specifying source and destination columns

## Creating and managing Graph models

To create and manage Graph models, use the [.create graph model](graph-model-create.md) and [.alter graph model](graph-model-alter.md) commands. To remove a Graph model, use the [.drop graph model](graph-model-drop.md) command.

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