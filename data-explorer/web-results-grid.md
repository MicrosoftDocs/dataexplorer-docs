---
title: 'Azure Data Explorer web UI results grid'
description: Learn how to work with the results grid in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/28/2023
---

# Azure Data Explorer web UI results grid

In this guide, you'll learn how to work with query results in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) using the results grid. With the results grid, you can customize and manipulate your results, and enhance the efficiency and effectiveness of your data analysis.

To learn how to run queries, see [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-and-database.md).

## Expand a cell

Expand a cell to open a detailed view of the cell content, which is especially helpful for viewing [dynamic](kusto/query/scalar-data-types/dynamic.md) data or long strings. In the detailed view, dynamic data is presented like JSON. To expand a cell, follow these steps:

1. Double-click a cell to open the detailed view.
1. Select the icon on the top right of the result grid to switch reading pane modes. Choose between the following reading pane modes: **Inline**, **Below**, and **Right**.

    :::image type="content" source="media/web-query-data/expanded-view-icon.png" alt-text="Screenshot showing the icon to change the reading pane mode in the Azure Data Explorer web UI query results." lightbox="media/web-query-data/expanded-view-icon.png":::

## Expand a row

Expand a row to open a detailed view of the row content. This detailed view shows the different columns and their content. To expand a row, follow these steps:

1. On the left side of the row you want to expand, select the arrow icon **>**.

    :::image type="content" source="media/web-query-data/expand-row-arrow.png" alt-text="Screenshot of an expanded row in the Azure Data Explorer web UI." lightbox="media/web-query-data/expand-row-arrow.png":::

1. In the detailed view, columns with dynamic data can be expanded or collapsed. Expanded columns are marked by a downward-pointing arrow, while collapsed columns are marked by a right-pointing arrow. You can toggle between expanding and collapsing the content by selecting the arrow beside the column key.

    :::image type="content" source="media/web-query-data/expand-columns.png" alt-text="Screenshot of columns with expanded or collapsed data." lightbox="media/web-query-data/expand-columns.png":::

## Search in detailed view

You can perform free text search within the detailed view of a result. To learn how to do so, follow these steps:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpV8MzLKi3KTC32zEvJLEpNLlGwUzAAAKFa44UoAAAA" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | where InjuriesIndirect > 0
    ```

1. [Expand a row](#expand-a-row) in the result grid to open the detailed view.

1. Select the detailed view window.

1. To initiate a free text search bar, press the keyboard shortcut "Ctrl + F".

1. Input "injur". All instances of the searched term are highlighted.

    :::image type="content" source="media/web-query-data/search-in-detailed-view.png" alt-text="Screenshot of search result from dynamic field search." lightbox="media/web-query-data/search-in-detailed-view.png":::

> [!NOTE]
> The search function isn't case sensitive by default.

## Get the path to a dynamic field

Nested dynamic property-bag fields can become complex as you go deeper into their layers. In the results grid, the JPATH indicates the path through the dynamic property-bag object fields to arrive at the given field. To learn how to find a JPATH, follow these steps:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Select the first result in the `StormSummary` column, which should be the last column.

1. Select different fields within the result and see how the JPATH at the top of the window changes. For example, the following screenshot shows the path to the `Location` field, which is nested under the `Details` field within the `StormSummary` column dynamic property-bag object.

    :::image type="content" source="media/web-query-data/nested-jpath.png" alt-text="Screenshot of a nested JPATH."  lightbox="media/web-query-data/nested-jpath.png":::

1. Select the icon to the right of the JPATH to copy it. Then, paste and use the JPATH as a filter or share it with others.

## Add filter from dynamic field

To add a specific dynamic field as a filter to your query, do the following:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Select the first result in the `StormSummary` column, which should be the last column.

1. Right-click on a field within a dynamic data and select **Add as filter**. For example, right-click on the `Location` field and add it as a filter.

    :::image type="content" source="media/web-query-data/add-dynamic-field-as-filter.png" alt-text="Screenshot of add as filter option from dynamic field." lightbox="media/web-query-data/add-dynamic-field-as-filter.png":::

1. In the query editor, a query clause is added to your query based on the selected dynamic field.

    :::image type="content" source="media/web-query-data/condition-added-from-dynamic.png" alt-text="Screenshot of the query condition added from the dynamic field selection." lightbox="media/web-query-data/condition-added-from-dynamic.png":::

## Add filter from query result

To add a filter operator to the query directly from the result grid, follow these steps:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Select the cells with content for which you want to create a query filter. To select multiple cells, click and drag your mouse over the cells you want to select, or hold down the "Ctrl" key while clicking on each cell. For example, select multiple cells from the `State` and `EventType` columns.

1. Right-click to open the cell actions menu. Select **Add selection as filters**.

    :::image type="content" source="media/web-query-data/add-selection-as-filters.png" alt-text="Screenshot of a dropdown menu with the Add selection as filter option to query directly from the grid." lightbox="media/web-query-data/add-selection-as-filters.png":::

1. In the query editor, a query clause is added to your query based on the selected cells.

    :::image type="content" source="media/web-query-data/conditions-added-as-filters.png" alt-text="Screenshot of the conditions that were added as filters." lightbox="media/web-query-data/conditions-added-as-filters.png":::

## Group column by results

Within a result set, you can group the results by any column. After this grouping, you can perform further aggregations to investigate the data. To group and explore column results, follow these steps:

1. Run the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZR8ErNTdV3T0lKTSxSC8/LLlQC15ugJMwAAAA==" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | where EventType == "Lake-Effect Snow"
    ```

1. Mouse-over the **State** column, select the menu, and select **Group by State**.

    :::image type="content" source="media/web-query-data/group-by.png" alt-text="Screenshot of a table with query results grouped by state." lightbox="media/web-query-data/group-by.png":::

    The following screenshot shows the result after selecting **Group by State**.

    :::image type="content" source="media/web-query-data/group-by-result.png" alt-text="Screenshot of records grouped by state." lightbox="media/web-query-data/group-by-result.png":::

1. In the grid, double-click on a record to expand and see records for that state. For example, expand the records for "INDIANA". This type of grouping can be helpful when doing exploratory analysis.

    :::image type="content" source="media/web-query-data/group-expanded.png" alt-text="Screenshot of a query results grid with California group expanded in the Azure Data Explorer web U I." border="false" lightbox="media/web-query-data/group-expanded.png":::

1. Once you've grouped data by a column, you can use a value aggregation function to calculate statistics for each group. To do so, go to the column menu, choose **Value Aggregation**, and select the function type to use for that column.

    :::image type="content" source="media/web-query-data/aggregate.png" alt-text="Screenshot of aggregate results when grouping column by results in the Azure Data Explorer web UI." lightbox="media/web-query-data/aggregate.png":::

1. To return the results grid to its original state, select the menu of the **Group** column. Then, select **Reset columns**.

## Filter columns

To filter the results of a specific column, follow these steps:

1. Select the menu for the column to filter.
1. Select the filter icon.
1. In the filter builder, select the desired operator.
1. Type in the expression by which to filter the column. Results are filtered as you type.

    > [!NOTE]
    > The filter isn't case sensitive.

1. To create a multi-condition filter, select a boolean operator to add another condition.
1. To remove the filter, delete the text from your first filter condition.

    :::image type="content" source="media/web-query-data/filter-column.gif" alt-text="GIF showing how to filter on a column in the Azure Data Explorer web U I.":::

## View cell statistics

To quickly calculate the **Average**, **Count**, **Min**, **Max**, and **Sum** for several rows, select the relevant numerical cells. For example:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcEnMTUxPdS7KLyhWsFMwUEjMS4GKBQDFUotKKkHCQOUFRflZqcklCsEliUUlIZm5qTogZgmQApsYUlkAZCKZpoNmDFB5fmlRcioASkZ5RoUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | where DamageCrops > 0 and DamageProperty > 0
    | project StartTime, State, EventType, DamageCrops, DamageProperty, Source
    ```

1. Select a few of the numerical cells. To select multiple cells, click and drag your mouse over the cells you want to select, or hold down the "Ctrl" key while clicking on each cell. The **Average**, **Count**, **Min**, **Max**, and **Sum**  are automatically calculated for these cells.

    :::image type="content" source="media/web-query-data/select-stats.png" alt-text="Screenshot of a table with selected functions." lightbox="media/web-query-data/select-stats.png":::

## Make a pivot table

Pivot mode is similar to Excel’s pivot table. Pivot mode allows you to turn column values into columns. For example, you can pivot on the `State` column to make columns for "Florida", "Missouri", "Alabama", and so on. To create a pivot table, follow these steps:

1. On the right side of the results grid, select **Columns** to see the table tool panel. At the top of the panel, select **Pivot Mode**.

    :::image type="content" source="media/web-query-data/tool-panel.png" alt-text="Screenshot showing how to access the pivot mode feature." lightbox="media/web-query-data/tool-panel.png":::

1. Drag columns to the **Row groups**, **Values**, **Column labels** sections. For example, if you drag **EventType** to **Row groups**; **DamageProperty** to **Values**; and **State** to **Column labels**, then the result should look like the following pivot table.

    :::image type="content" source="media/web-query-data/pivot-table.png" alt-text="Screenshot of results in a pivot table." lightbox="media/web-query-data/pivot-table.png":::

## Search in the results grid

To search for a specific expression within a result table, use the search capability. For example:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcEnMTUxPDSjKL0gtKqlUsFMwNTAwAMqWJGanKhgC2QAe2m3iNQAAAA==" target="_blank">Run the query</a>

    ```Kusto
    StormEvents
    | where DamageProperty > 5000
    | take 1000
    ```

1. In the top menu of the results grid, on the right side, select **Search** and type in "Wabash".

    :::image type="content" source="media/web-query-data/search.png" alt-text="Screenshot highlighting the search bar in the table." lightbox="media/web-query-data/search.png":::

1. All mentions of your searched expression are now highlighted in the table. You can navigate between them by clicking Enter to go forward, Shift+Enter to go backward, or by using the up and down buttons beside the search box to move around.

    :::image type="content" source="media/web-query-data/search-results.png" alt-text="Screenshot of a table containing highlighted expressions from search results."  lightbox="media/web-query-data/search-results.png":::

1. To only display rows that contain your search query, turn on the **Show only rows that fit search** option located at the top of the search window.

## Color results by value

To color the rows of results based on a column value, follow these steps:

1. Run the following query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNAAAWuk9VBUAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 10
    ```

1. Right-click on a value in the `State` column.

1. Select **Explore results**, and then select **Color by value**.

    :::image type="content" source="media/web-query-data/color-by-value-option.png" alt-text="Screenshot of the option to color by value." lightbox="media/web-query-data/color-by-value-option.png":::

1. The results are colored by the values in the `State` column.

    :::image type="content" source="media/web-query-data/color-by-value-table.png" alt-text="Screenshot of color by value." lightbox="media/web-query-data/color-by-value-table.png":::

## Color results by error level

The results grid can color results based on error severity or verbosity level. To turn on this feature, alter your settings as described in [Highlight error levels](web-customize-settings.md#highlight-error-levels).

| Error level color scheme in **Light** mode | Error level color scheme in **Dark** mode |
|--|--|
| :::image type="content" source="media/web-query-data/light-mode.png" alt-text="Screenshot of color legend in light mode."::: | :::image type="content" source="media/web-query-data/dark-mode.png" alt-text="Screenshot of color legend in dark mode."::: |

## Hide empty columns

To hide or show empty columns, select the eye icon in the menu of the results grid.

:::image type="content" source="media/web-query-data/hide-empty-columns.png" alt-text="Screenshot of eye icon to hide results grid in the Azure Data Explorer web UI."  lightbox="media/web-query-data/hide-empty-columns.png":::

## Next steps

* Get data with the [ingestion wizard](ingest-data-wizard.md)
* [Query data in the web UI](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
