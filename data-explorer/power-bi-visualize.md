---
title: 'Use data from Azure Data Explorer in Power BI'
description: 'Learn how to use Azure Data Explorer data in Power BI.'
ms.reviewer: danyhoter
ms.topic: how-to
ms.date: 12/05/2022

#Customer intent: As a data analyst, I want to understand connection options in Power BI so I can choose the option most appropriate to my scenario.
---

# Use Azure Data Explorer data in Power BI

In this article, you'll learn about the different ways in which you can connect Azure Data Explorer as a data source to Power BI. Once connected, you can proceed to build Power BI reports and visualizations.

## Prerequisites

* A [Microsoft account](https://account.microsoft.com/account/Account), or an Azure Active Directory user identity.
* [Power BI Desktop](https://powerbi.microsoft.com/get-started).

## Connectivity modes

Power BI supports Import and Direct Query connectivity modes. You can build dashboards using **Import** or **DirectQuery** mode depending on your scenario, scale, and performance requirements. In **Import** mode, data is moved to Power BI. In **DirectQuery** mode, data is queried directly from your Azure Data Explorer cluster.

Use **Import** mode when:

* Your data set is small.
* You don't need near real-time data.
* Your data is already aggregated or you perform [aggregation in Kusto](./kusto/query/aggregation-functions.md)

Use **DirectQuery** mode when:
* Your data set is very large.
* You need near real-time data.

For more information on connectivity modes, see [Import and Direct Query connectivity modes](/power-bi/desktop-directquery-about).
## Use data in Power BI

You can connect Azure Data Explorer as a data source to Power BI in the following ways:

* Starting in Azure Data Explorer web UI and then pasting the data in Power BI Desktop.
* Starting directly in Power BI Desktop and using the Azure Data Explorer connector.

# [Web UI](#tab/web-ui/)

1. In the Azure Data Explorer web UI, on the left menu, select **Query**, and then select the database with your data. For example, connect to [our help cluster](https://help.kusto.windows.net/) and select the **Samples** database.
1. Create a query and select it. For example, the following query from the **Samples** > **StormEvents** table, returns storm events that caused the most crop damage:

    ```Kusto
    StormEvents
    | sort by DamageCrops desc
    | take 1000
    ```

1. From the **Share**  menu, select **Query to Power BI**

    :::image type="content" source="media/power-bi-imported-query/share-query.png" alt-text="Screenshot of Azure Data Explorer web UI that shows an open Share menu. The Share button and Share menu entry titled Query to Power BI are highlighted.":::

1. Launch Power BI Desktop.
1. On the **Home** tab, select **Transform data**.

    :::image type="content" source="media/power-bi-imported-query/transform-data.png" alt-text="Screenshot of the Home tab in Power BI Desktop. The Home tab option titled Transform data is highlighted.":::

1. Paste the query in the **Navigator** pane.

    :::image type="content" source="media/power-bi-imported-query/paste-query.png" alt-text="Screenshot of the Power BI Desktop Navigator pane that shows the drop-down menu of the right mouse button. The drop-down menu option titled Paste is highlighted.":::

1. On the **Home** tab, select **Close & Apply**.

    :::image type="content" source="media/power-bi-imported-query/close-apply.png" alt-text="Screenshot of the Home tab. The home tab option titled Close & Apply is highlighted.":::

# [Connector](#tab/connector/)

1. Launch Power BI Desktop.
1. On the **Home** tab, select **Get Data** > **More**.

    :::image type="content" source="media/power-bi-imported-query/get-data.png" alt-text="Screenshot of the Home tab in Power BI Desktop that shows the drop-down menu of the Home tab entry titled Get data. The Get data entry titled More is highlighted.":::

1. Search for *Azure Data Explorer (Kusto)*, select **Azure Data Explorer (Kusto)** > **Connect**.

    :::image type="content" source="media/power-bi-imported-query/connect-data.png" alt-text="Screenshot of the Get Data window that shows Azure Data Explorer (Kusto) typed into the search bar. Both the search result and the connect option are highlighted.":::

1. On the **Azure Data Explorer (Kusto)** screen, fill out the form with the following information.

    :::image type="content" source="media/power-bi-imported-query/cluster-database-table.png" alt-text="Screenshot of the Azure Data Explorer(Kusto) connection form. The cluster option has the following link pasted: https://help.kusto.windows.net/. The cluster, the Data Connectivity mode, and the OK button are highlighted.":::

| Setting | Field description | Sample value
|---|---|---
| Cluster | The URL for the help cluster. For other clusters, the URL is in the form *https://\<ClusterName\>.\<Region\>.kusto.windows.net*. | *https://help.kusto.windows.net* |
| Database | A database that is hosted on the cluster you're connecting to. We'll select this in a later step. | Leave blank |
| Table name | The name of a table in the database, or a query like <code>StormEvents \| take 1000</code>. We'll select this in a later step. | Leave blank |
| Advanced options | Options for your queries, such as result set size. |  Leave blank |
| Data connectivity mode | Determines whether Power BI imports the data or connects directly to the data source. You can use either option with this connector. For more information, see [Connectivity modes](#connectivity-modes). | *DirectQuery* |

**Advanced options**

| Setting | Field description | Sample value
|---|---|---
| Limit query result record number| The maximum number of records to return in the result |`300000` |
| Limit query result data size | The maximum data size in bytes to return in the result | `4194304` |
| Disable result set truncation | Enable/disable result truncation by using the notruncation request option | `true` |
| Additional set statements | Sets query options for the duration of the query. Query options control how a query executes and returns results. | `set query_datascope=hotcache` |

1. On the **Navigator** screen, expand the **Samples** database, select **StormEvents** > **Transform Data**.

    :::image type="content" source="media/power-bi-imported-query/select-table.png" alt-text="Screenshot of Navigator screen. The table titled StormEvents is selected. The table and the Transform Data button are highlighted.":::

1. On the **Home** tab, select **Close & Apply**.

    :::image type="content" source="media/power-bi-imported-query/close-apply.png" alt-text="Screenshot of the Home tab. The home tab option titled Close & Apply is highlighted.":::

[Tips for using the Azure Data Explorer connector for Power BI to query data](power-bi-best-practices.md#tips-for-using-the-azure-data-explorer-connector-for-power-bi-to-query-data).

---

You now know how to query data from Azure Data Explorer in Power BI.

## Next steps

[Create reports and dashboards in Power BI](/power-bi/create-reports/)
