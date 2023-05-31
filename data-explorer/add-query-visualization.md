---
title: Add a query visualization in the web UI
description: Learn how to add a query visualization in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: how-to
ms.date: 05/28/2023
---
# Add a query visualization in the web UI

Visuals are essential part of any Azure Data Explorer Dashboard. For a full list of available visuals, see [Visualization](kusto/query/renderoperator.md#visualization).

In this article, you'll learn how to customize different visuals from query results. These visuals can be further manipulated, and can be pinned in a [dashboard](azure-data-explorer-dashboards.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-database-portal.md).

## Add a visual

1. [Run a query](web-ui-query-overview.md#write-and-run-queries) in the Azure Data Explorer web UI. For example, you can use the following query: 

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUPd29At2DFYHyhSX5uYmFmVWpYJYGi6JuYnpqQFF+QWpRSWVmgpJlQpgM0IqC1IBD28nVFIAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | where State == 'KANSAS'
    | summarize sum(DamageProperty) by EventType
    ```

1. In the results grid, select **+ Add visual**.

    :::image type="content" source="media/add-query-visualization/add-visual.png" alt-text="Screenshot of query results with add visual button highlighted in a red box.":::

    A pane opens on the right side, with the **Visual Formatting** tab selected.


[!INCLUDE [customize-visuals](includes/customize-visuals.md)]