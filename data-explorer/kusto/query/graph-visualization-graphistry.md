---
title: Graph visualization with Graphistry
description: Learn how to use Graphistry for large-scale graph visualization with GPU acceleration.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 08/27/2025
---

# Graph visualization with Graphistry

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graphistry provides GPU-accelerated graph visualization and analytics that integrates with KQL graph semantics. This powerful combination enables interactive exploration of complex relationships, pattern detection, and anomaly analysis within large-scale graph datasets.

Graphistry Core can be found and deployed via the Azure Marketplace.

The following examples show Graphistry visualizing the BloodHound graph from the [graph sample data](graph-sample-data.md#bloodhound-active-directory-dataset), demonstrating both high-level overview and detailed analysis capabilities:

:::image type="content" source="media/graphs/graph-visualization-graphistry-bloodhound-ad-high-level.png" alt-text="Graphistry high-level view of BloodHound_AD graph showing a large circular cluster with scattered nodes and connecting lines displaying the overall network structure.":::

The next image shows a zoomed-in view revealing the detailed relationship patterns and edge flows within the graph:

:::image type="content" source="media/graphs/graph-visualization-graphistry-bloodhound-ad-zoomed-in.png" alt-text="Graphistry detailed view of BloodHound_AD graph showing flowing edge connections and intricate relationship patterns between nodes with enhanced visual detail.":::

For more information, see [Graphistry and KQL integration](https://www.graphistry.com/blog/azure-data-explorer-kusto-graph-visual-exploration).

To try out this integration, see the [Python Graphistry and KQL demo notebook](https://pygraphistry.readthedocs.io/en/latest/demos/demos_databases_apis/microsoft/kusto/graphistry_ADX_kusto_demo.html).

## Related content

- [Graph visualization overview](graph-visualization-overview.md)
- [Graph sample data](graph-sample-data.md)
- [Graph operators](graph-operators.md)
