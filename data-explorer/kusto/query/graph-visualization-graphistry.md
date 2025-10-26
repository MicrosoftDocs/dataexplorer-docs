---
title: Graph Visualization with Graphistry
description: Overview of Graphistry integration for scalable GPU-accelerated KQL graph visualization.
ms.reviewer: royo
ms.topic: conceptual
ms.date: 10/01/2025
---

# Graph visualization with Graphistry

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graphistry adds server-side GPU layout and filtering on top of KQL graph semantics for iterative exploration of large or dense connected data: heavy parallel layout/clustering runs on a managed GPU, only light render data streams to the browser for consistent responsiveness across devices, enabling rapid refine–explore cycles on focused KQL results while preserving governance (deploy in your subscription, limit exported attributes, keep stable identifiers, filter early, iterate as needed, and share live views without producing static exports).

The following example shows Graphistry visualizing the BloodHound Entra ID graph from the [graph sample data](graph-sample-data.md#bloodhound-entra-dataset). The first image shows the zoomed-out view allowing you to see the entirety of the graph structure:

:::image type="content" source="media/graphs/graph-visualization-graphistry-bloodhound-ad-high-level.png" alt-text="Screenshot of Graphistry high-level view of BloodHound Entra ID graph showing the entire graph structure with nodes and connecting relationships in a zoomed-out overview.":::

The second image demonstrates what happens when you zoom in to examine specific relationship patterns and node details:

:::image type="content" source="media/graphs/graph-visualization-graphistry-bloodhound-ad-zoomed-in.png" alt-text="Screenshot of Graphistry detailed view of BloodHound Entra ID graph showing zoomed-in relationship patterns and intricate connections between specific nodes.":::

Deploy Graphistry Core in your Azure subscription (Azure Marketplace) so GPU processing stays in-boundary. See the [integration blog](https://www.graphistry.com/blog/azure-data-explorer-kusto-graph-visual-exploration) and the concise [demo notebook](https://pygraphistry.readthedocs.io/en/latest/demos/demos_databases_apis/microsoft/kusto/graphistry_ADX_kusto_demo.html) for a hands-on sample.

## Related content

* [Graph sample data](graph-sample-data.md)
* [Graph operators](graph-operators.md)
* [Graph semantics overview](graph-semantics-overview.md)
* [Graph best practices](graph-best-practices.md)
