---
title: Graph visualization overview
description: Learn about different options for visualizing graph data in KQL, including Kusto Explorer, Plotly-based visualizations, and Graphistry.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 08/27/2025
---

# Graph visualization overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graph visualization is essential for understanding complex relationships within your data. When working with graph data in KQL, you have several visualization options depending on your requirements, technical constraints, and use cases. This article provides an overview of the three main approaches for visualizing graph data.

## Option 1: Kusto Explorer graph visualization

[Kusto Explorer](graph-visualization-kusto-explorer.md) is a free desktop application that provides built-in graph visualization capabilities. It's ideal for KQL-savvy users who want to quickly visualize graph data without leaving their analysis environment.

**Best for:**

KQL users who need immediate graph insights during data exploration, interactive analysis of graph structures and relationships, development and testing scenarios requiring rapid iteration, and schema visualization of database entity relationships.

**Key features:**

Kusto Explorer automatically renders graphs when queries end with the `make-graph` operator or `graph()` function. Users can interact with the visualization through zoom, pan, and node selection capabilities. The contextual menu provides exploration options including expanding connected nodes, hiding specific elements, reducing graph complexity, and focusing on selected areas. Additional features include graph styling customization and timeline playback for temporal data analysis.

## Option 2: Custom programmatic graph visualization

Custom programmatic visualization approaches allow you to build tailored graph visualizations using popular libraries and frameworks. The main options include [Plotly-based visualization](graph-visualization-plotly-python.md) using Python and the Plotly library, or handcrafted D3-based visualizations using JavaScript. This approach is ideal for users who want to craft their own tools and have special domain-specific needs.

**Best for:**

Users requiring dashboard integration and sharing capabilities, custom styling and branding requirements, web-based applications, programmatic graph generation, and specific user experience requirements tailored to domain-specific use cases.

**Key features:**

Custom programmatic solutions offer maximum flexibility for specialized requirements. Plotly-based approaches provide seamless integration with Azure Data Explorer dashboards and Real-Time Intelligence dashboards, along with Python-based extensibility. D3-based solutions deliver maximum customization flexibility through direct DOM manipulation and access to a rich ecosystem of examples. Both approaches support customizable appearance with color schemes and layouts, web-based interactivity with hover information and custom behaviors, and full control over visualization logic and presentation.

## Option 3: Graphistry

[Graphistry](graph-visualization-graphistry.md) is a third-party GPU-accelerated graph visualization platform optimized for large-scale graph analysis. It's best for users who need to visualize the entirety of large graphs with millions of nodes and edges.

**Best for:**

Organizations working with large graphs containing millions of nodes and edges, performance-critical applications requiring real-time visualization, advanced graph analytics and pattern detection scenarios, and commercial deployments requiring high-performance visualization capabilities.

**Key features:**

Graphistry leverages GPU acceleration to handle massive graphs that would be impractical with other visualization tools. The platform provides advanced filtering and search capabilities for navigating complex data structures, along with professional-grade performance and scalability designed for enterprise environments. The solution is readily available through Azure Marketplace for streamlined deployment and integration.

## Getting started

Each visualization option has different setup requirements and capabilities:

1. **[Kusto Explorer](graph-visualization-kusto-explorer.md)**: Download and install the desktop client, then run graph queries
2. **[Plotly-based](graph-visualization-plotly-python.md)**: Set up Python plugin and use the `plotly_graph_fl()` function
3. **[Graphistry](graph-visualization-graphistry.md)**: Deploy from Azure Marketplace and configure data connections

## Related content

- [Graph semantics overview](graph-semantics-overview.md)
- [Graph sample data](graph-sample-data.md)
- [Graph operators](graph-operators.md)
- [Graph scenarios](graph-scenarios.md)
- [Graph best practices](graph-best-practices.md)
