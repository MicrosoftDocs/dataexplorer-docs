---
title: 'Azure Data Explorer web UI results grid'
description: In this guide, you'll learn how to work with the results grid in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 04/20/2023
---

# Azure Data Explorer web UI results grid

This guide will teach you how to work with your [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) results using the results grid feature. You'll use the results grid to make your data analysis more efficient and effective, and learn how to customize and manipulate your results to gain deeper insights and uncover hidden patterns in your data.

To learn how to run queries, see [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Access to an Azure Data Explorer cluster and database. You may use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-database-portal.md).

## Expand a cell

Expanding cells are useful to view long strings or dynamic fields such as JSON.

1. Double-click a cell to open an expanded view. This view allows you to read long strings, and provides a JSON formatting for dynamic data.

    :::image type="content" source="media/web-query-data/expand-cell.png" alt-text="Screenshot of the Azure Data Explorer web U I expanded cell to show long strings.":::

1. Select on the icon on the top right of the result grid to switch reading pane modes. Choose between the following reading pane modes for expanded view: inline, below pane, and right pane.

    :::image type="content" source="media/web-query-data/expanded-view-icon.png" alt-text="Screenshot highlighting the icon to change the reading pane to expanded view mode in the Azure Data Explorer web UI query results.":::

## Expand a row

When working with a table with dozens of columns, expand the entire row to be able to easily see an overview of the different columns and their content.

1. Click on the arrow **>** to the left of the row you want to expand.

    :::image type="content" source="media/web-query-data/expand-row.png" alt-text="Screenshot of an expanded row in the Azure Data Explorer web UI.":::

1. Within the expanded row, some columns are expanded (arrow pointing down), and some columns are collapsed (arrow pointing right). Click on these arrows to toggle between these two modes.

## Group column by results

Within the results, you can group results by any column.

1. Run the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5lIAghqF4vyiEoWkSoXgksSikpDM3FSFlNTiZKhkSWJ2qoKhAQBQNnAYNgAAAA==" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

1. Mouse-over the **State** column, select the menu, and select **Group by State**.

    :::image type="content" source="media/web-query-data/group-by.png" alt-text="Screenshot of a table with query results grouped by state.":::

1. In the grid, double-click on **California** to expand and see records for that state. This type of grouping can be helpful when doing exploratory analysis.

    :::image type="content" source="media/web-query-data/group-expanded.png" alt-text="Screenshot of a query results grid with California group expanded in the Azure Data Explorer web U I." border="false":::

1. Mouse-over the **Group** column, then select **Reset columns**. This setting returns the grid to its original state.

    :::image type="content" source="media/web-query-data/reset-columns.png" alt-text="Screenshot of the reset columns setting highlighted in the column dropdown menu.":::

### Use value aggregation

After you've grouped by a column, you can then use the value aggregation function to calculate simple statistics per group.

1. Select the menu for the column you want to evaluate.
1. Select **Value Aggregation**, and then select the type of function you want to do on this column.

    :::image type="content" source="media/web-query-data/aggregate.png" alt-text="Screenshot of aggregate results when grouping column by results in the Azure Data Explorer web U I. ":::

## Hide empty columns

You can hide/unhide empty columns by toggling the **eye** icon on the results grid menu.

:::image type="content" source="media/web-query-data/hide-empty-columns.png" alt-text="Screenshot of eye icon to hide results grid in the Azure Data Explorer web U I.":::

## Filter columns

You can use one or more operators to filter the results of a column.

1. To filter a specific column, select the menu for that column.
1. Select the filter icon.
1. In the filter builder, select the desired operator.
1. Type in the expression you wish to filter the column on. Results are filtered as you type.

    > [!NOTE]
    > The filter isn't case sensitive.

1. To create a multi-condition filter, select a boolean operator to add another condition
1. To remove the filter, delete the text from your first filter condition.

    :::image type="content" source="media/web-query-data/filter-column.gif" alt-text="GIF showing how to filter on a column in the Azure Data Explorer web U I.":::

## Run cell statistics

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMMQ7CMBAEe15xD6BwCloq0kdKPmCcFSHIOeu8gCzxeA4aRLUj7c6OVMv9Axvr7iVVjXJuMjIap2uGzKjJi+cCg5xijhcMpgXGJkc5hBC8LaYrEn/a/oP0+D5PrTj+y77QuyW4zXiDdOENqkYty4oAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | sort by StartTime desc
    | where DamageProperty > 5000
    | project StartTime, State, EventType, DamageProperty, Source
    | take 10
    ```

1. In the results grid, select a few of the numerical cells. The table grid allows you to select multiple rows, columns, and cells and calculate aggregations on them. The Azure Data Explorer web UI currently supports the following functions for numeric values: **Average**, **Count**, **Min**, **Max**, and **Sum**.

    :::image type="content" source="media/web-query-data/select-stats.png" alt-text="Screenshot of a table with selected functions.":::

## Filter to query from grid

Another easy way to filter the grid is to add a filter operator to the query directly from the grid.

1. Select a cell with content you wish to create a query filter for.

1. Right-click to open the cell actions menu. Select **Add selection as filter**.

    :::image type="content" source="media/web-query-data/add-selection-filter.png" alt-text="Screenshot of a dropdown menu with the Add selection as filter option to query directly from the grid.":::

1. A query clause will be added to your query in the query editor:

    :::image type="content" source="media/web-query-data/add-query-from-filter.png" alt-text="Screenshot of the query editor showing query clause added from filtering on the grid in Azure Data Explorer web U I.":::

## Pivot

The pivot mode feature is similar to Excel’s pivot table, enabling you to do advanced analysis in the grid itself.

Pivoting allows you to take a columns value and turn them into columns. For example, you can pivot on *State* to make columns for Florida, Missouri, Alabama, and so on.

1. On the right side of the grid, select **Columns** to see the table tool panel.

    :::image type="content" source="media/web-query-data/tool-panel.png" alt-text="Screenshot showing how to access the pivot mode feature.":::

1. Select **Pivot Mode**, then drag columns as follows: **EventType** to **Row groups**; **DamageProperty** to **Values**; and **State** to **Column labels**.  

    :::image type="content" source="media/web-query-data/pivot-mode.png" alt-text="Screenshot highlighting selected column names to create the pivot table.":::

    The result should look like the following pivot table:

    :::image type="content" source="media/web-query-data/pivot-table.png" alt-text="Screenshot of results in a pivot table.":::

## Search in the results grid

You can look for a specific expression within a result table.

1. Run the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcEnMTUxPDSjKL0gtKqlUsFMwNTAwAMqWJGanKhgC2QAe2m3iNQAAAA==" target="_blank">Run the query</a>

    ```Kusto
    StormEvents
    | where DamageProperty > 5000
    | take 1000
    ```

1. Click on the **Search** button on the right and type in *"Wabash"*

    :::image type="content" source="media/web-query-data/search.png" alt-text="Screenshot highlighting the search bar in the table.":::

1. All mentions of your searched expression are now highlighted in the table. You can navigate between them by clicking *Enter* to go forward or *Shift+Enter* to go backward, or you can use the *up* and *down* buttons next to the search box.

    :::image type="content" source="media/web-query-data/search-results.png" alt-text="Screenshot of a table containing highlighted expressions from search results.":::

## Search within a dynamic field

To search for a value within a dynamic field, open the field and use the keyboard shortcut "Ctrl + F". This will open a free text search bar.

## Color results by value

You can color the rows of results based on a column value.

1. Run the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Right click on a value in the `State` column.

1. Select **Explore results**, and then select **Color by value**.

    :::image type="content" source="media/web-query-data/color-by-value.png" alt-text="Screenshot of color by value." lightbox="media/web-query-data/color-by-value.png":::

## Get the path to a dynamic field

Nested dynamic property-bag fields can become complex as you go deeper into their layers. In the results grid, the JPATH indicates the path through the dynamic property-bag object fields to arrive at the given field. 

1. Run the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Select the first result in the `StormSummary` column, which should be the column furthest to the right.

1. Select different fields within the result and see how the JPATH at the top of the window changes. For example, the following screenshot shows the path to the `Location` field, which is nested under the `Details` field within the `StormSummary` column dynamic property-bag object.

    :::image type="content" source="media/web-query-data/nested-jpath.png" alt-text="Screenshot of a nested JPATH."  lightbox="media/web-query-data/nested-jpath.png":::

1. Select the icon to the right of the JPATH to copy it. Then, you can paste and use the JPATH as a filter or share it with others.

## Filter by value of dynamic field

To add a field and its value as a condition to a query, right-click on the field within a dynamic field and select **Add as filter**.

For example, if we added the Location field from the previous example as a filter, the resulting query might look something like the following query:

```kusto
StormEvents
| take 10
| where ['StormSummary']['Details']['Location'] == "FLORIDA"
```
