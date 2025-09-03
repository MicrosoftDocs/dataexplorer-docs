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

## Visualization options comparison

The following table summarizes the key characteristics of each visualization option:

| Feature | Kusto Explorer | Plotly-based | Graphistry |
|---------|----------------|--------------|------------|
| **Target audience** | Data analysts, developers | Dashboard users, analysts | Large-scale graph analysts |
| **Data size** | Small to medium graphs | Small to medium graphs | Large graphs (millions of nodes) |
| **Deployment** | Desktop client | Cloud/on-premises | Third-party cloud service |
| **Interactivity** | High | Medium | High |
| **Customization** | Medium | High | Medium |
| **Performance** | Good | Good | Excellent (GPU-accelerated) |
| **Cost** | Free | Included | Commercial license required |

## Option 1: Kusto Explorer graph visualization

[Kusto Explorer](graph-visualization-kusto-explorer.md) is a free desktop application that provides built-in graph visualization capabilities. It's ideal for interactive data exploration and analysis.

**Best for:**

- Data analysts who need immediate visualization
- Interactive exploration of graph structures
- Schema visualization and database entity relationships
- Development and testing scenarios

**Key features:**

- Automatic graph rendering when queries end with `make-graph` operator or use the `graph()` function
- Interactive graph manipulation with zoom, pan, and node selection
- Timeline playback for temporal graph data
- Database schema visualization

## Option 2: Plotly-based graph visualization

[Plotly-based visualization](graph-visualization-plotly.md) uses Python and the Plotly library to create interactive web-based graph visualizations that can be embedded in dashboards.

**Best for:**

- Dashboard integration and sharing
- Custom styling and branding requirements
- Web-based applications
- Programmatic graph generation

**Key features:**

- Integration with Azure Data Explorer dashboards and Real-Time Intelligence dashboards
- Customizable appearance with color schemes and layouts
- Web-based interactivity with hover information
- Python-based extensibility

## Option 3: Graphistry

[Graphistry](graph-visualization-graphistry.md) is a third-party GPU-accelerated graph visualization platform optimized for large-scale graph analysis.

**Best for:**

- Large graphs with millions of nodes and edges
- Performance-critical applications
- Advanced graph analytics and pattern detection
- Commercial deployments requiring high-performance visualization

**Key features:**

- GPU acceleration for handling massive graphs
- Advanced filtering and search capabilities
- Professional-grade performance and scalability
- Available through Azure Marketplace

## Choosing the right option

Consider the following factors when selecting a graph visualization approach:

### Data size and performance requirements

- **Small graphs (< 10,000 nodes)**: Any option works well
- **Medium graphs (10,000 - 100,000 nodes)**: Kusto Explorer or Plotly
- **Large graphs (> 100,000 nodes)**: Graphistry recommended

### Deployment and accessibility

- **Desktop analysis**: Kusto Explorer
- **Web dashboards**: Plotly-based visualization
- **Enterprise-scale deployments**: Graphistry

### Technical requirements

- **No additional dependencies**: Kusto Explorer
- **Python support available**: Plotly-based visualization
- **High-performance requirements**: Graphistry

### Budget considerations

- **Free options**: Kusto Explorer, Plotly-based (with existing infrastructure)
- **Commercial solutions**: Graphistry

## Getting started

Each visualization option has different setup requirements and capabilities:

1. **[Kusto Explorer](graph-visualization-kusto-explorer.md)**: Download and install the desktop client, then run graph queries
2. **[Plotly-based](graph-visualization-plotly.md)**: Set up Python plugin and use the `plotly_graph_fl()` function
3. **[Graphistry](graph-visualization-graphistry.md)**: Deploy from Azure Marketplace and configure data connections

## Related content

- [Graph semantics overview](graph-semantics-overview.md)
- [Graph sample data](graph-sample-data.md)
- [Graph operators](graph-operators.md)
- [Graph scenarios](graph-scenarios.md)
- [Graph best practices](graph-best-practices.md)
