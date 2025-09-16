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

1. Your query ends with the [`make-graph`](make-graph-operator.md) operator
2. Your query ends with the [`graph()`](graph-function.md) function

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

:::image type="content" source="media/graphs/graph-viz-ke-techcorp-1.png" alt-text="TechCorp organizational graph visualization in Kusto Explorer showing temporal relationships and project assignments.":::

The visualization clearly shows the organizational structure with TechCorp (purple node) at the center, connected to employees Alice, Bob, Carol, and David (green nodes) through various employment relationships. The graph displays two projects - WebApp and MobileApp (cyan nodes) - with labeled edges showing how employees interact with these projects ("develops", "oversees", "works on", "assists with"). The Engineering department (purple node) connects to team members, and the temporal timeline at the bottom allows navigation through different time periods to see how relationships evolve. The Graph Layers panel on the right provides controls for customizing the visualization, including node labeling, coloring, and timeline navigation.

### Example with graph function

This example demonstrates how to visualize a persisted graph using the `graph()` function. The BloodHound Active Directory dataset contains 1,495 Active Directory objects representing a typical enterprise AD deployment with users, computers, groups, and security relationships.

```kusto
// Query using the graph function
graph("BloodHound_AD")
```

This query loads the entire BloodHound Active Directory graph, which Kusto Explorer will automatically render as an interactive visualization. The graph shows security relationships and potential attack paths in an Active Directory environment, making it useful for security assessments and privilege escalation analysis.

For detailed information about this dataset and other available sample graphs, see [Graph sample datasets and examples](graph-sample-data.md).

:::image type="content" source="media/graphs/graph-viz-ke-bloodhound-1.png" alt-text="BloodHound Active Directory graph visualization in Kusto Explorer with clustered nodes and Graph Layers panel.":::

The visualization shows the complex structure of an Active Directory environment with distinct clusters of related objects. The blue cluster on the left represents one group of AD objects (likely computers or organizational units), while the purple clusters on the right show different types of security principals and groups. The interconnecting edges reveal the security relationships and potential attack paths between these entities. The Graph Layers panel on the right provides interactive controls to explore the data, including search functionality, node/edge customization options, and timeline controls for temporal analysis.

### Example with database entity graph

Kusto Explorer provides a powerful capability to visualize the entity relationships within a KQL database. This feature helps you understand the database schema, data dependencies, and relationships between different database objects.

To generate the entity graph:

1. In the **Connections** panel, right-click on the database name
2. Select **Show Entities Graph** from the context menu
3. Kusto Explorer automatically executes a statement and renders the database entities as an interactive graph

This automatically generates and executes a query that analyzes the database schema and creates a visualization showing:

- **Tables** as the foundation data entities
- **Graph models** representing persistent graph structures
- **Functions** including user-defined and system functions
- **Materialized views** for data aggregation and optimization
- **External tables** for data export and external connectivity
- **Dependencies** shown as labeled edges indicating relationships between entities

:::image type="content" source="media/graphs/graph-viz-ke-entities-1.png" alt-text="Database entity graph in Kusto Explorer showing table dependencies, graph models, functions, materialized views, and export relationships.":::

The visualization reveals the database architecture at a glance, showing the complete data flow and dependencies. In this example, you can trace the data processing pipeline step by step:

**Data ingestion and transformation**

First, a raw table populates the `sensorData` table using an [update policy](../management/update-policy.md) that triggers the `updateSensorData` function whenever new data arrives.

**Data optimization with materialized views**

Next, there are [materialized views](../management/materialized-views/materialized-view-overview.md) for data optimization - one for deduplication (`SensorDeduplicated`) defined on the `sensorData` table, and another for downsampling of timeseries data (`SensorDownsampled`) that runs on top of the `SensorDeduplicated` view.

**Function dependencies**

The system also includes function dependencies where `SensorDataFunction1` (yellow node) references the `sensorData` table, and `SensorDataFunction2` (yellow node) uses `SensorDataFunction1`, creating a chain of function dependencies.

**Data export**

Additionally, there's a [continuous export](../management/data-export/continuous-data-export.md) operation defined that exports data from the `sensorData` table to an external table called `ExternalTable` (cyan node).

**Graph modeling**

Finally, the "Simple" graph model (blue node) depends on two underlying tables, with reference relationships clearly marked.

**Visualization insights**

The purple edges indicate various relationship types like "definition", "reference", "export", and "update-policy". This capability to track interdependencies between functions is particularly valuable for debugging performance issues, understanding data lineage, and optimizing query execution paths. Database administrators and developers can use this comprehensive view to understand data flow, identify bottlenecks, and maintain database integrity.

## Interactive graph features

When Kusto Explorer renders a graph, it provides several interactive features through the Graph Layers panel on the right side of the interface. The features described below are demonstrated using the [TechCorp organizational graph](#example-with-make-graph-operator) shown earlier:

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

### Interactive node actions

You can interact with graph nodes in two ways: write KQL graph queries manually, or simply right-click on any node to execute several predefined actions. Each action provides a different way to explore and manipulate the graph visualization:

:::image type="content" source="media/graphs/graph-viz-ke-techcorp-rightclick.png" alt-text="Graph node action in Kusto Explorer showing a context menu on the selected node.":::

#### Expand

The **Expand** action generates a statement that allows you to selectively visualize graphs which start or end at the interesting node, revealing connected nodes and relationships.

:::image type="content" source="media/graphs/graph-viz-ke-expand-1.png" alt-text="Graph node expand action in Kusto Explorer showing additional connected nodes revealed from the selected node.":::

When you right-click on a node and select "Expand", Kusto Explorer first presents you with options to customize the expansion:

1. **Select expansion levels**: Choose how many levels (hops) you want to expand from the selected node (1 level, 2 levels, 3 levels, or 4 levels)
2. **Select paths of interest**: After choosing the levels, you can select specific paths or relationship types that you want to include in the expansion

This two-step process allows for precise control over graph exploration. Rather than expanding everything connected to a node, you can focus on specific relationship patterns and limit the expansion depth to avoid overwhelming visualizations. This is particularly useful for exploring large graphs where you want to focus on the immediate neighborhood of a specific entity without being overwhelmed by the entire graph structure.

#### Hide Others

The **Hide Others** action hides all other nodes except the selected one and its direct connections, creating a focused view of the selected node's immediate environment.

:::image type="content" source="media/graphs/graph-viz-ke-hide-others-1.png" alt-text="Graph hide others action in Kusto Explorer showing only the selected node and its direct connections.":::

When you right-click on a node and select "Hide Others", you can choose how many levels should be left in the graph:

- **Leave only me**: Shows only the selected node, hiding all others
- **Leave 1 more level**: Shows the selected node plus nodes that are 1 hop away
- **Leave 2 more levels**: Shows the selected node plus nodes that are 1-2 hops away
- **Leave 3 more levels**: Shows the selected node plus nodes that are 1-3 hops away
- **Leave 4 more levels**: Shows the selected node plus nodes that are 1-4 hops away

This action is ideal when you want to isolate a specific node and examine only its relationships within a defined radius. It effectively filters out the visual noise from the rest of the graph, allowing you to concentrate on understanding how the selected node connects to its neighbors at various distances.

#### Hide Node

The **Hide Node** action removes the selected node from the current view along with all edges connected to it.

:::image type="content" source="media/graphs/graph-viz-ke-hide-node-1.png" alt-text="Graph hide node action in Kusto Explorer showing the graph with the selected node removed from view.":::

When you click on a node you want to hide, it removes both the node itself and all edges connected to it from the visualization. This creates a cleaner graph by eliminating dangling connections that would otherwise point to nowhere. For example, if you hide the MobileApp node, all relationships like "lead developer", "oversees", and other connections to that project are also removed from the view.

Use this action when you want to temporarily remove a node that might be cluttering your visualization or when you want to see how the graph looks without a particular entity. This is especially useful for removing central hub nodes that have many connections, allowing you to better see the relationships between other nodes without the visual distraction of orphaned edges.

#### Reduce Graph

The **Reduce Graph** action simplifies the graph by automatically generating a statement that shows nodes within a specific range of hops from the selected node.

:::image type="content" source="media/graphs/graph-viz-ke-reduce-1.png" alt-text="Graph reduce action in Kusto Explorer showing nodes 1-4 hops away from the MobileApp node with the generated KQL statement.":::

When you click "Reduce Graph" on a node (such as the MobileApp node), Kusto Explorer automatically generates a statement that reduces the graph to show all nodes which are 1 to 4 hops away from the selected node. This default behavior helps manage complex graphs by focusing on the most relevant neighborhood around your point of interest.

You can customize the generated statement to adjust the hop range according to your needs. For example, you can modify the statement to show only nodes that are 1 to 2 hops away, creating an even more focused view:

:::image type="content" source="media/graphs/graph-viz-ke-reduce-2.png" alt-text="Graph reduce action in Kusto Explorer showing a more focused view with nodes 1-2 hops away from the MobileApp node after manual statement modification.":::

This action is particularly valuable when working with large, dense graphs where you want to focus on the most significant relationships and entities within a specific distance from your selected node. The ability to customize the hop range gives you precise control over the level of detail in your reduced graph visualization.

#### Zoom on me (Node)

The **Zoom on me** action is very helpful to focus visually on a specific node. It centers and zooms the view to focus specifically on the selected node, making it the focal point of the visualization.

:::image type="content" source="media/graphs/graph-viz-ke-zoom-1.png" alt-text="Graph showing the context menu with Zoom on me option visible for focusing on a specific node in Kusto Explorer.":::

When you right-click on a node and select "Zoom on me", Kusto Explorer automatically adjusts both the zoom level and centers the view so that the selected node becomes the primary focus. This visual transformation makes it much easier to examine the node's properties and relationships without distractions from other parts of the graph.

:::image type="content" source="media/graphs/graph-viz-ke-zoom-2.png" alt-text="Graph view after Zoom on me action in Kusto Explorer showing the selected node centered and zoomed for detailed examination.":::

This action is particularly useful for navigation in large graphs where you might lose track of a specific node or when you want to focus your analysis on a particular entity and its immediate connections. The zoom and centering functionality ensures that the selected node is prominently displayed and easy to examine in detail.

These interactive actions provide quick graph exploration without requiring manual KQL query writing, making it easy to focus on specific parts of complex graphs or discover hidden relationships in your data.

### Interactive edge actions

In addition to node actions, you can also interact with graph edges by right-clicking on them. Edge actions provide complementary functionality for exploring and manipulating connections within your graph visualization.

:::image type="content" source="media/graphs/graph-viz-ke-techcorp-edge-rightclick.png" alt-text="Graph node action in Kusto Explorer showing a context menu on the selected edge.":::

#### Hide Edges

The **Hide Edges** action provides multiple options for removing edges and related nodes from the current view. This allows you to simplify the visualization by removing specific relationships that might be cluttering the graph.

When you right-click on an edge and select "Hide Edges", you can choose from several hiding options:

- **Hide Edges Only**: Removes only the selected edges while keeping all connected nodes visible
- **Hide Edges and Source Nodes**: Removes the edges and their source nodes from the visualization
- **Hide Edges and Target Nodes**: Removes the edges and their target nodes from the visualization  
- **Hide Edges and Nodes**: Removes both the edges and all connected nodes (source and target)

The edges that are hidden are determined by the edge **Label** configuration in the **Edges** section of the Graph Layers panel on the right. You can specify which edge labels should be affected by the hide operation, allowing you to hide all edges with a specific relationship type rather than just individual connections.

:::image type="content" source="media/graphs/graph-viz-ke-edge-hide-1.png" alt-text="Graph view after selecting 'Hide Edges Only' in Kusto Explorer showing the 'manages at' edge removed while keeping TechCorp and Bob nodes visible.":::

The first image shows what happens after clicking "Hide Edges Only". In this case, the "manages at" edge between Bob and TechCorp is removed from the visualization, but both the source node (Bob) and target node (TechCorp) remain visible along with their other connections.

:::image type="content" source="media/graphs/graph-viz-ke-edge-hide-2.png" alt-text="Graph view after selecting 'Hide Edges and Nodes' in Kusto Explorer showing the 'manages at' edge, TechCorp and Bob nodes, and all their connected edges removed.":::

The second image demonstrates the result of clicking "Hide Edges and Nodes". In this case, not only is the "manages at" edge removed, but both the source node (Bob) and target node (TechCorp) are also removed from the visualization, along with all edges connected to those nodes. This creates a much more dramatic simplification of the graph structure.

This functionality is particularly useful when you want to focus on specific types of relationships by removing others, or when certain edge types are not relevant to your current analysis. The ability to hide edges based on their labels provides powerful filtering capabilities for complex graphs with multiple relationship types.

#### Zoom on me (Edge)

The **Zoom on me** action for edges centers the visualization of the graph on the selected edge, making the relationship the focal point of the view.

:::image type="content" source="media/graphs/graph-viz-ke-edge-zoom-1.png" alt-text="Graph edge zoom action in Kusto Explorer showing the 'manages at' edge near the border of the visualization with the context menu visible.":::

The first image shows an edge (the "manages at" relationship between Bob and TechCorp) that is positioned close to the border of the visualization, making it harder to focus on and examine.

When you right-click on this edge and select "Zoom on me", Kusto Explorer automatically adjusts the view to center the selected edge in the visualization. This repositioning makes it much easier to examine the relationship details and the properties of both connected entities.

:::image type="content" source="media/graphs/graph-viz-ke-edge-zoom-2.png" alt-text="Graph view after edge zoom action in Kusto Explorer showing the 'manages at' edge centered in the visualization for detailed examination.":::

The second image demonstrates how the same "manages at" edge is now centered in the view, providing a much clearer focus on this specific relationship and its connected nodes (Bob and TechCorp).

This action is particularly valuable when working with dense graphs where specific relationships might be positioned at the edges of the view or partially obscured. It helps you focus on important connections and examine edge properties, labels, and the context of how two specific entities are related without having to manually navigate or zoom to find the relationship.

These edge-focused interactive actions complement the node actions, providing comprehensive control over graph exploration and allowing you to manipulate both entities and relationships according to your analysis needs.

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
