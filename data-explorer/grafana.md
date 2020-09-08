---
title: Visualize data from Azure Data Explorer using Grafana
description: In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 11/13/2019
---

# Visualize data from Azure Data Explorer in Grafana

Grafana is an analytics platform that enables you to query and visualize data, then create and share dashboards based on your visualizations. Grafana provides an Azure Data Explorer *plugin*, which enables you to connect to and visualize data from Azure Data Explorer. In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.

Use the following video, to learn how to use Grafana's Azure Data Explorer plugin, set up Azure Data Explorer as a data source for Grafana, and then visualize data. 

> [!VIDEO https://www.youtube.com/embed/fSR_qCIFZSA]

Alternatively you can [configure the data source](#configure-the-data-source) and [visualize data](#visualize-data) as detailed in the article below.

## Prerequisites

You need the following to complete this article:

* [Grafana version 5.3.0 or later](https://docs.grafana.org/installation/) for your operating system

* The [Azure Data Explorer plugin](https://grafana.com/plugins/grafana-azure-data-explorer-datasource/installation) for Grafana
For using Grafana query editor, Azure Data Explorer plugin version 3.0.5 or later is required.

* A cluster that includes the StormEvents sample data. For  more information, see [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md) and [Ingest sample data into Azure Data Explorer](ingest-sample-data.md).

    [!INCLUDE [data-explorer-storm-events](includes/data-explorer-storm-events.md)]

[!INCLUDE [data-explorer-configure-data-source](includes/data-explorer-configure-data-source.md)]

### Specify properties and test the connection

With the service principal assigned to the *viewers* role, you now specify properties in your instance of Grafana, and test the connection to Azure Data Explorer.

1. In Grafana, on the left menu, select the gear icon then **Data Sources**.

    ![Data sources](media/grafana/data-sources.png)

1. Select **Add data source**.

1. On the **Data Sources / New** page, enter a name for the data source, then select the type **Azure Data Explorer Datasource**.

    ![Connection name and type](media/grafana/connection-name-type.png)

1. Enter the name of your cluster in the form https://{ClusterName}.{Region}.kusto.windows.net. Enter the other values from the Azure portal or CLI. See the table below the following image for a mapping.

    ![Connection properties](media/grafana/connection-properties.png)

    | Grafana UI | Azure portal | Azure CLI |
    | --- | --- | --- |
    | Subscription Id | SUBSCRIPTION ID | SubscriptionId |
    | Tenant Id | Directory ID | tenant |
    | Client Id | Application ID | appId |
    | Client secret | Password | password |
    | | | |

1. Select **Save & Test**.

    If the test is successful, go to the next section. If you come across any issues, check the values you specified in Grafana, and review previous steps.

## Visualize data

Now you've finished configuring Azure Data Explorer as a data source for Grafana, it's time to visualize data. We'll show a basic example here using both the query editor mode and the raw mode. We recommend looking at [Write queries for Azure Data Explorer](write-queries.md) for examples of other queries to run against the sample data set.

1. In Grafana, on the left menu, select the plus icon then **Dashboard**.

    ![Create dashboard](media/grafana/create-dashboard.png)

1. Under the **Add** tab, select **Add new panel**.

    ![Add graph](media/grafana/add-graph.png)

1. On the graph panel, select **Panel Title** then **Edit**.

    ![Edit panel](media/grafana/edit-panel.png)

1. At the bottom of the panel, select **Data Source** then select the data source that you configured.

    ![Select data source](media/grafana/select-data-source.png)
1. Below the data source select the database for the panel.

Query editor mode
Select the table in the "From" dropdown.
Once the table is defined you can use the UI controls to filter the data, select the values to present and define the grouping of those values.

Filter - You can add 1 or more filters by clicking the plus sign to the right of the “Where (filter)” control. When adding a filter, you first need to select the filter column from the auto populated list of columns in the selected table. For each filter you can define the value or values to filter by using the applicable operator. The filter value control is auto populated by sampling the values in the selected filter column.

Value selection - The value control is used for selecting the value columns that will be displayed in the panel.
For each value column the aggregation type needs to be set to show the needed data. One or more value columns can be set.
This is equivalent to using the summarize operator in KQL.

Value grouping - The “Group by” control allows the user to select one or more columns that will be used to arrange the values into the respective groups.
This is equivalent to the group expression in the summarize operator.

To execute the query, select "Run query".
Please note, that while building the panel with the query editor a KQL query is being constructed on the bottom of the page.
The purpose of the query is to show the exact representation of the logic the user constructs with the graphical query editor.
In addition, the user can take the constructed query and further enhance it by clicking the “Edit KQL” button to the left of “Run Query” button.
By clicking the “Edit KQL” the user will move to the “Raw mode”	and will be able to use the flexibility and power of KQL to finetune his query.


Raw mode
1. In the query pane, copy in the following query then select **Run**. The query buckets the count of events by day for the sample data set.

    ```kusto
    StormEvents
    | summarize event_count=count() by bin(StartTime, 1d)
    ```

    ![Run query](media/grafana/run-query.png)

1. The graph doesn't show any results because it's scoped by default to data from the last six hours. On the top menu, select **Last 6 hours**.

    ![Last six hours](media/grafana/last-six-hours.png)

1. Specify a custom range that covers 2007, the year included in our StormEvents sample data set. Select **Apply**.

    ![Custom date range](media/grafana/custom-date-range.png)

    Now the graph shows the data from 2007, bucketed by day.

    ![Finished graph](media/grafana/finished-graph.png)
 1. To switch to Query builder mode, the user can select "Switch to builder" and you'll be prompted a message that Grafana will convert the query to the available logic in the Query editor which is more limited and you might los some of your work as a result.

1. On the top menu, select the save icon: ![Save icon](media/grafana/save-icon.png).

## Create Alerts

1. In Home Dashboard, select **Alerting** > **Notification channels** to create a new notification channel

    ![create notification channel](media/grafana/create-notification-channel.png)

1. Create a new **Notification channel**, then **Save**.

    ![Create new notification channel](media/grafana/new-notification-channel-adx.png)

1. On the **Dashboard**, select **Edit** from the dropdown.

    ![select edit in dashboard](media/grafana/edit-panel-4-alert.png)

1. Select the alert bell icon to open the **Alert** pane. Select **Create Alert**. Complete the following properties in the **Alert** pane.

    ![alert properties](media/grafana/alert-properties.png)

1. Select the **Save dashboard** icon to save your changes.

## Next steps

* [Write queries for Azure Data Explorer](write-queries.md)
