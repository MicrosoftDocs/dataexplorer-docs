---
title: labels() (graph function)
description: Learn how to use the labels() function to retrieve, filter, and project label information for nodes and edges in graph queries.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 10/23/2025
---
# labels()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Retrieves the labels associated with nodes or edges in a graph query. Use this function to filter graph elements by their labels or to include label information in query results.

Labels are defined in [graph models](../management/graph/graph-model-overview.md) and can be either static (fixed labels assigned to node or edge types) or dynamic (labels derived from data properties during graph construction).

> [!NOTE]
> Use this function with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

> [!IMPORTANT]
> The `labels()` function only works with [graph models](../management/graph/graph-model-overview.md). When called on a graph created with the `make-graph` operator, it always returns an empty array because transient graphs don't have label metadata.

## Syntax

`labels(` *element* `)`

`labels()` <!-- When used with all(), any(), map(), or inner_nodes() -->

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *element* | `string` | :heavy_check_mark: | A node or edge variable reference from a graph pattern. Omit this parameter when using `labels()` inside [all()](all-graph-function.md), [any()](any-graph-function.md), or [map()](map-graph-function.md) graph functions with [inner_nodes()](inner-nodes-graph-function.md). For more information, see [Graph pattern notation](graph-match-operator.md#graph-pattern-notation). |

## Returns

Returns a dynamic array of strings containing the labels associated with the specified node or edge. Returns an empty array for elements without labels or when used with graphs created created with the `make-graph` operator.

When called without parameters inside [all()](all-graph-function.md), [any()](any-graph-function.md), or [map()](map-graph-function.md) with [inner_nodes()](inner-nodes-graph-function.md), returns the labels for each inner node or edge in the path.

## Label types

The `labels()` function retrieves both static and dynamic labels defined in the graph model. For detailed information about static and dynamic labels, including when to use each type, see [Labels in Graph models](../management/graph/graph-model-overview.md#labels-in-graph-models).

## Examples

### Example 1: Filter nodes by labels

This example demonstrates filtering nodes based on their labels to find applications connected to nginx processes.

**Graph model definition**

````kusto
.create-or-alter graph_model AppProcessGraph ```
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
````

**Query**

```kusto
graph('AppProcessGraph')
| graph-match cycles=none (app)-[e*1..3]->(process)
    where process.ProcessName contains "nginx" 
          and labels(app) has "Application"
    project app = app.AppName
| summarize c = count() by app
| top 10 by c desc
```

**Output**

| app | c |
|---|---|
| WebApp1 | 15 |
| WebApp2 | 12 |
| APIService | 8 |

This query uses `labels(app) has "Application"` to filter only nodes with the "Application" label, then counts connections to nginx processes.

### Example 2: Project labels in results

This example shows how to include label information in query results when analyzing network connections.

**Graph model definition**

````kusto
.create-or-alter graph_model NetworkGraph ```
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
````

**Query**

```kusto
graph('NetworkGraph')
| graph-match (source)-[conn]->(target)
    where labels(source) has "Network" 
          and labels(target) has "Compute"
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

This query projects the labels using `labels(source)` and `labels(target)` to show both the component names and their associated labels in the results.

### Example 3: Filter by multiple label conditions

This example demonstrates using multiple label conditions to identify multi-tier application paths from frontend through middleware to backend components.

**Graph model definition**

````kusto
.create-or-alter graph_model AppComponentGraph ```
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
````

**Query**

```kusto
graph('AppComponentGraph')
| graph-match (frontend)-[dep1]->(middleware)-[dep2]->(backend)
    where labels(frontend) has "Frontend" 
          and labels(middleware) has "Middleware" 
          and labels(backend) has "Backend"
    project 
        Path = strcat(
            frontend.ComponentName, " -> ", 
            middleware.ComponentName, " -> ", 
            backend.ComponentName
        ),
        FrontendLabels = labels(frontend),
        MiddlewareLabels = labels(middleware),
        BackendLabels = labels(backend)
```

**Output**

| Path | FrontendLabels | MiddlewareLabels | BackendLabels |
|---|---|---|---|
| WebUI -> APIGateway -> Database | ["Frontend", "UserInterface"] | ["Middleware", "API"] | ["Backend", "Storage"] |
| WebUI -> APIGateway -> Cache | ["Frontend", "UserInterface"] | ["Middleware", "API"] | ["Backend", "Cache"] |

This query chains multiple label conditions with `and` operators to ensure each component in the path has the correct tier label.

### Example 4: Use labels() with collection functions

This example shows how to use `labels()` without parameters inside `all()` and `any()` functions when working with variable-length paths. The query finds service mesh paths where all intermediate services are in production and at least one is critical.

**Graph model definition**

````kusto
.create-or-alter graph_model ServiceMeshGraph ```
{
  "Schema": {
    "Nodes": {
      "Service": {"ServiceName": "string", "Environment": "string"}
    },
    "Edges": {
      "CALLS": {"Protocol": "string"}
    }
  },
  "Definition": {
    "Steps": [
      {
        "Kind": "AddNodes",
        "Query": "ServicesTable | project Id, ServiceName, Environment, NodeLabels",
        "NodeIdColumn": "Id",
        "Labels": ["Service"],
        "LabelsColumn": "NodeLabels"
      },
      {
        "Kind": "AddEdges",
        "Query": "ServiceCallsTable | project SourceId, TargetId, Protocol, EdgeLabels",
        "SourceColumn": "SourceId",
        "TargetColumn": "TargetId",
        "Labels": ["CALLS"],
        "LabelsColumn": "EdgeLabels"
      }
    ]
  }
}
```
````

**Query**

```kusto
graph('ServiceMeshGraph')
| graph-match (source)-[calls*2..4]->(destination)
    where source.ServiceName == "UserService" 
          and destination.ServiceName == "DatabaseService" 
          and all(inner_nodes(calls), labels() has "Production") 
          and any(inner_nodes(calls), labels() has "Critical")
    project 
        Path = strcat_array(
            map(inner_nodes(calls), ServiceName), 
            " -> "
        ),
        IntermediateLabels = map(inner_nodes(calls), labels()),
        CallProtocols = map(calls, Protocol)
```

**Output**

| Path | IntermediateLabels | CallProtocols |
|---|---|---|
| AuthService -> PaymentService | [["Production", "Auth"], ["Production", "Critical", "Payment"]] | ["HTTPS", "gRPC"] |
| CacheService -> PaymentService | [["Production", "Cache"], ["Production", "Critical", "Payment"]] | ["Redis", "gRPC"] |

In this query, `labels()` is called without parameters inside `all()` and `any()` functions. This syntax automatically applies to each inner node in the variable-length path.

## Related content

- [Graph operators](graph-operators.md)
- [graph-match operator](graph-match-operator.md)
- [graph-shortest-paths operator](graph-shortest-paths-operator.md)
- [Graph models overview](../management/graph/graph-model-overview.md)
- [all() graph function](all-graph-function.md)
- [any() graph function](any-graph-function.md)
- [map() graph function](map-graph-function.md)
- [inner_nodes() graph function](inner-nodes-graph-function.md)
