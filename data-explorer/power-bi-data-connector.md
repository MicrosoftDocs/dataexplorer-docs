---
title: Use data from Azure Data Explorer in Power BI
description: Learn how to use Azure Data Explorer data in Power BI.
ms.reviewer: danyhoter
ms.topic: how-to
ms.date: 12/29/2022

#Customer intent: As a data analyst, I want to understand connection options in Power BI so I can choose the option most appropriate to my scenario.
---

# Use Azure Data Explorer data in Power BI

In this article, you'll learn about the different ways in which you can connect Azure Data Explorer as a data source to Power BI. Once connected, you can proceed to build Power BI reports.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Power BI Desktop](https://powerbi.microsoft.com/get-started).

## Connectivity modes

Power BI supports *Import* and *DirectQuery* connectivity modes. When building Power BI reports or dashboards, choose your connectivity mode depending on your scenario, scale, and performance requirements. Using **Import** mode copies your data to Power BI. In contrast, using **DirectQuery** mode queries your data directly from your Azure Data Explorer cluster.

Use **Import** mode when:

* Your data set is small and you don't need near real-time data.
* You perform [aggregation in Kusto](./kusto/query/aggregation-functions.md).

Use **DirectQuery** mode when:

* Your data set is large or you need near real-time data.

For more information on connectivity modes, see [Import and Direct Query connectivity modes](/power-bi/desktop-directquery-about).

## Use data in Power BI

You can connect Azure Data Explorer as a data source to Power BI in the following ways:

* Starting in Azure Data Explorer web UI and then pasting the data in Power BI Desktop.
* Starting directly in Power BI Desktop and then adding the Azure Data Explorer connector.

In the following steps, we'll be using the StormEvents table from our [help cluster](https://help.kusto.windows.net/) to demonstrate how to use Azure Data explorer data in Power BI.

## [Web UI](#tab/web-ui/)

1. In the Azure Data Explorer web UI, on the left menu, select **Query**, and then select the database with your data.
1. Create a query and select it. For example, the following query from the **Samples** > **StormEvents** table, returns storm events that caused the most crop damage:

    ```Kusto
    StormEvents
    | sort by DamageCrops desc
    | take 1000
    ```

1. From the **Export**  menu, select **Query to Power BI**.

    :::image type="content" source="media/power-bi-data-connector/query-to-power-bi.png" alt-text="Screenshot of Azure Data Explorer web UI, showing the open Share menu with the Query to Power BI option highlighted.":::

1. Launch Power BI Desktop.
1. On the **Home** tab, select **Transform data**.

    :::image type="content" source="media/power-bi-data-connector/transform-data.png" alt-text="Screenshot of the Home tab in Power BI Desktop, with the Home tab option titled Transform data highlighted.":::

1. Paste the query in the **Navigator** pane.

    :::image type="content" source="media/power-bi-data-connector/paste-query.png" alt-text="Screenshot of the Power BI Desktop Navigator pane, showing the drop-down menu of the right mouse button with the Paste option highlighted.":::

1. Optionally, you can change the connectivity mode from *DirectQuery* to *Import*. In the **Query Settings** window, under **Applied steps**, select the settings cog. For more information, see [Connectivity modes](#connectivity-modes).

    :::image type="content" source="media/power-bi-data-connector/connectivity-mode-web-ui.png" alt-text="Screenshot of the Query Settings window, showing applied steps with the settings cog highlighted.":::

1. On the **Home** tab, select **Close & Apply**.

    :::image type="content" source="media/power-bi-data-connector/close-apply.png" alt-text="Screenshot of the Home tab with the Close & Apply option highlighted.":::

## [Connector](#tab/connector/)

1. Launch Power BI Desktop.
1. On the **Home** tab, select **Get Data** > **More**.

    :::image type="content" source="media/power-bi-data-connector/get-data.png" alt-text="Screenshot of the Home tab in Power BI Desktop, showing the drop-down menu of the Home tab entry titled Get data with the More option highlighted.":::

1. Search for *Azure Data Explorer*, select **Azure Data Explorer (Kusto)**, and then select **Connect**.

    :::image type="content" source="media/power-bi-data-connector/connect-data.png" alt-text="Screenshot of the Get Data window, showing  Azure Data Explorer in the search bar with the connect option highlighted.":::

1. In the window that appears, fill out the form with the following information.

    :::image type="content" source="media/power-bi-data-connector/cluster-database-table.png" alt-text="Screenshot of the Azure Data Explorer(Kusto) connection window showing the help cluster URL, with the DirectQuery option selected.":::

    | Setting | Field description | Sample value |
    |---|---|---|
    | Cluster | The URL for the help cluster. For other clusters, the URL is in the form *https://\<ClusterName\>.\<Region\>.kusto.windows.net*. | *https://help.kusto.windows.net* |
    | Database | A database that is hosted on the cluster you're connecting to. You can optionally select a database in a later step. | Leave blank |
    | Table name | The name of a table in the database, or a query like <code>StormEvents \| take 1000</code>. You can optionally select a table name in a later step. | Leave blank |
    | Advanced options | Optionally, you can select options for your queries, such as result set size. |  Leave blank |
    | Data connectivity mode | Determines whether Power BI imports the data or connects directly to the data source. You can use either option with this connector. For more information, see [Connectivity modes](#connectivity-modes). | *DirectQuery* |

    **Advanced options**

    | Setting | Field description | Sample value |
    |---|---|---|
    | Limit query result record number| The maximum number of records to return in the result |`1000000` |
    | Limit query result data size | The maximum data size in bytes to return in the result | `100000000` |
    | Disable result set truncation | Enable/disable result truncation by using the notruncation request option | `true` |
    | Additional set statements | Sets query options for the duration of the query. Query options control how a query executes and returns results. | `set query_datascope=hotcache` |

1. On the **Navigator** screen, expand the **Samples** database, select **StormEvents**, and then select **Load Data**.

    Optionally, if you want to shape your data first, select **Transform data** to launch Power Query Editor. For more information, see [Shape data](/power-bi/fundamentals/desktop-getting-started?source=recommendations&branch=main#shape-data).

    :::image type="content" source="media/power-bi-data-connector/select-table.png" alt-text="Screenshot of Navigator screen, showing that the StormEvents table is selected. The Load button is highlighted.":::

[Tips for using the Azure Data Explorer connector for Power BI to query data](power-bi-best-practices.md#tips-for-using-the-azure-data-explorer-connector-for-power-bi-to-query-data).

---

## Next steps

[Create reports and dashboards in Power BI](/power-bi/create-reports/).
