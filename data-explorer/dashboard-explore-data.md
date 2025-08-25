---
title: Explore Data in Dashboard Tiles
description: Learn how to explore data in dashboard tiles in Azure Data Explorer for more insights about the information rendered in the visual.
ms.reviewer: mibar
ms.topic: how-to
ms.date: 08/25/2025
---
# Explore data in dashboard tiles

The explore data feature enables you to delve deeper into the data presented in any dashboard. If the information you're seeking isn't readily available on the dashboard, this feature allows you to extend your exploration beyond the data displayed in the tiles, potentially uncovering new insights.

Even if a dashboard is shared with you and you only have viewer permissions, you can still explore it. The exploration process begins with viewing the data and its corresponding visualization as they appear on the tile. From there, you can further explore the data by adding or removing filters and aggregations, and viewing your results using different visualizations, all without needing any knowledge of the Kusto Query Language.

This exploration can provide additional insights into your data, enhancing your understanding and decision-making capabilities.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* A dashboard with visuals. For more information, see [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

## Start your data exploration

1. From the navigation bar, select **Dashboards**.
1. Select the dashboard you'd like to explore. You can explore in either viewing or editing mode.

    :::image type="content" source="media/dashboard-explore-data/dashboards.png" alt-text="Screenshot of the Dashboard's homepage" lightbox="media/dashboard-explore-data/dashboards.png":::

1. On the tile that you'd like to explore, select the **Explore data** button.

    :::image type="content" source="media/dashboard-explore-data/explore-data.png" alt-text="Screenshot of a dashboard tile showing the explore data icon highlighted." lightbox="media/dashboard-explore-data/explore-data.png":::

## Explore data

When you open the explore data window, you start with the same visualization as shown in the tile.

:::image type="content" source="media/dashboard-explore-data/explore-data-page.png" alt-text="Screenshot of a dashboard explore data window with the different areas highlighted." lightbox="media/dashboard-explore-data/explore-data-page.png":::

In the explore data window, you see the following areas:

A. **Filter and aggregations bar**: Shows filters and aggregations from the original query, added filters and aggregations, and the refresh data button.

B. **Visual pane**: Shows the visualization of the query data.

C. **Results pane**: Show the tabular results of the query data and the query in the **Results** and **KQL** tabs respectively.

D. **Columns pane**: Shows the query columns and their metadata, value distributions, and sample values depending on their data type.

You can then explore your data without affecting the visualization shown in the tile in the following ways:

* In the filters bar, you can remove, add, and modify filters and aggregations from the query.

    Filters that came from the original tile query can't be modified and can only be removed in reverse order. You can add your own filters and aggregations, which you can later modify or remove as you explore.

    To add a filter:

    1. Select **+ Add** > **Aggregation**.

        :::image type="content" source="media/dashboard-explore-data/filters-filter.png" alt-text="Screenshot of the filters dropdown with filters highlighted." lightbox="media/dashboard-explore-data/filters-filter.png":::

    1. Fill in the **Column**, **Operator**, and **Value** fields, and then select **Apply**. The visual, results, and KQL query will update to reflect the applied filter.

        :::image type="content" source="media/dashboard-explore-data/filter-pane.png" alt-text="Screenshot of the filter dialog box showing how to select an operator and a value." lightbox="media/dashboard-explore-data/filter-pane.png":::

    To add an aggregation:

    1. Select **+ Add** > **Aggregation**.

        :::image type="content" source="media/dashboard-explore-data/filters-aggregation.png" alt-text="Screenshot of the filters dropdown with aggregations highlighted." lightbox="media/dashboard-explore-data/filters-aggregation.png":::

    1. Fill in the **Operator** field, optionally provide a **Display Name**, and add additional columns to group by if needed. Once done, select **Apply**. The visual, results, and KQL query will update to reflect the applied aggregation.

        :::image type="content" source="media/dashboard-explore-data/aggregation-pane.png" alt-text="Screenshot of the aggregation dialog box showing how to select aggregation options." lightbox="media/dashboard-explore-data/aggregation-pane.png":::

* From the **Visualization** dropdown, select other visual types to visualize your data in different ways.

    :::image type="content" source="media/dashboard-explore-data/visual-type.png" alt-text="Screenshot of the visualization dropdown selector options." lightbox="media/dashboard-explore-data/visual-type.png":::

* Select the **Results** and **KQL** tabs to view the tabular query results and the underlying query respectively. As you explore, you see the changes you make updated in these tabs.

    :::image type="content" source="media/dashboard-explore-data/results-kql.png" alt-text="Schreenshot of the query pane, showing the query for the visual." lightbox="media/dashboard-explore-data/results-kql.png":::

* In the **Columns** pane, you can browse the table schema by looking at the columns or finding a particular column. You can also choose columns to see their top values, value distributions, and sample values depending on their data type, as follows:

    :::image type="content" source="media/dashboard-explore-data/columns.png" alt-text="Screenshot of the Columns pane, showing the columns with their metadata." lightbox="media/dashboard-explore-data/columns.png":::

## Related content

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Dashboard-specific visuals](dashboard-visuals.md)
