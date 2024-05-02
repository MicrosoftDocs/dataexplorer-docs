---
title: 'Visualize a query in Excel'
description: 'In this article, you learn how to use a query from the web UI into Excel, by exporting it directly or by using the native connector in Excel.'
ms.reviewer: orspodek
ms.topic: how-to
ms.date: 04/30/2024

# Customer intent: As a data analyst, I want to understand how to visualize my Azure Data Explorer data in Excel.
---

# Use Excel to visualize data from the web UI

This article shows you how to view your query in Excel, by exporting directly from the web UI or importing into Excel.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help/databases/Samples).

## View data in Excel

You can use the following options to query data in Excel:

* Start in the web UI: Open the query directly.

* Start in Excel: Use the Azure Data Explorer data source.

### [Start from the web UI](#tab/azure-data-explorer)
Export the query directly from the web UI.

1. In [Azure Data Explorer web UI](https://dataexplorer.azure.com/clusters/help/databases/Samples), run the query and check the results.

1. Select the **Export** tab and select **Open in Excel**.

    :::image type="content" source="media/excel/web-ui-query-to-excel.png" alt-text="Screenshot that shows Azure Data Explorer web UI query to Open in Excel" lightbox="media/excel/web-ui-query-to-excel.png":::

    The query is saved as an Excel workbook in the Downloads folder.

1. Open the downloaded workbook to view your data. Enable editing and enable content if requested in the top ribbon.

### [Start from Excel](#tab/excel)

Get data from Azure Data Explorer datasource into Excel.

1. Open **Microsoft Excel**.

1. In the **Data** tab, select **Get Data** > **From Azure** > **From Azure Data Explorer**.

    :::image type="content" source="media/excel/get-data-from-adx.png" alt-text="Screenshot that shows how to get data from Azure Data Explorer web UI.":::

1. In the **Azure Data Explorer (Kusto)** window, complete the following fields and select **OK**.

    :::image type="content" source="media/excel/adx-connection-window.png" alt-text="Screenshot that shows the Azure Data Explorer (Kusto) window.":::

    |Field   |Description |
    |---------|---------|
    |**Cluster**   |   Name of cluster, for example *Help* (mandatory)      |
    |**Database**     |    Name of database, for example *Samples*      |
    |**Table name or Azure Data Explorer query**    |     Name of table or Azure Data Explorer query, for example table name *StormEvents*    |

    **Advanced Options:**

     |Field   |Description |
    |---------|---------|
    |**Limit query result record number**     |     Limit the number of records loaded into excel  |
    |**Limit query result data size (bytes)**    |    Limit the data size      |
    |**Disable result-set truncation**    |         |
    |**Additional Set statements (separated by semicolons)**    |    Add `set` statements to apply to data source     |

    Repeat the previous steps to add more queries. You can rename the queries to more meaningful names.

1. If sign-in is required, a pop-up box appears. Select **Organizational account** and **Sign in**. Complete the sign-in process and then select **Connect**.

    :::image type="content" source="media/excel/complete-sign-in.png" alt-text="Screenshot that shows that show the sign-in pop-up window.":::

1. In the **Navigator** pane, navigate to the correct table. In the table preview pane, select **Transform Data** to open the **Power Query Editor** and make changes to your data, or select **Load** to load it straight to Excel.

    :::image type="content" source="media/excel/navigate-table-preview-window.png" alt-text="Screenshot of the Table preview window.":::

    > [!TIP]
    > If **Database** and/or **Table name or Azure Data Explorer query** are already specified, the correct table preview pane will open automatically.

1. If you select **Transform Data**, the **Power Query Editor** window opens. In the window, select **Advanced Editor**.

    :::image type="content" source="media/excel/power-query-editor.png" alt-text="Screenshot that shows the Power query editor window.":::

    In the **Advanced Editor** window, you can edit the query and select **Done** to keep your changes.

    :::image type="content" source="media/excel/advanced-editor-query.png" alt-text="Screenshot of the Advanced editor query":::

1. Select the **Close & Load** button to get your data into Excel.

    :::image type="content" source="media/excel/close-and-load.png" alt-text="Screenshot that shows where to select Close and Load.":::

1. Select the **Refresh** button under the **Table Design** tab to refresh the query.

    :::image type="content" source="media/excel/data-in-excel.png" alt-text="Screenshot of the Table preview window.":::

---

## Analyze and visualize data in Excel

Once the data loads to excel and is available in your Excel sheet, you can analyze, summarize, and visualize the data by creating relationships and visuals.

1. In the **Table Design** tab, select **Summarize with PivotTable**. In the **Create PivotTable** window, select the relevant table, and select **OK**.

    :::image type="content" source="media/excel/create-pivot-table.png" alt-text="Screenshot that shows how to create a PivotTable.":::

1. In the **PivotTable Fields** pane, select the relevant table columns to create summary tables. In the following example,  **EventId** and **State** are selected.

    :::image type="content" source="media/excel/pivot-table-pick-fields.png" alt-text="Screenshot that shows how to select the PivotTable fields.":::

1. In the **PivotTable Analyze** tab, select **PivotChart** to create visuals based on the table.

    :::image type="content" source="media/excel/pivot-table-analyze-pivotchart.png" alt-text="Screenshot of the PivotTable analyze menu":::

1. In the following example, use **Event Id**, **StartTime**, and **EventType** to view additional information about the weather events.

    :::image type="content" source="media/excel/visualize-excel-data.png" alt-text="Screenshot of the returned visualization graphs.":::

1. Create full dashboards to monitor your data.

## Related content

To learn about other ways to visualize your data, see [Visualization integrations overview](integrate-visualize-overview.md).
