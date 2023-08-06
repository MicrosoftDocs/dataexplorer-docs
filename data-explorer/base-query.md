---
title: Create a dashboard base query
description: Learn how to create a base query for an Azure Data Explorer dashboard
ms.reviewer: gabil
ms.topic: how-to
ms.date: 07/31/2023
---
# Create a dashboard base query

Base queries are reusable query snippets that can be used as building blocks for all dashboards query components such as parameters, tiles, and other base queries. A single base query is managed in the context of a specific dashboard. Each dashboard can have one or more base queries. Base queries make query maintenance in dashboards easier, as queries can be managed in a central location.

To interactively explore sample dashboards, see [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md).

> [!NOTE]
> Base query creation and management is available in **Editing** mode to dashboard editors.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Dashboard editing permissions on an [Azure Data Explorer dashboard](azure-data-explorer-dashboards.md)

## Create a base query

1. Toggle the dashboard mode from **Viewing** to **Editing**.
1. At the top of the dashboard, select **Base queries**.

    :::image type="content" source="media/base-query/base-query-menu.png" alt-text="Screenshot of dashboard menu in Azure Data Explorer with the base queries option highlighted by a red box." lightbox="media/base-query/base-query-menu.png":::

    The base query pane opens to the right.

1. Select **+ New base query**.

    :::image type="content" source="media/base-query/new-base-query.png" alt-text="Screenshot of new base query in Azure Data Explorer dashboards." lightbox="media/base-query/new-base-query.png":::

1. Enter a **Variable name** to be used as reference to this base query.  

    > [!NOTE]
    > We suggest starting each base query name with an underscore (_) for easy use later, and so as not to conflict with Kusto-defined names. For more information, see [naming your entities](kusto/query/schema-entities/entity-names.md#naming-your-entities-to-avoid-collisions-with-kusto-language-keywords)

    :::image type="content" source="media/base-query/create-base-query.png" alt-text="Screenshot of create base query in Azure Data Explorer dashboards.":::

1. Select a data **Source** from the dropdown.
1. Enter the KQL query that will be used as the base query. This query should begin with a data source or another base query, and can optionally have as many lines of query as necessary.
1. Select **Done**.

## Manage base queries

Within the base query pane, you can view the list of existing base queries. In each base query card, select the pencil widget to edit the base query, or select the **More [...]** menu to duplicate, delete, or move the base query. Base query order can also be changed by dragging and dropping the card.

The following indicators can be viewed in the base queries card:

* Base query display name
* Number of tiles in which the base query was used
* Number of parameters in which the base query was used
* Number of base queries in which the base query was used

## Use a base query

Base queries can be used in dashboard tiles, parameters, and other base queries. Since these queries begin with a data source, use the base query at the beginning of a query. Recall the base query by entering ['*variablename*'] in the query editor.

:::image type="content" source="media/base-query/use-base-query.png" alt-text="Screenshot of using a base query in Azure Data Explorer dashboards." lightbox="media/base-query/use-base-query.png":::

## See also

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)