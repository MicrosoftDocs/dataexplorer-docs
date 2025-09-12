---
title: Graph visualization with Kusto Explorer
description: Learn how to visualize graphs in Kusto Explorer, including interactive features and schema visualization capabilities.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 08/27/2025
---

# Graph visualization with Kusto Explorer

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Kusto Explorer is a free desktop application that provides built-in graph visualization capabilities. When your KQL query ends with the [`make-graph`](make-graph-operator.md) operator or uses the [`graph()`](graph-function.md) function, Kusto Explorer automatically renders the results as an interactive graph visualization.

## Prerequisites

- [Kusto Explorer](../tools/kusto-explorer.md) installed on your Windows desktop
- Access to a Kusto cluster with graph data

## Automatic graph rendering

Kusto Explorer automatically detects and visualizes graph data when:

1. Your query ends with the `make-graph` operator
2. Your query uses the `graph()` function to access persisted graphs

### Example with make-graph operator

This example demonstrates TechCorp's organizational dynamics over 2023-2024, showing how team composition and project assignments evolve over time. Alice (engineer) joins early but leaves mid-2024, Bob (manager) arrives in March to lead the Engineering department, Carol (developer) joins in June and becomes lead developer on MobileApp, and David (intern) has a short tenure. Two overlapping projects run concurrently: WebApp (March 2023 - August 2024) and MobileApp (July 2023 - December 2024).

```kusto
// Create a temporal graph with node/edge lifetimes and labels
let nodes = datatable(nodeId:string, nodeType:string, name:string, from:datetime, to:datetime)[
    "1", "Person", "Alice", datetime(2023-01-01), datetime(2024-12-31),
    "2", "Person", "Bob", datetime(2023-03-15), datetime(2024-12-31),
    "3", "Person", "Carol", datetime(2023-06-01), datetime(2024-12-31),
    "4", "Person", "David", datetime(2023-09-01), datetime(2024-03-31),
    "5", "Company", "TechCorp", datetime(2022-01-01), datetime(2025-12-31),
    "6", "Project", "WebApp", datetime(2023-03-01), datetime(2024-08-31),
    "7", "Project", "MobileApp", datetime(2023-07-01), datetime(2024-12-31),
    "8", "Department", "Engineering", datetime(2022-01-01), datetime(2025-12-31)
];
let edges = datatable(sourceId:string, targetId:string, label:string, from:datetime, to:datetime)[
    "1", "5", "employed by", datetime(2023-02-01), datetime(2024-06-30),
    "2", "5", "manages at", datetime(2023-04-01), datetime(2024-12-31),
    "3", "5", "employed by", datetime(2023-06-15), datetime(2024-12-31),
    "4", "5", "intern at", datetime(2023-09-15), datetime(2024-03-15),
    "1", "8", "member of", datetime(2023-02-01), datetime(2024-06-30),
    "2", "8", "leads", datetime(2023-04-01), datetime(2024-12-31),
    "3", "8", "member of", datetime(2023-06-15), datetime(2024-12-31),
    "1", "6", "works on", datetime(2023-03-15), datetime(2024-06-30),
    "3", "6", "develops", datetime(2023-07-01), datetime(2024-08-31),
    "4", "6", "assists with", datetime(2023-10-01), datetime(2024-03-15),
    "2", "7", "oversees", datetime(2023-08-01), datetime(2024-12-31),
    "3", "7", "lead developer", datetime(2023-08-15), datetime(2024-12-31)
];
edges
| make-graph sourceId --> targetId with nodes on nodeId
```

:::image type="content" source="media/graphs/graph-viz-ke-techcorp-1.png" alt-text="Screenshot of TechCorp organizational graph in Kusto Explorer showing temporal relationships between employees (Alice, Bob, Carol, David), company, projects (WebApp, MobileApp), and Engineering department with nodes sized by importance and edges labeled with relationship types.":::

### Example with graph function

```kusto
// Query using the graph function
graph("Simple")
```

## Interactive graph features

When Kusto Explorer renders a graph, it provides several interactive features through the Graph Layers panel on the right side of the interface:

### Graph Layers panel

The Graph Layers panel contains several sections for interacting with your graph:

#### Find section

The **Find** section allows you to search for specific nodes within the graph:

- **Search field**: Enter node names, IDs, or properties to locate specific nodes
- **Find Next**: Navigate through search results
- **Highlight**: Nodes matching your search criteria are highlighted in the visualization

#### Nodes section

The **Nodes** section provides control over node appearance and behavior:

- **Labels**: Configure which node properties to display as labels
- **Color**: Choose color schemes for different node types or properties
- **Size**: Adjust node sizes based on properties like degree centrality or custom attributes
- **Density**: Control the spacing and layout density of nodes

#### Edges section

The **Edges** section controls edge visualization:

- **Labels**: Display edge properties as labels on connections
- **Color**: Color-code edges by relationship type or properties
- **Thickness**: Vary edge thickness based on weight or importance

#### Timeline section

The **Timeline** section is particularly useful for temporal graphs:

- **Play controls**: Navigate through different time periods in your graph
- **Speed control**: Adjust playback speed for temporal evolution
- **Time range**: Select specific time windows to analyze
- **Frame-by-frame**: Step through individual time points

### Graph manipulation

Kusto Explorer provides intuitive graph manipulation:

- **Zoom**: Use mouse wheel or zoom controls to focus on specific areas
- **Pan**: Click and drag to move around the graph
- **Node selection**: Click on nodes to select and highlight them
- **Node dragging**: Drag nodes to rearrange the layout manually
- **Layout algorithms**: Right-click to access different layout options

## Schema visualization

In addition to data graphs, Kusto Explorer can visualize database schemas as graphs:

### Viewing database schema

1. In the **Connections** panel, right-click on a database
2. Select **Show entities** from the context menu
3. Kusto Explorer renders a graph showing:
   - **Tables** as nodes
   - **Relationships** between tables (foreign keys, joins)
   - **Update policies** as directed edges
   - **Materialized views** and their dependencies
   - **Functions** and their table dependencies

### Schema graph features

The schema graph includes the same interactive features as data graphs:

- **Entity filtering**: Hide or show specific types of entities
- **Relationship visualization**: See how tables connect to each other
- **Dependency tracking**: Understand data flow and dependencies
- **Layout customization**: Organize the schema for better understanding

## Best practices

### Query optimization

- **Limit result size**: Use `take` or `where` clauses to limit large graphs for better performance
- **Index usage**: Ensure your graph queries use appropriate indexes
- **Property selection**: Only project necessary node and edge properties

### Visualization tips

- **Color coding**: Use consistent color schemes to represent node types or categories
- **Node sizing**: Size nodes by importance metrics like degree centrality
- **Edge filtering**: Hide less important relationships to reduce visual clutter
- **Layout selection**: Choose appropriate layout algorithms for your graph structure

### Performance considerations

- **Graph size**: Kusto Explorer works best with graphs containing fewer than 10,000 nodes
- **Property count**: Limit the number of properties displayed to improve rendering speed
- **Interactive features**: Disable timeline features for static graphs to improve performance

## Troubleshooting

### Graph not rendering

If your graph doesn't render automatically:

1. **Check query syntax**: Ensure your query ends with `make-graph` or uses `graph()` function
2. **Verify data format**: Confirm your edge and node data has the correct schema
3. **Check permissions**: Ensure you have read access to the underlying data
4. **Update Kusto Explorer**: Use the latest version for best compatibility

### Performance issues

For slow graph rendering:

1. **Reduce data size**: Apply filters to limit the number of nodes and edges
2. **Simplify properties**: Remove unnecessary node and edge properties
3. **Use sampling**: Apply `sample` operator for exploratory analysis
4. **Consider alternatives**: For very large graphs, consider [Graphistry](graph-visualization-graphistry.md)

## Limitations

- **Graph size**: Performance degrades with graphs larger than 10,000 nodes
- **Real-time updates**: Graphs are static snapshots, not live updates
- **Export options**: Limited options for exporting visualizations
- **Platform**: Available only on Windows desktop

## Related content

- [Kusto Explorer installation and user interface](../tools/kusto-explorer.md)
- [Using Kusto Explorer](../tools/kusto-explorer-using.md)
- [Graph visualization overview](graph-visualization-overview.md)
- [make-graph operator](make-graph-operator.md)
- [graph() function](graph-function.md)
- [Graph operators](graph-operators.md)
