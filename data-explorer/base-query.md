---
title: Create a dashboard base query
description: Learn how to create a base query for an Azure Data Explorer dashboard
ms.reviewer: gabil
ms.topic: how-to
ms.date: 07/17/2023
---
# Create a dashboard base query

Base queries are used as building blocks for all dashboards query components like parameters, tiles and base queries. They’re managed in the context of a dashboard and you can use 1 or more in a single dashboard. Base queries are aimed at making query maintenance in dashboards easier, so that every new query or update of an existing query could be done once in a dashboard central place. 

To interactively explore sample dashboards, see [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md).

> [!NOTE]
> Base query creation and management is available in **Editing** mode to dashboard editors.

## Create a base query

1. At the top of the dashboard, select **Base queries**.

    :::image type="content" source="media/base-query/base-query-menu.png" alt-text="Screenshot of dashboard menu in Azure Data Explorer with the base queries option highlighted by a red box." lightbox="media/base-query/base-query-menu.png":::

    The base query pane opens to the right.

1. Select **+ New base query**.

    :::image type="content" source="media/base-query/new-base-query.png" alt-text="Screenshot of new base query in Azure Data Explorer dashboards." lightbox="media/base-query/new-base-query.png":::

1. Enter a **Variable name** to be used as reference to this base query.  

    > [!NOTE]
    > We suggest starting each base query name with an underscore (_) for easy use later.

    :::image type="content" source="media/base-query/create-base-query.png" alt-text="Screenshot of create base query in Azure Data Explorer dashboards.":::

1. Select a data **Source** from the dropdown.
1. Enter the KQL query that will be used as the base query. This query should begin with a data source, and can optionally have as many lines of query as necessary.
1. Select **Done**.

## Manage base queries

Within the base query pane, you can view the list of existing base queries. In each base query card, you can select the pencil widget to edit the base query, or select the **More [...]** menu to Duplicate, Delete, or move the base query. Base query order can also be changed by drag and drop.

The following indicators can be viewed in the base queries card:

- Base query display name
- Number of tiles in which the base query was used
- Number of parameters in which the base query was used
- Number of base queries in which the base query was used

## Use a base query

:::image type="content" source="media/base-query/use-base-query.png" alt-text="Screenshot of using a base query in Azure Data Explorer dashboards." lightbox="media/base-query/use-base-query.png":::

## See also

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)