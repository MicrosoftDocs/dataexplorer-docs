---
title: Visualize data from Azure Data Explorer using Grafana
description: In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 06/27/2023
---

# Visualize data from Azure Data Explorer in Grafana

Grafana is an analytics platform that enables you to query and visualize data, then create and share dashboards based on your visualizations. Grafana provides an Azure Data Explorer *plugin*, which enables you to connect to and visualize data from Azure Data Explorer. The plugin works with both [Azure Managed Grafana](/azure/managed-grafana/overview) and self-hosted Grafana.

In this article, you learn how to [configure your cluster as a data source for Grafana](#configure-the-data-source) and [visualize data in Grafana](#visualize-data) for Azure Managed Grafana and self-hosted Grafana. To follow along with the examples in this article, [ingest the StormEvents sample data](ingest-sample-data.md). [!INCLUDE [data-explorer-storm-events](includes/data-explorer-storm-events.md)]

## Prerequisites

* For Azure Managed Grafana, an Azure account and [Azure Managed Grafana](/azure/managed-grafana/quickstart-managed-grafana-portal) instance.
* For self-hosted Grafana, [Grafana version 5.3.0 or later](https://docs.grafana.org/installation/) for your operating system and [Azure Data Explorer plugin](https://grafana.com/grafana/plugins/grafana-azure-data-explorer-datasource/) for Grafana. Plugin version 3.0.5 or later is required to use Grafana query builder.
* An Azure Data Explorer cluster and database. You can [create a free cluster](start-for-free-web-ui.md) or [create a full cluster](create-cluster-database-portal.md). To decide which is best for you, check the [feature comparison](start-for-free.md#feature-comparison).

## Configure the data source

To configure Azure Data Explorer as a data source, follow the steps for your Grafana environment.

### [Azure Managed Grafana](#tab/azure-managed-grafana)

#### Add the managed identity to Viewer role

Managed Grafana creates a system-assigned managed identity for each new workspace, by default. You can use it to access your Azure Data Explorer cluster.

1. In the Azure portal, go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database with the *StormEvents* sample data.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/select-database.png" alt-text="Screenshot of the Azure Data Explorer overview page, showing the selection of the sample database - Azure Managed Grafana.":::

1. Select **Permissions** > **Add** > **Viewer**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/database-permissions.png" alt-text="Screenshot of the permissions page with the add button highlighted - Azure Managed Grafana.":::

1. In the search box, enter your Managed Grafana workspace name.

1. In the search results, select the result that matches your workspace name, then **Select**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/add-managed-identity.png" alt-text="Screenshot of the new principals pane, showing the selection the workspace name.":::

#### Set up Azure Data Explorer as a Grafana data source

Managed Grafana workspaces come with The Azure Data Explorer plugin preinstalled.

1. In the Azure portal, go to your Managed Grafana workspace.

1. Under **Overview**, select the **Endpoint** link to open the Grafana UI.

1. In Grafana, on the left menu, select the gear icon, then select **Data Sources**.

    :::image type="content" source="media/grafana/data-sources.png" alt-text="Screenshot of the Grafana settings menu with the data sources option highlighted - Azure Managed Grafana.":::

1. Select **Azure Data Explorer Datasource**.

    :::image type="content" source="media/grafana/managed-grafana-data-sources.png" alt-text="Screenshot of the data sources page with the Azure Data Explorer source highlighted.":::

1. In **Connection Details**, enter your Azure Data Explorer cluster URI.

    :::image type="content" source="media/grafana/input-cluster-uri.png" alt-text="Screenshot of the connection details pane, showing the cluster URI field.":::

1. Select **Save & Test**.

### [Self-hosted Grafana](#tab/self-hosted-grafana)

#### Create a service principal

You can create the service principal in the [Azure portal](#azure-portal) or using the [Azure CLI](#azure-cli) command-line experience. Regardless of which method you use, after creation you get values for four connection properties that you'll use in later steps.

##### Azure portal

1. To create the service principal, follow the instructions in the [Azure portal documentation](/azure/active-directory/develop/howto-create-service-principal-portal).

    1. In the [Assign the application to a role](/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) section, assign a role type of **Reader** to your Azure Data Explorer cluster.

    1. In the [Get values for signing in](/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section, copy the three property values covered in the steps: **Directory ID** (tenant ID), **Application ID**, and **Password**.

1. In the Azure portal, select **Subscriptions** then copy the ID for the subscription in which you created the service principal.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/subscription-id-portal.png" alt-text="Screenshot of the subscriptions page with the Subscription ID highlighted.":::

##### Azure CLI

1. Create a service principal. Set an appropriate scope and a role type of `reader`.

    ```azurecli
    az ad sp create-for-rbac --name "https://{UrlToYourDashboard}:{PortNumber}" --role "reader" \
                             --scopes /subscriptions/{SubID}/resourceGroups/{ResourceGroupName}
    ```

    For more information, see [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

1. The command returns a result set like the following. Copy the three property values: **appID**, **password**, and **tenant**.

    ```json
    {
      "appId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      "displayName": "{UrlToYourDashboard}:{PortNumber}",
      "name": "https://{UrlToYourDashboard}:{PortNumber}",
      "password": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    }
    ```

1. Get a list of your subscriptions.

    ```azurecli
    az account list --output table
    ```

    Copy the appropriate subscription ID.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/subscription-id-cli.png" alt-text="Screenshot of the Azure CLI command output with the Subscription ID highlighted.":::

#### Add the service principal to Viewer role

Now that you have a service principal, you add it to the *viewers* role in the Azure Data Explorer database. You can perform this task under **Permissions** in the Azure portal, or under **Query** by using a management command.

##### Azure portal - Permissions

1. In the Azure portal, go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database with the StormEvents sample data.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/select-database.png" alt-text="Screenshot of the Azure Data Explorer overview page, showing the selection of the sample database - Self-hosted Grafana.":::

1. Select **Permissions** then **Add**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/database-permissions.png" alt-text="Screenshot of the permissions page with the add button highlighted - Self-hosted Grafana.":::

1. Under **Add database permissions**, select the **Viewer** role then **Select principals**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/add-permission.png" alt-text="Screenshot of the Add database permissions page with the Viewer role highlighted.":::

1. Search for the service principal you created. Select the principal, then **Select**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/new-principals.png" alt-text="Screenshot of the New Principals pane with the service principal properties highlighted." border="false":::

1. Select **Save**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/save-permission.png" alt-text="Screenshot of the Add Database Permissions pane with the Save button highlighted." border="false":::

##### Management command - Query

1. In the Azure portal, go to your Azure Data Explorer cluster, and select **Query**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/query.png" alt-text="Screenshot of a cluster in the Azure portal, with the Query item highlighted." border="false":::

1. Run the following command in the query window. Use the application ID and tenant ID from the Azure portal or CLI.

    ```kusto
    .add database {TestDatabase} viewers ('aadapp={ApplicationID};{TenantID}')
    ```

    The command returns a result set like the following. In this example, the first row is for an existing user in the database, and the second row is for the service principal that was just added.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/result-set.png" alt-text="Screenshot of the  Result set returned by the command.":::

#### Specify properties and test the connection

With the service principal assigned to the *viewers* role, you now specify properties in your instance of Grafana, and test the connection to Azure Data Explorer.

1. In Grafana, on the left menu, select the gear icon then **Data Sources**.

    :::image type="content" source="media/grafana/data-sources.png" alt-text="Screenshot of the Grafana settings menu with the data sources option highlighted - self-hosted Grafana.":::

1. Select **Add data source**.

1. On the **Data Sources / New** page, enter a name for the data source, then select the type **Azure Data Explorer Datasource**.

    :::image type="content" source="media/grafana/connection-name-type.png" alt-text="Screenshot of the Settings page, showing the new connection box.":::

1. In **Settings** > **Connection details**, enter the name of your cluster in the form https://{ClusterName}.{Region}.kusto.windows.net. Enter the other values from the Azure portal or CLI. See the table below the following image for a mapping.

    :::image type="content" source="media/grafana/connection-properties.png" alt-text="Screenshot of the data source connection properties page.":::

    | Grafana UI | Azure portal | Azure CLI |
    | --- | --- | --- |
    | Subscription Id | SUBSCRIPTION ID | SubscriptionId |
    | Tenant Id | Directory ID | tenant |
    | Client Id | Application ID | appId |
    | Client secret | Password | password |
    | | | |

1. Select **Save & Test**.

    If the test is successful, go to the next section. If you come across any issues, check the values you specified in Grafana, and review previous steps.

#### Optimize queries

There are two features that can be used for query optimization:

* [Optimize dashboard query rendering performance](#optimize-dashboard-query-rendering-performance-using-query-results-caching)
* [Enable weak consistency](#enable-weak-consistency)

To perform the optimization, in **Data Sources** > **Settings** > **Query Optimizations**, make the needed changes.

:::image type="content" source="media/grafana/query-optimization.PNG" alt-text="Screenshot of the query optimization pane, showing properties that can be configured.":::

##### Optimize dashboard query rendering performance using query results caching

When a dashboard or visual is rendered more than once by one or more users, Grafana, by default, sends at least one query to Azure Data Explorer. Enable [Query results caching](kusto/query/query-results-cache.md) to improve dashboard rendering performance and reduce load on the Azure Data Explorer cluster. During the specified time range, Azure Data Explorer will use the results cache to retrieve the previous results and won't run an unnecessary query. This capability is especially effective in reducing load on resources and improving performance when multiple users are using the same dashboard.

To enable results cache rendering, do the following in the **Query Optimizations** pane:

1. Disable **Use dynamic caching**.
1. In **Cache Max Age**, enter the number of minutes during which you want to use cached results.

##### Enable weak consistency

Clusters are configured with strong consistency. This guarantees that query results are up to date with all changes in the cluster.
When enabling weak consistency, query results can have a 1-2 minutes lag following cluster alterations. On the other hand, weak consistency may boost visual rendering time. Therefore if immediate consistency isn't critical and performance is marginal, enable weak consistency to improve performance. For more information on query consistency, see [Query consistency](kusto/concepts/queryconsistency.md).

To enable weak consistency, in the **Query Optimizations** pane > **Data consistency**, select **Weak**.

---

## Visualize data

Now you've finished configuring Azure Data Explorer as a data source for Grafana, it's time to visualize data. We'll show a basic example using both the query builder mode and the raw mode of the query editor. We recommend looking at [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) for examples of other queries to run against the sample data set.

1. In Grafana, on the left menu, select the plus icon then **Dashboard**.

    :::image type="content" source="media/grafana/create-dashboard.png" alt-text="Screenshot of the Grafana settings menu with the dashboard option highlighted.":::

1. Under the **Add** tab, select **Add new pane**.

    :::image type="content" source="media/grafana/add-graph.png" alt-text="Screenshot of the Add panel page, with the graph option highlighted.":::

1. On the graph pane, select **pane Title** then **Edit**.

    :::image type="content" source="media/grafana/edit-panel.png" alt-text="Screenshot of the Grafana panel menu with the edit option highlighted.":::

1. At the bottom of the pane, select **Data Source** then select the data source that you configured.

    :::image type="content" source="media/grafana/select-data-source.png" alt-text="Screenshot of the Select data source menu.":::

### Query builder mode

The query editor has two modes. The query builder mode and raw mode. Use the query builder mode to define your query.

1. Below the data source, select **Database** and choose your database from the drop-down.
1. Select **From** and choose your table from the drop-down.

    :::image type="content" source="media/grafana/query-builder-from-table.png" alt-text="Screenshot of the query builder with the query option highlighted.":::

1. Once the table is defined, filter the data, select the values to present, and define the grouping of those values.

    **Filter**

    1. Click **+** to right of **Where (filter)** to select from the drop-down one or more columns in your table.
    1. For each filter, define the value(s) by using the applicable operator.
    This selection is similar to using the [where operator](kusto/query/whereoperator.md) in Kusto Query Language.

    **Value selection**

    1. Click **+** to right of **value columns** to select from the drop-down the value columns that will be displayed in the pane.
    1. For each value column, set the aggregation type.
    One or more value columns can be set. This selection is equivalent to using the [summarize operator](kusto/query/summarizeoperator.md).

    **Value grouping**

    Click **+** to right of **Group by (summarize)** to select from the drop-down one or more columns that will be used to arrange the values into groups. This is equivalent to the group expression in the summarize operator.

1. To execute the query, select **Run query**.

    :::image type="content" source="media/grafana/query-builder-all-values.png" alt-text="Screenshot of the Query builder with all values completed.":::

    > [!TIP]
    > While finalizing the settings in the query builder, a Kusto Query Language query is created. This query shows the logic you constructed with the graphical query editor.

1. Select **Edit KQL** to move to raw mode and edit your query using the flexibility and power of the Kusto Query Language.

:::image type="content" source="media/grafana/query-builder-with-raw-query.png" alt-text="Screenshot of the Query builder, showing a raw query.":::

### Raw mode

Use raw mode to edit your query.

1. In the query pane, copy in the following query then select **Run Query**. The query buckets the count of events by day for the sample data set.

    ```kusto
    StormEvents
    | summarize event_count=count() by bin(StartTime, 1d)
    ```

    :::image type="content" source="media/grafana/run-query.png" alt-text="Screenshot of the query window, with the Run query button highlighted.":::

1. The graph doesn't show any results because it's scoped by default to data from the last six hours. On the top menu, select **Last 6 hours**.

    :::image type="content" source="media/grafana/last-six-hours.png" alt-text="Scrrenshot of the time filter selections, with Last six hours highlighted.":::

1. Specify a custom range that covers 2007, the year included in our StormEvents sample data set. Select **Apply**.

    :::image type="content" source="media/grafana/custom-date-range.png" alt-text="Screenshot of the custom range control, with a Custom date range highlighted.":::

    Now the graph shows the data from 2007, bucketed by day.

    :::image type="content" source="media/grafana/finished-graph.png" alt-text="Screenshot of the graph panel, showing the finished graph.":::

1. On the top menu, select the save icon: :::image type="icon" source="media/grafana/save-icon.png":::.

> [!IMPORTANT]
> To switch to the query builder mode, select **Switch to builder**. Grafana will convert the query to the available logic in the Query builder. The query builder logic is limited and therefore you may lose manual changes done to the query.

:::image type="content" source="media/grafana/raw-mode.png" alt-text="Screenshot of the query window with the switch to builder button highlighted.":::

## Create Alerts

1. In Home Dashboard, select **Alerting** > **Notification channels** to create a new notification channel

    :::image type="content" source="media/grafana/create-notification-channel.png" alt-text="Screenshot of the dashboard with the create notification channel option highlighted.":::

1. Create a new **Notification channel**, then **Save**.

    :::image type="content" source="media/grafana/new-notification-channel-adx.png" alt-text="Screenshot of the Create new notification channel window with the name and type properties highlighted.":::

1. On the **Dashboard**, select **Edit** from the dropdown.

    :::image type="content" source="media/grafana/edit-panel-4-alert.png" alt-text="Screenshot of the dashboard panel, with the edit button highlighted.":::

1. Select the alert bell icon to open the **Alert** pane. Select **Create Alert**. Complete the following properties in the **Alert** pane.

    :::image type="content" source="media/grafana/alert-properties.png" alt-text="Screenshot of the alert window, showing the alert properties.":::

1. Select the **Save dashboard** icon to save your changes.

## Next steps

* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
