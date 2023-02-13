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

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data. Azure Data Explorer provides a web experience that enables you to connect to your Azure Data Explorer clusters and write, run, and share Kusto Query Language commands and queries. The web experience is available in the Azure portal and as a stand-alone web application, the [Azure Data Explorer web UI](https://dataexplorer.azure.com).
The Azure Data Explorer web UI can also be hosted by other web portals in an HTML iframe. For more information on how to host the Azure Data Explorer web UI and the Monaco editor used, see [Monaco IDE integration](kusto/api/monaco/monaco-kusto.md).
In this quickstart, you'll be working in the stand-alone Azure Data Explorer web UI.

:::image type="content" source="media/web-query-data/walkthrough.gif" alt-text="Walkthrough of the Kusto Web Explorer experience in the Azure Data Explorer web U I.":::

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database.  You can [create a free cluster](start-for-free-web-ui.md), [create a full cluster](create-cluster-database-portal.md),  or use the [help cluster](https://dataexplorer.azure.com/clusters/help). To decide which is best for you, check the [feature comparison](start-for-free.md#feature-comparison).

## Sign in to the application

Sign in to [the application](https://dataexplorer.azure.com/).

## Add clusters

When you first open the application, there are no cluster connections. You must add a connection to a cluster before you can start running queries.

:::image type="content" source="media/web-query-data/add-cluster.png" alt-text="Screenshot of query editor showing where to add a cluster.":::

Follow these steps to add a connection to the publicly-available **help** cluster:

1. On the left menu, select **Query**.
1. In the upper left of the application, select **Add Cluster**.

1. In the **Add cluster** dialog box, enter `help`, then select **Add**.

1. In the **Cluster connection** pane, you should now see the **help** cluster. Expand the **Samples** database and open the **Tables** folder to see the sample tables that you have access to.

    :::image type="content" source="media/web-query-data/help-cluster.png" alt-text="Find table in the help cluster in the Azure Data Explorer web U I.":::

We use the **StormEvents** table later in this quickstart, and in other Azure Data Explorer articles.

## Run queries

You can now run queries on both clusters (assuming you have data in your test cluster). For this article, we'll focus on the **help** cluster.

1. In the **Cluster connection** pane, under the **help** cluster, select the **Samples** database.

1. Copy and paste the following query into the query window. At the top of the window, select **Run**.

    ```kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    This query returns the 10 newest records in the **StormEvents** table. The result should look like the following table.

    :::image type="content" source="media/web-query-data/result-set-take-10.png" alt-text="Screenshot of a table that lists data for 10 storm events in the Azure Data Explorer web U I." border="false":::

    The following image shows the state of the application, with the cluster added, and a query with results.

    :::image type="content" source="media/web-query-data/webui-take10.png" alt-text="Screenshot of query editor window in the Azure Data Explorer web U I.":::

1. Copy and paste the following query into the query window, below the first query. Notice how it isn't formatted on separate lines like the first query.

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

* [Work with the results grid](web-results-grid.md)
* [Customize your Azure Data Explorer settings](web-customize-settings.md)
* [Write queries for Azure Data Explorer](write-queries.md)
* [Share your queries](web-share-queries.md)
