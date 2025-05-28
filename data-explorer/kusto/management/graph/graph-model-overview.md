---
title: Graph models in Azure Data Explorer - Overview and usage
description: Learn how to define, manage, and query persistent graph structures in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# Graph models overview (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Graph models in Azure Data Explorer enable you to define, manage, and efficiently query persistent graph structures within your database. Unlike transient graphs created using the [make-graph](../../query/make-graph-operator.md) operator, graph models are stored representations that can be queried repeatedly without rebuilding the graph for each query, significantly improving performance for complex relationship-based analysis.

## Overview

A graph model is a database object that represents a labeled property graph (LPG) within Azure Data Explorer. It consists of nodes (vertices) and edges (relationships), both of which can have properties that describe them. The model defines both the schema of the graph (node and edge types with their properties) and the process for constructing the graph from tabular data stored in Kusto tables.

## Key characteristics

Graph models in Kusto offer:

- **Metadata persistence**: Store graph specifications in database metadata for durability and reusability
- **Materialized snapshots**: Eliminate the need to rebuild graphs for each query, dramatically improving query performance
- **Schema definition**: Support optional but recommended defined schemas for nodes and edges, ensuring data consistency
- **Deep KQL integration**: Seamlessly integrate with Kusto Query Language (KQL) graph semantics
- **Optimized traversals**: Include specialized indexing for efficient graph traversal operations, making complex pattern matching and path-finding queries significantly faster

## When to use graph models

Graph models provide significant advantages for relationship-based analysis but require additional setup compared to ad-hoc graph queries. Consider using graph models when:

- **Performance is critical**: You repeatedly run graph queries on the same underlying data and need optimized performance
- **Complex relationship data**: You have data with many interconnected relationships that benefit from a graph representation
- **Stable structure**: Your graph structure is relatively stable, with periodic but not constant updates
- **Advanced graph operations**: You need to perform complex traversals, path finding, pattern matching, or community detection on your data
- **Consistent schema**: Your graph analysis requires a well-defined structure with consistent node and edge types

For simpler, one-time graph analysis on smaller datasets, the [make-graph](../../query/make-graph-operator.md) operator might be more appropriate.

## Graph model components

A graph model consists of two main components:

### Schema (optional)

The schema defines the structure of the nodes and edges in the graph:

- **Nodes**: Defines the types of nodes in the graph and their properties
- **Edges**: Defines the types of relationships between nodes and their properties

### Definition

The Definition specifies how to build the graph from tabular data:

* **Steps**: A sequence of operations to add nodes and edges to the graph
  * **AddNodes**: Steps that define how to create nodes from tabular data
  * **AddEdges**: Steps that define how to create edges from tabular data

## Labels in Graph models

Labels are critical identifiers that categorize nodes and edges in the graph, enabling efficient filtering and pattern matching. Azure Data Explorer graph models support two complementary types of labels:

### Static labels

* Defined explicitly in the Schema section of the graph model
* Represent node or edge types with predefined properties
* Provide a consistent schema for the graph elements
* Referenced in the "Labels" array in AddNodes and AddEdges steps
* Ideal for well-known, stable entity and relationship types

### Dynamic labels

* Not predefined in the Schema section
* Generated at runtime from data in the underlying tables
* Specified using "LabelsColumn" in the AddNodes or AddEdges steps
* Can be a single label (string column) or multiple labels (dynamic array column)
* Allow for more flexible graph structures that adapt to your data
* Useful for systems where node/edge types evolve over time

> [!TIP]
> You can combine static and dynamic labels to get the benefits of both approaches: schema validation for core entity types while maintaining flexibility for evolving classifications.

## Definition steps in detail

The Definition section of a graph model contains steps that define how to construct the graph from tabular data. Each step has specific parameters depending on its kind.

### AddNodes steps

AddNodes steps define how to create nodes in the graph from tabular data:

| Parameter | Required | Description |
|-----------|----------|-------------|
| Kind | Yes | Must be set to "AddNodes" |
| Query | Yes | A KQL query that retrieves the data for nodes. The query result must include all columns required for node properties and identifiers |
| NodeIdColumn | Yes | The column from the query result used as the unique identifier for each node |
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

## Graph model examples

### Basic example with both static and dynamic labels

The following example creates a professional network graph model that combines static schema definitions with dynamic labeling:

````kusto
.create-or-alter graph_model ProfessionalNetwork ```
{
  "Schema": {
    "Nodes": {
      "Person": {"Name": "string", "Age": "long", "Title": "string"},
      "Company": {"Name": "string", "Industry": "string", "FoundedYear": "int"}
    },
    "Edges": {
      "WORKS_AT": {"StartDate": "datetime", "Position": "string", "Department": "string"},
      "KNOWS": {"ConnectionDate": "datetime", "ConnectionStrength": "int"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "Employees | project Id, Name, Age, Title, NodeType",
        "NodeIdColumn": "Id",
        "Labels": ["Person"],
        "LabelsColumn": "NodeType"
      },
      {
        "Kind": "AddNodes",
        "Query": "Organizations | project Id, Name, Industry, FoundedYear",
        "NodeIdColumn": "Id",
        "Labels": ["Company"]
      },
      {
        "Kind": "AddEdges",
        "Query": "EmploymentRecords | project EmployeeId, CompanyId, StartDate, Position, Department",
        "SourceColumn": "EmployeeId",
        "TargetColumn": "CompanyId",
        "Labels": ["WORKS_AT"]
      },
      {
        "Kind": "AddEdges",
        "Query": "Connections | project PersonA, PersonB, ConnectionDate, ConnectionType, ConnectionStrength",
        "SourceColumn": "PersonA",
        "TargetColumn": "PersonB",
        "Labels": ["KNOWS"],
        "LabelsColumn": "ConnectionType"
      }
    ]
  }
}
```
````

This model would enable queries such as finding colleagues connected through multiple degrees of separation, identifying people working in the same industry, or analyzing organizational relationships.

## Creating and managing Graph models

Azure Data Explorer provides a comprehensive set of management commands for working with graph models throughout their lifecycle.

### Command summary

| Command | Purpose | Key parameters |
|---------|---------|---------------|
| [.create-or-alter graph_model](graph-model-create-or-alter.md) | Create a new graph model or modify an existing one | Database, Name, Schema, Definition |
| [.drop graph_model](graph-model-drop.md) | Remove a graph model | Database, Name |
| [.show graph_models](graph-model-show.md) | List available graph models | Database [optional] |

### Graph model lifecycle

A typical workflow for managing graph models involves:

1. **Development** - Create an initial graph model with a schema and definition that maps to your data
2. **Validation** - Query the model to verify correct structure and expected results
3. **Maintenance** - Periodically update the model as your data structure evolves
4. **Snapshot management** - Create and retire snapshots to balance performance and freshness

> [!TIP]
> When starting with graph models, begin with a small subset of your data to validate your design before scaling to larger datasets.

## Graph snapshots

Graph snapshots are database entities that represent instances of graph models at specific points in time. While a graph model defines the structure and data sources for a graph, a snapshot is the actual materialized graph that can be queried.

Key aspects of graph snapshots:

* Each snapshot is linked to a specific graph model
* A single graph model can have multiple snapshots associated with it
* Snapshots are created with the `.make graph_snapshot` command
* Snapshots include metadata such as creation time and the source graph model
* Snapshots enable querying the graph as it existed at a specific point in time

For more detailed information about working with graph snapshots, see [Graph snapshots in Kusto](graph-snapshot-overview.md).

## Querying Graph models

Graph models are queried using the `graph()` function, which provides access to the graph entity. This function supports retrieving either the most recent snapshot of the graph or creating the graph at query time if snapshots aren't available.

### Basic query structure

```kusto
graph("GraphModelName")
| graph-match <pattern>
    where <filters>
    project <output fields>
```

### Query examples

#### 1. Basic node-edge-node pattern

```kusto
// Find people who commented on posts by employees in the last week
graph("SocialNetwork") 
| graph-match (person)-[comments]->(post)<-[authored]-(employee)
    where person.age > 30 
      and comments.createTime > ago(7d)
    project person.name, post.title, employee.userName
```

#### 2. Multiple relationship patterns

```kusto
// Find people who both work with and are friends with each other
graph("ProfessionalNetwork") 
| graph-match (p1:Person)-[:WORKS_WITH]->(p2:Person)-[:FRIENDS_WITH]->(p1)
    project p1.name, p2.name, p1.department
```

#### 3. Variable-length paths

```kusto
// Find potential influence paths up to 3 hops away
graph("InfluenceNetwork") 
| graph-match (influencer)-[:INFLUENCES*1..3]->(target)
    where influencer.id == "user123"
    project influencePath = INFLUENCES, 
         pathLength = array_length(INFLUENCES), 
         target.name
```

The `graph()` function provides a consistent way to access graph data without needing to explicitly construct the graph for each query.

> [!NOTE]
> See [Graph operators](../../query/graph-operators.md) for the complete reference on graph query syntax and capabilities.

## Frequently Asked Questions

### Who is responsible for refreshing the graph?

Users or processes must refresh the graph themselves. Initially, no automatic refresh policies exist for new graph entities. However, the graph remains queryable even if the snapshot is being created or has not yet been created yet.

### How can a graph be refreshed?

To refresh a graph:

1. Create a new snapshot using an asynchronous operation (`.make graph_snapshot`)
1. Once created, incoming graph queries automatically use the new snapshot
1. Optional: Drop the old snapshot to free up resources (`.drop graph_snapshot`)

### What if different steps create duplicate edges or nodes?

- **Edges**: Duplicates remain as duplicates by default (edges don't have unique identifiers)
- **Nodes**: "Duplicates" are merged - the system assumes they represent the same entity. If there are conflicting property values, the last value processed takes precedence

### How do graph models handle schema changes?

When the schema of your underlying data changes:

1. Alter your graph model using the `.create-or-alter graph_model` command to update its schema or definition
1. To materialize these changes, create a new snapshot
1. Older snapshots remain accessible until explicitly dropped

### Can I query across multiple graph models?

Yes, you can query multiple graph models within a single query using composition:

- Use the output of one `graph()` operator as input to another `graph()` operator
- Process and transform results from one graph before feeding into another graph query
- Chain multiple graph operations for cross-domain analysis without creating a unified model

Example:

```kusto
// Query the first graph model
graph("EmployeeNetwork") 
| graph-match (person:Employee)-[:MANAGES]->(team)
| project manager=person.name, teamId=team.id
// Use these results to query another graph model
| join (
	graph("ProjectNetwork")
	| graph-match (project)-[:ASSIGNED_TO]->(team)
	| project projectName=project.name, teamId=team.id
) on teamId
```

### What's the difference between labels and properties?

- **Labels**: Categorize nodes and edges for structural pattern matching
- **Properties**: Store data values associated with nodes and edges (used in filtering and output)

## Related content

* [.create-or-alter graph_model](graph-model-create-or-alter.md)
* [.drop graph_model](graph-model-drop.md)
* [.show graph_models](graph-model-show.md)
* [Key considerations](graph-persistent-overview.md#key-considerations)
* [Graph operators](../../query/graph-operators.md)
* [Graph best practices](../../query/graph-best-practices.md)
