---
title: Graph Visualization Overview
titleSuffix: Azure Data Explorer
description: Learn about different approaches for visualizing graph data from KQL queries, including built-in tools and custom visualization solutions.
ms.reviewer: royo
ms.topic: concept-article
ms.date: 09/22/2025
---

# Graph visualization overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graph visualization is essential for understanding complex relationships and patterns within interconnected data. KQL graph semantics provide powerful querying capabilities, and there are several approaches available for visualizing the results.

:::image type="content" source="media/graphs/graph-visualization-kusto-explorer-bloodhound-active-directory-overview.png" alt-text="Screenshot of BloodHound Active Directory graph visualization in Kusto Explorer with clustered nodes and Graph Layers panel showing the complex structure of an Active Directory environment.":::

## Kusto Explorer

[Kusto Explorer](graph-visualization-kusto-explorer.md) provides built-in graph visualization capabilities that automatically render interactive graph visualizations when your KQL queries end with the [`make-graph`](make-graph-operator.md) operator or use the [`graph()`](graph-function.md) function.

## Graphistry

[Graphistry](graph-visualization-graphistry.md) offers GPU-accelerated graph visualization and analytics that integrates with KQL graph semantics. This platform enables interactive exploration of large-scale graph datasets with advanced visual analytics capabilities.

## Custom graph visualizations

[Custom graph visualization approaches](graph-visualization-custom.md) provide complete control over the visualization experience, enabling you to create tailored solutions using popular visualization libraries. Two primary approaches are available: Plotly-based visualizations using Python integration through KQL `evaluate python()` operator with interactive plotting capabilities, and D3.js-based visualizations using JavaScript with complete customization of visual appearance and behavior.

## Related content

- [Graph visualization with Kusto Explorer](graph-visualization-kusto-explorer.md)
- [Graph visualization with Graphistry](graph-visualization-graphistry.md)
- [Custom graph visualization approaches](graph-visualization-custom.md)
- [Graph semantics overview](graph-semantics-overview.md)
- [Graph operators](graph-operators.md)
- [Graph scenarios](graph-scenarios.md)
- [Graph best practices](graph-best-practices.md)
