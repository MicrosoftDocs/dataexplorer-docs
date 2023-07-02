---
title: Visualize data from Azure Data Explorer using Grafana
description: In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 01/05/2021
---

# Visualize data from Azure Data Explorer in Grafana

Grafana is an analytics platform that enables you to query and visualize data, then create and share dashboards based on your visualizations. Grafana provides an Azure Data Explorer *plugin*, which enables you to connect to and visualize data from Azure Data Explorer. In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.

Use the following video, to learn how to use Grafana's Azure Data Explorer plugin, set up Azure Data Explorer as a data source for Grafana, and then visualize data. 

> [!VIDEO https://www.youtube.com/embed/fSR_qCIFZSA]

Instead you can [configure the data source](#configure-the-data-source) and [visualize data](#visualize-data) as detailed in the article below.

## Prerequisites

* [Grafana version 5.3.0 or later](https://docs.grafana.org/installation/) for your operating system
* The [Azure Data Explorer plugin](https://grafana.com/grafana/plugins/grafana-azure-data-explorer-datasource/) for Grafana. Plugin version 3.0.5 or later is required to use Grafana query builder.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-database-quickstart.md)
* To follow along with the examples in this tutorial, [ingest the StormEvents sample data](ingest-sample-data.md).

[!INCLUDE [data-explorer-storm-events](includes/data-explorer-storm-events.md)]

[!INCLUDE [data-explorer-configure-data-source](includes/data-explorer-configure-data-source.md)]

### Specify properties and test the connection

With the service principal assigned to the *viewers* role, you now specify properties in your instance of Grafana, and test the connection to Azure Data Explorer.

1. In Grafana, on the left menu, select the gear icon then **Data Sources**.

    ![Data sources.](media/grafana/data-sources.png)

1. Select **Add data source**.

1. On the **Data Sources / New** page, enter a name for the data source, then select the type **Azure Data Explorer Datasource**.

    ![Connection name and type.](media/grafana/connection-name-type.png)

1. In **Settings** > **Connection details**, enter the name of your cluster in the form https://{ClusterName}.{Region}.kusto.windows.net. Enter the other values from the Azure portal or CLI. See the table below the following image for a mapping.

    ![Connection properties.](media/grafana/connection-properties.png)

    | Grafana UI | Azure portal | Azure CLI |
    | --- | --- | --- |
    | Subscription Id | SUBSCRIPTION ID | SubscriptionId |
    | Tenant Id | Directory ID | tenant |
    | Client Id | Application ID | appId |
    | Client secret | Password | password |
    | | | |

1. Select **Save & Test**.

    If the test is successful, go to the next section. If you come across any issues, check the values you specified in Grafana, and review previous steps.

### Optimize queries

There are two features that can be used for query optimization:
* [Optimize dashboard query rendering performance](#optimize-dashboard-query-rendering-performance-using-query-results-caching)
* [Enable weak consistency](#enable-weak-consistency)

To perform the optimization, in **Data Sources** > **Settings** > **Query Optimizations**, make the needed changes.

:::image type="content" source="media/grafana/query-optimization.PNG" alt-text="Query optimization pane.":::

#### Optimize dashboard query rendering performance using query results caching 

When a dashboard or visual is rendered more than once by one or more users, Grafana, by default, sends at least one query to Azure Data Explorer. Enable [Query results caching](kusto/query/query-results-cache.md) to improve dashboard rendering performance and reduce load on the Azure Data Explorer cluster. During the specified time range, Azure Data Explorer will use the results cache to retrieve the previous results and won't run an unnecessary query. This capability is especially effective in reducing load on resources and improving performance when multiple users are using the same dashboard.

To enable results cache rendering, do the following in the **Query Optimizations** pane:
1. Disable **Use dynamic caching**. 
1. In **Cache Max Age**, enter the number of minutes during which you want to use cached results.

#### Enable weak consistency

Clusters are configured with strong consistency. This guarantees that query results are up to date with all changes in the cluster.
When enabling weak consistency, query results can have a 1-2 minutes lag following cluster alterations. On the other hand, weak consistency may boost visual rendering time. Therefore if immediate consistency isn't critical and performance is marginal, enable weak consistency to improve performance. For more information on query consistency, see [Query consistency](kusto/concepts/queryconsistency.md).

To enable weak consistency, in the **Query Optimizations** pane > **Data consistency**, select **Weak**.

## Visualize data

Now you've finished configuring Azure Data Explorer as a data source for Grafana, it's time to visualize data. We'll show a basic example using both the query builder mode and the raw mode of the query editor. We recommend looking at [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) for examples of other queries to run against the sample data set.

1. In Grafana, on the left menu, select the plus icon then **Dashboard**.

    ![Create dashboard.](media/grafana/create-dashboard.png)

1. Under the **Add** tab, select **Add new panel**.

    ![Add graph.](media/grafana/add-graph.png)

1. On the graph panel, select **Panel Title** then **Edit**.

    ![Edit panel.](media/grafana/edit-panel.png)

1. At the bottom of the panel, select **Data Source** then select the data source that you configured.

    ![Select data source.](media/grafana/select-data-source.png)

### Query builder mode

The query editor has two modes. The query builder mode and raw mode. Use the query builder mode to define your query.

1. Below the data source, select **Database** and choose your database from the drop-down. 
1. Select **From** and choose your table from the drop-down.

    :::image type="content" source="media/grafana/query-builder-from-table.png" alt-text="Select table in query builder.":::    

1. Once the table is defined, filter the data, select the values to present, and define the grouping of those values.

    **Filter**
    1. Click **+** to right of **Where (filter)** to select from the drop-down one or more columns in your table. 
    1. For each filter, define the value(s) by using the applicable operator. 
    This selection is similar to using the [where operator](kusto/query/whereoperator.md) in Kusto Query Language.

    **Value selection**
    1. Click **+** to right of **value columns** to select from the drop-down the value columns that will be displayed in the panel.
    1. For each value column, set the aggregation type. 
    One or more value columns can be set. This selection is equivalent to using the [summarize operator](kusto/query/summarizeoperator.md).

    **Value grouping** <br> 
    Click **+** to right of **Group by (summarize)** to select from the drop-down one or more columns that will be used to arrange the values into groups. 
    This is equivalent to the group expression in the summarize operator.

1. To execute the query, select **Run query**.

    :::image type="content" source="media/grafana/query-builder-all-values.png" alt-text="Query builder with all values complete.":::

    > [!TIP]
    > While finalizing the settings in the query builder, a Kusto Query Language query is created. This query shows the logic you constructed with the graphical query editor. 

1. Select **Edit KQL** to move to raw mode and edit your query using the flexibility and power of the Kusto Query Language.

:::image type="content" source="media/grafana/query-builder-with-raw-query.png" alt-text="Query builder with raw query.":::

### Raw mode

Use raw mode to edit your query. 

1. In the query pane, copy in the following query then select **Run Query**. The query buckets the count of events by day for the sample data set.

    ```kusto
    StormEvents
    | summarize event_count=count() by bin(StartTime, 1d)
    ```

    ![Run query.](media/grafana/run-query.png)

1. The graph doesn't show any results because it's scoped by default to data from the last six hours. On the top menu, select **Last 6 hours**.

    ![Last six hours.](media/grafana/last-six-hours.png)

1. Specify a custom range that covers 2007, the year included in our StormEvents sample data set. Select **Apply**.

    ![Custom date range.](media/grafana/custom-date-range.png)

    Now the graph shows the data from 2007, bucketed by day.

    ![Finished graph.](media/grafana/finished-graph.png)

1. On the top menu, select the save icon: ![Save icon.](media/grafana/save-icon.png).

> [!IMPORTANT]
> To switch to the query builder mode, select **Switch to builder**. Grafana will convert the query to the available logic in the Query builder. The query builder logic is limited and therefore you may lose manual changes done to the query.

:::image type="content" source="media/grafana/raw-mode.png" alt-text="Move to builder from raw mode.":::

## Create Alerts

1. In Home Dashboard, select **Alerting** > **Notification channels** to create a new notification channel

    ![create notification channel.](media/grafana/create-notification-channel.png)

1. Create a new **Notification channel**, then **Save**.

    ![Create new notification channel.](media/grafana/new-notification-channel-adx.png)

1. On the **Dashboard**, select **Edit** from the dropdown.

    ![select edit in dashboard.](media/grafana/edit-panel-4-alert.png)

1. Select the alert bell icon to open the **Alert** pane. Select **Create Alert**. Complete the following properties in the **Alert** pane.

    ![alert properties.](media/grafana/alert-properties.png)

1. Select the **Save dashboard** icon to save your changes.

## Next steps

* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)