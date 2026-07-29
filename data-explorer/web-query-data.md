---
title: 'Quickstart: Query sample data in the Azure Data Explorer web UI'
description: In this quickstart, you learn how to query and share sample data in the Azure Data Explorer web UI.
ms.reviewer: olgolden
ms.topic: quickstart
ms.date: 07/23/2026
ms.custom: mode-portal
ai-usage: ai-assisted

#Customer intent: As a user of Azure Data Explorer, I want to query data in the web UI and share it. This allows me to understand my data and share analysis with colleagues.
---
# Quickstart: Query sample data in the Azure Data Explorer web UI

In this quickstart, you learn how to query data in the stand-alone Azure Data Explorer web UI. Azure Data Explorer provides a web experience that connects to your Azure Data Explorer clusters so you can write, run, and share [Kusto Query Language (KQL)](/kusto/query/index?view=azure-data-explorer&preserve-view=true) commands and queries. You can access the web experience in the Azure portal or as a stand-alone web application, the [Azure Data Explorer web UI](https://dataexplorer.azure.com).

In the Azure Data Explorer web UI, the query editor provides suggestions and warnings as you write your queries. To customize which suggestions and warnings you receive, see [Set query recommendations](web-customize-settings.md#set-query-recommendations).

In this quickstart, you:

> [!div class="checklist"]
> * Add a cluster connection.
> * Run KQL queries against sample data.
> * Format a query and render a chart.
> * Provide feedback and clean up resources.

## Prerequisites

Before you begin, make sure you have the following items:

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Add clusters

When you first open the web UI, on the **Query** page, you see a connection to the **help** cluster. The examples in this quickstart use the `StormEvents` table in the `Samples` database of the **help** cluster.

To run queries on a different cluster, add a connection to that cluster. To add a new cluster connection, follow these steps:

1. On the left menu, select **Query**.
1. In the upper left pane, select **Add connection**.
1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**.
1. Select **Add** to add the connection.

If you don't see the **help** cluster, add it by using the preceding steps and enter `help` as the **Connection URI**.

## Run a query

To run a query, select the database where you want to run the query to set the query context.

1. In the **Cluster connection** pane, under the **help** cluster, select the **Samples** database.
    :::image type="content" source="media/web-query-data/samples-db-context.png" alt-text="Screenshot of the Samples database selected.":::
1. Copy and paste the following query into the query window. At the top of the window, select **Run**.

    > [!div class="nextstepaction"]
    > [Run the query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM4vKlFIqlQILkksKgnJzE1VSEktTgZKlCRmpyoYGgAAl2udPi4AAAA=)

    ```kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    This query returns the 10 newest records in the **StormEvents** table. The result should look like the following table.

    :::image type="content" source="media/web-query-data/result-set-take-10.png" alt-text="Screenshot of a table that lists data for 10 storm events in the Azure Data Explorer web UI." border="false":::

1. Copy and paste the following query into the query window, below the first query. Notice how it isn't formatted on separate lines like the first query.

    > [!div class="nextstepaction"]
    > [Run the query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0WMQQrDMBAD73mFHtBD+4fmWgrJB7bxUtzirFmLgCGP74YeotNIA5poXsZNVzbsaObEq2OiOOdcFEnbggGRHdXtowtPe8G4pj/ExqMfT3OvgXcp8tanW1VnD1Vzs6QPcRfmTeOQ8lXcrj+ZB1DRhAAAAA==)

    ```kusto
    StormEvents | sort by StartTime desc 
    | project StartTime, EndTime, State, EventType, DamageProperty, EpisodeNarrative | take 10
    ```

1. Select the new query. Press **Shift+Alt+F** to format the query so it looks like the following query.

    :::image type="content" source="media/web-query-data/formatted-query.png" alt-text="Screenshot of a query with the correct formatting.":::

1. Select **Run** or press **Shift+Enter** to run the query. This query returns the same records as the first one, but includes only the columns specified in the `project` statement. The result should look like the following table.

    :::image type="content" source="media/web-query-data/result-set-project.png" alt-text="Screenshot of a table that lists the start time, end time, state, event type, damage property, and episode narrative for 10 storm events in the Azure Data Explorer web UI." border="false":::

    > [!TIP]
    > Select **Recall** at the top of the query window to show the result set from the first query without having to rerun the query. Often during analysis, you run multiple queries, and **Recall** lets you retrieve the results of previous queries.

1. Run one more query to see a different type of output.

    > [!div class="nextstepaction"]
    > [Run the query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMsQ7CQAxDd74iYyt1KBtLGZDY2PoBKFyj9hBJUJprBeLjuYMFFkv2s927Gh8XEp83L5gTM1p8ElCJzkGTePfRqm6A4wAd4DJWBxqjnNBruDygd3QqazUvPteyWyeyvx/Yw3bXthndTa8U/DtsfjsZGslABkFviSVMaP4GmKtNLqQAAAA=)

    ```kusto
    StormEvents
    | summarize event_count=count(), mid = avg(BeginLat) by State
    | sort by mid
    | where event_count > 1800
    | project State, event_count
    | render columnchart
    ```

    The result should look like the following chart.

    :::image type="content" source="media/web-query-data/column-chart.png" alt-text="Screenshot of a column chart as output from a query.":::

    > [!NOTE]
    > Blank lines in the query expression can affect which part of the query runs.
    >
    > * If you don't select any text, the query or command is assumed to be separated by empty lines.
    > * If you select text, the selected text runs.

## Provide feedback

To provide feedback, follow these steps:

1. In the upper right of the application, select the feedback icon :::image type="icon" source="media/web-query-data/icon-feedback.png" border="false":::.
1. Enter your feedback, then select **Submit**.

## Clean up resources

You didn't create any resources in this quickstart. To remove one or both clusters from the application, right-click the cluster and select **Remove connection**. Another option is to select **Clear local state** on the **Settings** > **General** tab. This action removes all cluster connections and closes all open query tabs.

## Related content

* [Web UI query overview](web-ui-query-overview.md)
* [Web UI results grid](web-results-grid.md)
* [Customize settings in the web UI](web-customize-settings.md)
