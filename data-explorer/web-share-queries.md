---
title: Share Queries From Azure Data Explorer Web UI
description: 'Share queries from the Azure Data Explorer web UI: learn to copy links, export results, pin to dashboards, or open live in Excel — try it now.'
ms.topic: how-to
ms.date: 08/25/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:08/25/2025
  - ai-gen-description
---

# Share queries from Azure Data Explorer web UI

Use the Azure Data Explorer web UI to share queries and results with colleagues, pin live visuals to dashboards, or open a refreshable workbook in Excel. This article shows how to copy a runnable query link, copy query text or results, download a KQL file, export results to CSV, and pin queries to dashboards.

After reading this article, you’ll be able to:

- Copy a link that runs the query in protected (read-only) mode.
- Copy the query text or the query results to the clipboard.
- Download the query as a KQL file or export results to CSV.
- Open a live query in Excel and refresh results from the cluster.
- Pin a query to an Azure Data Explorer dashboard.

> [!NOTE]
> To learn how to run queries, see [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md).


## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-and-database.md).

## Share options

The following table outlines the many options for how to share a query.

|Action|Description|
|--|--|
|[Pin to dashboard](#pin-to-dashboard)|Display the query in an [Azure Data Explorer dashboard](azure-data-explorer-dashboards.md).|
|[Copy query link to clipboard](#copy-query-link-to-clipboard)|Copy a link that can be used to run the query to the clipboard. For enhanced security, the shared query opens in Azure Data Explorer in **Protected mode**. |
|[Copy query text to clipboard](#copy-query-text-to-clipboard)|Copy text of the query to the clipboard. |
|[Copy query results to clipboard](#copy-query-results-to-clipboard)|Copy results of the query to the clipboard. For enhanced security, the shared query opens in Azure Data Explorer in protected mode. |
|[Download](#download)|Download a KQL file of the query.|
|[Open in Excel](#open-in-excel)|Open a live query in an Excel workbook that can be refreshed directly from Excel.|
|[Export to CSV](#export-to-csv)|Download a CSV of the query results.|

## Pin to dashboard

To pin a query to a dashboard for continuous monitoring, follow these steps:

1. In the query window, select the query that you want to pin.

1. Select **Pin to dashboard**.

    :::image type="content" source="media/web-share-query/pin-to-dashboard.png" alt-text="Screenshot of the pin to dashboard button." lightbox="media/web-share-query/pin-to-dashboard.png":::

1. In the **Pin to dashboard** pane:
    1. Provide a **Tile name**.
    1. Select **Use existing** or **Create new**.
    1. Provide the **Dashboard name**.
    1. Select the **View dashboard after creation** checkbox (if it's a new dashboard).
    1. Select **Pin**.

> [!NOTE]
> **Pin to dashboard** only pins the selected query. To create the dashboard data source and translate render commands to a visual in the dashboard, the relevant database must be selected in the database list.

## Copy query link to clipboard

To copy a link to the query to the clipboard, follow these steps:

1. In the query window, select the query that you want to share.
1. Select **Copy** on the toolbar. 

    :::image type="content" source="media/web-share-query/select-copy.png" alt-text="Screenshot of the pin query window with the copy button on the toolbar highlighted." lightbox="media/web-share-query/select-query.png":::    
1. In the **Copy Query** window, select the **Copy Link** option, and then select **Copy**.

    :::image type="content" source="media/web-share-query/link-to-clipboard.png" alt-text="Screenshot of the link to clipboard button." lightbox="media/web-share-query/link-to-clipboard.png":::
1. Paste the link into a new browser window to run the query.

    > [!NOTE]
    > - The user must have access to the cluster to run the query.
    > - The query link request is generated with `request_readonly_hardline` set to `true`, ensuring it operates in strict read-only mode for enhanced security in protected mode. The **Protected mode** banner displays above the query and an icon appears in the query tab when protected mode is enabled. For more information about this request property, see [Request properties](/azure/data-explorer/kusto/api/rest/request-properties).

    > [!TIP]
    > You can open the shared query as a [Fabric Real-Time Intelligence](/fabric/real-time-intelligence/overview) link. This feature allows you to experiment with a trial Fabric Real-Time Intelligence account using your own data, without the need to move any data.
    
## Copy query text to clipboard

To copy the text of the query to clipboard, follow these steps:

1. In the query window, select the query that you want to share.
1. Select **Copy** on the toolbar. 

    :::image type="content" source="media/web-share-query/select-copy.png" alt-text="Screenshot of the pin query window with the copy button on the toolbar highlighted." lightbox="media/web-share-query/select-query.png":::  
1. In the **Copy Query** window, select the **Copy Query** option, and then select **Copy**.

    :::image type="content" source="media/web-share-query/link-query-to-clipboard.png" alt-text="Screenshot of the link, query to clipboard button." lightbox="media/web-share-query/link-query-to-clipboard.png":::
1. Paste to share. The output lists the query text. For example: 

    ```kusto
    StormEvents
    | take 3    
    ```
    

## Copy query results to clipboard

To copy results of the query to the clipboard, follow these steps:

1. In the query window, select the query that you want to share.
1. Select **Copy** on the toolbar. 

    :::image type="content" source="media/web-share-query/select-copy.png" alt-text="Screenshot of the pin query window with the copy button on the toolbar highlighted." lightbox="media/web-share-query/select-query.png":::  
1. In the **Copy Query** window, select the **Query Results** option, and then select **Copy**.

    :::image type="content" source="media/web-share-query/link-query-results-to-clipboard.png" alt-text="Screenshot of the link, query, results to clipboard button." lightbox="media/web-share-query/link-query-results-to-clipboard.png":::
1. Paste to share. The output lists the query results.     



## Download

To download a KQL file of the query, follow these steps:

1. In the query window, select the query that you want to download.

1. Select **Export** > **Download**.

    :::image type="content" source="media/web-share-query/download.png" alt-text="Screenshot of the download button." lightbox="media/web-share-query/download.png":::

## Open in Excel

To access live results of your query in an Excel workbook, follow these steps:

1. In the query window, create and select the query that you want to share.

1. Select **Export** > **Open in Excel**.

    :::image type="content" source="media/web-share-query/open-in-excel.png" alt-text="Screenshot of option to open in excel." lightbox="media/web-share-query/open-in-excel.png":::

1. Open and share the downloaded Excel workbook, which is connected to Azure Data Explorer and can be refreshed. You can refresh your Excel workbook with new data from Azure Data Explorer, and all related Excel artifacts, like charts and pivot tables, is updated based on the new data.

> [!NOTE]
> Depending on your Excel settings, you might need to enable editing and grant permission to access external data connections for the file to update.

## Export to CSV

To export the query results to a CSV file, follow these steps:

1. In the query window, select the query that you want to export.

1. Select **Export** > **Export to CSV**.

    :::image type="content" source="media/web-share-query/export-to-csv.png" alt-text="Screenshot of the export to CSV button." lightbox="media/web-share-query/export-to-csv.png":::

## Related content

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
