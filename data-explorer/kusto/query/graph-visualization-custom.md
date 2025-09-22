---
title: Graph visualization with Plotly
description: Learn how to create interactive graph visualizations using Plotly and Python for dashboards and web applications.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 08/27/2025
---

# Graph visualization with Plotly

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Plotly-based graph visualization uses Python and the Plotly library to create interactive web-based graph visualizations. These visualizations can be embedded in dashboards, shared in web applications, and customized extensively for your specific needs.

## Prerequisites

- Python plugin enabled on your cluster
- Access to the [`plotly_graph_fl()`](../functions-library/plotly-graph-fl.md) function
- Basic knowledge of KQL and Python (optional for customization)

## Overview

The Plotly-based approach offers several advantages:

- **Dashboard integration**: Compatible with Azure Data Explorer dashboards and Real-Time Intelligence dashboards
- **Web-based sharing**: Visualizations work in web browsers without additional software
- **Customization**: Full control over appearance, colors, and interactions
- **Interactivity**: Hover tooltips, zooming, and panning capabilities

## Using plotly_graph_fl() function

The primary method for creating Plotly graph visualizations is the [`plotly_graph_fl()`](../functions-library/plotly-graph-fl.md) function.

### Basic syntax

```kusto
plotly_graph_fl(edges, nodes, 
                [node_id_column], 
                [source_id_column], 
                [target_id_column], 
                [colorscale_id], 
                [diagram_title])
```

### Simple example

```kusto
let nodes = datatable (nodeId:string, nodeType:string, importance:int)[
    'A', 'server', 5,
    'B', 'database', 3,
    'C', 'workstation', 1,
    'D', 'router', 4,
    'E', 'firewall', 5,
    'F', 'workstation', 1
];
let edges = datatable (sourceId:string, targetId:string, connectionType:string)[
    'A', 'B', 'sql',
    'A', 'D', 'network',
    'B', 'C', 'query',
    'C', 'D', 'network',
    'D', 'E', 'security',
    'E', 'F', 'network'
];
plotly_graph_fl(edges, nodes, 
                node_id_column="nodeId", 
                source_id_column="sourceId", 
                target_id_column="targetId",
                colorscale_id="Viridis",
                diagram_title="Network Infrastructure Graph")
| render plotly
```

### Working with existing graphs

You can also visualize persisted graphs by converting them to tabular format:

```kusto
let G = graph('Simple');
let E = G
    | graph-to-table edges with_source_id=sourceId with_target_id=targetId;
let V = G
    | graph-to-table nodes with_node_id=nodeId;
plotly_graph_fl(E, V, 
                node_id_column="nodeId", 
                source_id_column="sourceId", 
                target_id_column="targetId", 
                diagram_title="Simple Graph Visualization")
| render plotly
```

## Customization options

### Color schemes

The `colorscale_id` parameter accepts various Plotly color scales:

- **Sequential**: "Viridis", "Plasma", "Inferno", "Magma", "Cividis"
- **Diverging**: "RdBu", "RdYlBu", "Spectral"
- **Qualitative**: "Set1", "Set2", "Pastel1"

```kusto
// Using different color schemes
plotly_graph_fl(edges, nodes, 
                colorscale_id="Plasma",
                diagram_title="Graph with Plasma Colors")
| render plotly
```

### Node and edge properties

The function automatically includes node and edge properties in hover tooltips:

```kusto
let nodes = datatable (nodeId:string, name:string, department:string, level:int)[
    'A', 'Alice', 'Engineering', 5,
    'B', 'Bob', 'Marketing', 3,
    'C', 'Carol', 'Engineering', 4
];
let edges = datatable (sourceId:string, targetId:string, relationship:string, strength:real)[
    'A', 'B', 'collaborates', 0.8,
    'B', 'C', 'reports_to', 0.9,
    'C', 'A', 'mentors', 0.7
];
plotly_graph_fl(edges, nodes, 
                diagram_title="Team Relationships with Properties")
| render plotly
```

## Dashboard integration

### Azure Data Explorer dashboards

::: moniker range="azure-data-explorer"
To add a Plotly graph visualization to an Azure Data Explorer dashboard:

1. Create your graph visualization query ending with `| render plotly`
2. In the dashboard, add a new tile
3. Select "Query" as the data source
4. Paste your query including the `plotly_graph_fl()` function call
5. The dashboard automatically recognizes the Plotly output and renders it interactively

**Example dashboard query:**

```kusto
let timeRange = ago(7d);
SecurityEvents
| where TimeGenerated >= timeRange
| project SourceNode = Computer, TargetNode = Account, EventTime = TimeGenerated, EventType
| summarize EdgeCount = count() by SourceNode, TargetNode, EventType
| where EdgeCount > 5  // Filter for significant relationships
| project sourceId = SourceNode, targetId = TargetNode, relationship = EventType, weight = EdgeCount
| as edges;
edges
| extend nodeId = sourceId, nodeType = "Computer"
| union (edges | extend nodeId = targetId, nodeType = "Account")
| summarize by nodeId, nodeType
| as nodes;
plotly_graph_fl(edges, nodes,
                "nodeId", "sourceId", "targetId",
                "Viridis",
                "Security Event Relationships - Last 7 Days")
| render plotly
```

::: moniker-end

### Real-Time Intelligence dashboards

::: moniker range="microsoft-fabric"
For Real-Time Intelligence dashboards in Microsoft Fabric:

1. Create a new dashboard tile
2. Select your KQL database as the data source
3. Write your graph visualization query with `plotly_graph_fl()`
4. The visualization renders interactively within the dashboard tile

**Real-time monitoring example:**

```kusto
let realtimeData = MaterializedViewName  // Your real-time data source
| where Timestamp >= ago(1h)
| project Source = SourceSystem, Target = TargetSystem, 
          ConnectionType, ConnectionCount = EventCount;
let edges = realtimeData
| project sourceId = Source, targetId = Target, 
          connectionType = ConnectionType, weight = ConnectionCount;
let nodes = edges
| extend nodeId = sourceId, nodeType = "Source"
| union (edges | extend nodeId = targetId, nodeType = "Target")
| summarize by nodeId, nodeType;
plotly_graph_fl(edges, nodes,
                "nodeId", "sourceId", "targetId",
                "Cividis",
                "Real-time System Connections")
| render plotly
```

::: moniker-end

## Advanced customization

### Custom Python implementation

For advanced scenarios, you can create custom Plotly visualizations using the Python plugin directly:

```kusto
let nodes = datatable(id:string, label:string, group:int, value:int)[
    "1", "Node 1", 1, 10,
    "2", "Node 2", 1, 15,
    "3", "Node 3", 2, 20
];
let edges = datatable(source:string, target:string, weight:real)[
    "1", "2", 0.5,
    "2", "3", 0.8
];
union withsource=tableName nodes, edges
| evaluate python(typeof(plotly:string), ```
import plotly.graph_objects as go
import networkx as nx
import pandas as pd

# Custom layout and styling logic here
# ... (advanced Python code)

result = pd.DataFrame(data=[plotly_json], columns=['plotly'])
```, bag_pack('param1', 'value1'))
| render plotly
```

## Performance optimization

### Data size considerations

For optimal performance with Plotly visualizations:

- **Node limit**: Keep graphs under 5,000 nodes for smooth interaction
- **Edge limit**: Limit edges to under 10,000 for best performance  
- **Property count**: Minimize the number of properties per node/edge

### Query optimization

```kusto
// Efficient approach: filter before graph creation
SecurityLogs
| where TimeGenerated >= ago(1d)
| where EventLevel >= 3  // Only important events
| summarize EdgeWeight = count() by SourceComputer, TargetComputer, EventType
| where EdgeWeight >= 10  // Only significant connections
| take 1000  // Limit result size
| project sourceId = SourceComputer, targetId = TargetComputer, 
          relationship = EventType, weight = EdgeWeight
// ... rest of graph creation
```

## Best practices

### Visual design

- **Color consistency**: Use consistent color schemes across related dashboards
- **Node sizing**: Size nodes based on meaningful metrics (degree, importance, etc.)
- **Edge thickness**: Vary edge thickness to represent strength or frequency
- **Titles and labels**: Provide clear, descriptive titles and axis labels

### Dashboard best practices

- **Responsive design**: Test visualizations at different screen sizes
- **Loading performance**: Optimize queries for fast dashboard loading
- **Interactive features**: Enable appropriate zoom and pan controls
- **Refresh rates**: Set appropriate refresh intervals for real-time data

### Development workflow

- **Iterative development**: Start with small datasets and gradually increase complexity
- **Testing**: Test visualizations with various data shapes and sizes
- **Documentation**: Document custom parameters and styling choices
- **Version control**: Maintain versions of complex visualization queries

## Troubleshooting

### Common issues

**Visualization not rendering:**

- Verify the query ends with `| render plotly`
- Check that the Python plugin is enabled
- Ensure node and edge data has the correct schema

**Performance problems:**

- Reduce the number of nodes and edges
- Simplify node and edge properties
- Use sampling for large datasets
- Optimize the underlying KQL query

**Dashboard integration issues:**

- Verify dashboard supports Plotly visualizations
- Check query timeouts and limits
- Ensure proper permissions for data access

### Debugging tips

```kusto
// Debug: Check data structure before visualization
let edges = /* your edges query */;
let nodes = /* your nodes query */;
// First, examine the data
edges | take 5;
nodes | take 5;
// Then create visualization
plotly_graph_fl(edges, nodes, /* parameters */)
| render plotly
```

## Related content

- [plotly_graph_fl() function](../functions-library/plotly-graph-fl.md)
- [Plotly (preview)](visualization-plotly.md)
- [Graph visualization overview](graph-visualization-overview.md)
- [Python plugin](python-plugin.md)
- [Graph operators](graph-operators.md)
- [Dashboard visualization best practices](/azure/data-explorer/azure-data-explorer-dashboards)
