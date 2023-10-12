---
title: 'Quickstart: Query sample data in the Azure Data Explorer web UI'
description: In this quickstart, you'll learn how to query and share sample data in the Azure Data Explorer web UI.
ms.reviewer: olgolden
ms.topic: quickstart
ms.date: 02/01/2021
ms.custom: mode-portal

#Customer intent: As a user of Azure Data Explorer, I want to query data in the Web UI and share data. This will allow me to understand my data and share analysis with colleagues.
---
# Quickstart: Query sample data

Azure Data Explorer provides a web experience that enables you to connect to your Azure Data Explorer clusters and write, run, and share [Kusto Query Language (KQL)](kusto/query/index.md) commands and queries. The web experience is available in the Azure portal and as a stand-alone web application, the [Azure Data Explorer web UI](https://dataexplorer.azure.com). In this quickstart, you'll learn how to query data in the stand-alone Azure Data Explorer web UI.

In the Azure Data Explorer web UI, the query editor provides suggestions and warnings as you write your queries. To customize which suggestions and warnings you receive, see [Set query recommendations](web-customize-settings.md#set-query-recommendations).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Add clusters

When you first open the web UI, in the **Query** page, you should see a connection to the **help** cluster. The examples in this quickstart use the `StormEvents` table in the `Samples` database of the **help** cluster.

If you want to run queries on a different cluster, you must add a connection to that cluster.

To add a new cluster connection, do the following:

1. On the left menu, select **Query**.
1. In the upper left pane, select **Add connection**.
1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**.
1. Select **Add** to add the connection.

If you don't see the **help** cluster, add it using the previous steps. Use "help" as the **Connection URI**.

## Run queries

To run a query, you must select the database on which you want to run the query in order to set the query context.

1. In the **Cluster connection** pane, under the **help** cluster, select the **Samples** database.

    :::image type="content" source="media/web-query-data/samples-db-context.png" alt-text="Screenshot of the Samples database selected.":::

1. Copy and paste the following query into the query window. At the top of the window, select **Run**.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM4vKlFIqlQILkksKgnJzE1VSEktTgZKlCRmpyoYGgAAl2udPi4AAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    This query returns the 10 newest records in the **StormEvents** table. The result should look like the following table.

    :::image type="content" source="media/web-query-data/result-set-take-10.png" alt-text="Screenshot of a table that lists data for 10 storm events in the Azure Data Explorer web U I." border="false":::

1. Copy and paste the following query into the query window, below the first query. Notice how it isn't formatted on separate lines like the first query.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0WMQQrDMBAD73mFHtBD+4fmWgrJB7bxUtzirFmLgCGP74YeotNIA5poXsZNVzbsaObEq2OiOOdcFEnbggGRHdXtowtPe8G4pj/ExqMfT3OvgXcp8tanW1VnD1Vzs6QPcRfmTeOQ8lXcrj+ZB1DRhAAAAA==" target="_blank">Run the query</a>

    ```kusto
    StormEvents | sort by StartTime desc 
    | project StartTime, EndTime, State, EventType, DamageProperty, EpisodeNarrative | take 10
    ```

1. Select the new query. Press *Shift+Alt+F* to format the query, so it looks like the following query.

    :::image type="content" source="media/web-query-data/formatted-query.png" alt-text="Screenshot of a query with the correct formatting.":::

1. Select **Run** or press *Shift+Enter* to run a query. This query returns the same records as the first one, but includes only the columns specified in the `project` statement. The result should look like the following table.

    :::image type="content" source="media/web-query-data/result-set-project.png" alt-text="Screenshot of a table that lists the start time, end time, state, event type, damage property, and episode narrative for 10 storm events in the Azure Data Explorer web U I." border="false":::

    > [!TIP]
    > Select **Recall** at the top of the query window to show the result set from the first query without having to rerun the query. Often during analysis, you run multiple queries, and **Recall** allows you to retrieve the results of previous queries.

1. Let's run one more query to see a different type of output.

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMsQ7CQAxDd74iYyt1KBtLGZDY2PoBKFyj9hBJUJprBeLjuYMFFkv2s927Gh8XEp83L5gTM1p8ElCJzkGTePfRqm6A4wAd4DJWBxqjnNBruDygd3QqazUvPteyWyeyvx/Yw3bXthndTa8U/DtsfjsZGslABkFviSVMaP4GmKtNLqQAAAA=" target="_blank">Run the query</a>

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
    > Blank lines in the query expression can affect which part of the query is executed.
    >
    > * If no text selected, it's assumed that the query or command is separated by empty lines.
    > * If text is selected, the selected text is run.

## Provide feedback

1. In the upper right of the application, select the feedback icon :::image type="icon" source="media/web-query-data/icon-feedback.png" border="false":::.

1. Enter your feedback, then select **Submit**.

## Clean up resources

You didn't create any resources in this quickstart, but if you'd like to remove one or both clusters from the application, right-click the cluster and select **Remove connection**.
Another option is to select **Clear local state** from the **Settings** > **General** tab. This action will remove all cluster connections and close all open query tabs.

## Next steps

* Read the [web UI query overview](web-ui-query-overview.md)
* Explore results with the [web UI results grid](web-results-grid.md)
* [Customize settings in the web UI](web-customize-settings.md)
