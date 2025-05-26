---
title: labels() (graph function in Preview)
description: Learn how to use the labels() function to filter nodes and edges based on their labels or project label information in graph queries.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 05/26/2025
---
# labels() (graph function in Preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `labels()` graph function retrieves the labels associated with nodes or edges in a graph. It can be used both for filtering elements based on their labels and for projecting label information in query results.

Labels are defined within [Graph models](../management/graph/graph-model-overview.md) and can be either static (fixed labels assigned to node or edge types) or dynamic (labels derived from data properties during graph construction). The `labels()` function accesses these predefined labels to enable efficient filtering and analysis of graph elements.

> [!NOTE]
> This function is used with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

> [!IMPORTANT]
> When the `labels()` function is used on a graph created with the `make-graph` operator (that is, a transient graph rather than a persistent graph model), it always returns an empty array (of dynamic data type) for all nodes and edges, because transient graphs do not have label metadata.

## Syntax

`labels([element])`

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *element* | `string` |  | The reference to a graph node or edge variable in a graph pattern.</br>Don't pass any parameters when used inside [all()](all-graph-function.md), [any()](any-graph-function.md), and [map()](map-graph-function.md) graph functions, with [inner_nodes()](inner-nodes-graph-function.md) or [inner_edges()](inner-edges-graph-function.md). For more information, see [Graph pattern notation](graph-match-operator.md#graph-pattern-notation). |

## Returns

Returns a dynamic array containing the labels associated with the specified node or edge. For nodes and edges without labels, returns an empty array.

When used inside [all()](all-graph-function.md), [any()](any-graph-function.md), or [map()](map-graph-function.md) with [inner_nodes()](inner-nodes-graph-function.md) or [inner_edges()](inner-edges-graph-function.md), call `labels()` without parameters to return the labels for all inner nodes or edges, respectively.

## Label sources

Labels are defined in [Graph models](../management/graph/graph-model-overview.md) and can originate from two sources:

- **Static labels**: Fixed labels assigned to specific node or edge types during graph model definition. These labels remain constant for all instances of a particular type.
- **Dynamic labels**: Labels derived from data properties during graph construction. These labels can vary based on the actual data values and computed expressions.

The `labels()` function retrieves both static and dynamic labels that have been associated with graph elements through the graph model schema and definition.

## Examples

### Filter nodes by labels

The following example shows how to use the `labels()` function to filter nodes based on their assigned labels. The example includes the full graph model definition to clarify how static and dynamic labels are assigned.

#### Graph model definition

```json
{
  "Schema": {
    "Nodes": {
      "Application": {"AppName": "string", "Type": "string"},
      "Process": {"ProcessName": "string"}
    },
    "Edges": {
      "CONNECTS_TO": {}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "Applications | project AppId, AppName, Type, NodeLabels",
        "NodeIdColumn": "AppId",
        "Labels": ["Application"],
        "LabelsColumn": "NodeLabels"
      },
      {
        "Kind": "AddNodes",
        "Query": "Processes | project ProcId, ProcessName",
        "NodeIdColumn": "ProcId",
        "Labels": ["Process"]
      },
      {
        "Kind": "AddEdges",
        "Query": "AppConnections | project SourceAppId, TargetProcId",
        "SourceColumn": "SourceAppId",
        "TargetColumn": "TargetProcId",
        "Labels": ["CONNECTS_TO"]
      }
    ]
  }
}
```

#### Query example

```kusto
graph('AppProcessGraph')
| graph-match cycles=none (app)-[e*1..3]->(process)
    where process.ProcessName contains "nginx" and labels(app) has "Application"
    project app=app.AppName
| summarize c=count() by app
| top 10 by c desc
```

**Output**

| app | c |
|---|---|
| WebApp1 | 15 |
| WebApp2 | 12 |
| APIService | 8 |

### Project labels in results

The following example demonstrates how to use the `labels()` function in the project clause to include label information in the query results. This query finds connections between different types of network components and includes their labels for analysis.

#### Graph model definition

```json
{
  "Schema": {
    "Nodes": {
      "NetworkComponent": {"ComponentName": "string", "ComponentType": "string"}
    },
    "Edges": {
      "CONNECTED_TO": {"ConnectionType": "string"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "NetworkComponentsTable | project Id, ComponentName, ComponentType, NodeLabels",
        "NodeIdColumn": "Id",
        "Labels": ["NetworkComponent"],
        "LabelsColumn": "NodeLabels"
      },
      {
        "Kind": "AddEdges",
        "Query": "ConnectionsTable | project SourceId, TargetId, ConnectionType, EdgeLabels",
        "SourceColumn": "SourceId",
        "TargetColumn": "TargetId",
        "Labels": ["CONNECTED_TO"],
        "LabelsColumn": "EdgeLabels"
      }
    ]
  }
}
```

#### Query example

```kusto
graph('NetworkGraph')
| graph-match (source)-[conn]->(target)
    where labels(source) has "Network" and labels(target) has "Compute"
    project 
        SourceComponent = source.ComponentName,
        TargetComponent = target.ComponentName,
        SourceLabels = labels(source),
        TargetLabels = labels(target),
        ConnectionType = conn.ConnectionType
```

**Output**

| SourceComponent | TargetComponent | SourceLabels | TargetLabels | ConnectionType |
|---|---|---|---|---|
| Switch1 | Server1 | ["Network", "Access"] | ["Compute", "Production"] | Ethernet |

### Filter by multiple label conditions

The following example shows how to combine multiple label conditions to find complex patterns in a network topology. This query identifies paths from frontend components to backend components through middleware layers.

#### Graph model definition

```json
{
  "Schema": {
    "Nodes": {
      "Frontend": {"ComponentName": "string"},
      "Middleware": {"ComponentName": "string"},
      "Backend": {"ComponentName": "string"}
    },
    "Edges": {
      "DEPENDS_ON": {"DependencyType": "string"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "ComponentsTable | project Id, ComponentName, NodeLabels",
        "NodeIdColumn": "Id",
        "LabelsColumn": "NodeLabels"
      },
      {
        "Kind": "AddEdges",
        "Query": "DependenciesTable | project SourceId, TargetId, DependencyType, EdgeLabels",
        "SourceColumn": "SourceId",
        "TargetColumn": "TargetId",
        "Labels": ["DEPENDS_ON"],
        "LabelsColumn": "EdgeLabels"
      }
    ]
  }
}
```

#### Query example

```kusto
graph('AppComponentGraph')
| graph-match (frontend)-[dep1]->(middleware)-[dep2]->(backend)
    where labels(frontend) has "Frontend" 
          and labels(middleware) has "Middleware" 
          and labels(backend) has "Backend"
    project 
        Path = strcat(frontend.ComponentName, " -> ", middleware.ComponentName, " -> ", backend.ComponentName),
        FrontendLabels = labels(frontend),
        MiddlewareLabels = labels(middleware),
        BackendLabels = labels(backend)
```

**Output**

| Path | FrontendLabels | MiddlewareLabels | BackendLabels |
|---|---|---|---|
| WebUI -> APIGateway -> Database | ["Frontend", "UserInterface"] | ["Middleware", "API"] | ["Backend", "Storage"] |
| WebUI -> APIGateway -> Cache | ["Frontend", "UserInterface"] | ["Middleware", "API"] | ["Backend", "Cache"] |

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-shortest-paths operator](graph-shortest-paths-operator.md)
* [Graph models overview](../management/graph/graph-model-overview?view=azure-data-explorer&preserve-view=true)
