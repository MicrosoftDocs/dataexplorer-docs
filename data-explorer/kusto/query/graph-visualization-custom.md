---
title: Custom graph visualization approaches
description: Learn how to create custom graph visualizations from KQL graph data using Plotly and D3.js for tailored, interactive network visualizations.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 09/22/2025
---

# Custom graph visualization approaches

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Custom graph visualizations enable you to create tailored, interactive network visualizations that meet specific domain requirements and user experience needs. When working with graph data from KQL queries, you can leverage powerful visualization libraries to build custom solutions that go beyond standard charting capabilities. Custom graph visualizations involve coding and offer many different options for implementation.

This article covers two primary approaches for creating custom graph visualizations: **Plotly-based visualizations** using Python integration, and **D3.js-based visualizations** using JavaScript. Both approaches provide complete control over the visualization appearance, interaction patterns, and integration with your applications.

## Plotly-based graph visualizations

[Plotly](https://plotly.com/) is a powerful visualization library that provides interactive graphing capabilities with excellent integration into KQL environments through the `evaluate python()` operator in Azure Data Explorer and Microsoft Fabric. You can create sophisticated graph visualizations directly from your query results using the `plotly_graph_fl()` function from the [functions library](../functions-library/plotly-graph-fl.md), or implement custom Python scripts with complete control over visualization logic, layouts, styling, and interactive behaviors using NetworkX for graph processing and Plotly for rendering, with support for performance optimization techniques, colorblind-friendly palettes, various layout algorithms, and dashboard integration.

## D3.js-based graph visualizations

[D3.js](https://d3js.org/) is a powerful JavaScript library for creating custom, interactive visualizations with complete control over the DOM. D3.js graph visualizations typically involve setting up an SVG container, creating force simulations for node positioning, rendering nodes and edges as scalable vector graphics, and implementing interactive behaviors like drag, zoom, and hover effects. The library provides specialized layouts for hierarchical data structures, dynamic filtering and search capabilities, smooth zooming and panning, and supports integration with KQL graph data by exporting query results using [`graph-to-table`](graph-to-table-operator.md) operators and formatting the data as JSON structures compatible with D3.js requirements.

## Related content

- [plotly_graph_fl() function](../functions-library/plotly-graph-fl.md)
- [Plotly (preview)](visualization-plotly.md)
- [Graph semantics overview](graph-semantics-overview.md)
- [Graph operators](graph-operators.md)
- [D3.js documentation](https://d3js.org/)
