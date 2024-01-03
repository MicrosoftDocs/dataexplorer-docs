---
title: Visualize data from Azure Data Explorer by using Grafana
description: In this article, you learn to set up Azure Data Explorer as a data source for Grafana, and then visualize data from a sample cluster.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 06/27/2023
---

# Visualize data from Azure Data Explorer in Grafana

Grafana is an analytics platform where you can query and visualize data, and then create and share dashboards based on your visualizations. Grafana provides an Azure Data Explorer *plug-in*, which enables you to connect to and visualize data from Azure Data Explorer. The plug-in works with both [Azure Managed Grafana](/azure/managed-grafana/overview) and self-hosted Grafana.

In this article, you learn how to [configure your cluster as a data source for Grafana](#configure-the-data-source) and [visualize data in Grafana](#visualize-data) for Azure Managed Grafana and self-hosted Grafana. To follow along with the examples in this article, [ingest the StormEvents sample data](ingest-sample-data.md). [!INCLUDE [data-explorer-storm-events](includes/data-explorer-storm-events.md)]

## Prerequisites

* For Azure Managed Grafana, an Azure account and [Azure Managed Grafana](/azure/managed-grafana/quickstart-managed-grafana-portal) instance.
* For self-hosted Grafana, [Grafana version 5.3.0 or later](https://docs.grafana.org/installation/) for your operating system and the [Azure Data Explorer plug-in](https://grafana.com/grafana/plugins/grafana-azure-data-explorer-datasource/) for Grafana. You need plug-in version 3.0.5 or later to use the Grafana query builder.
* An Azure Data Explorer cluster and database. You can [create a free cluster](start-for-free-web-ui.md) or [create a full cluster](create-cluster-database-portal.md). To decide which is best for you, check the [feature comparison](start-for-free.md#feature-comparison).

## Configure the data source

To configure Azure Data Explorer as a data source, follow the steps for your Grafana environment.

### [Azure Managed Grafana](#tab/azure-managed-grafana)

#### Add the managed identity to the Viewer role

Managed Grafana creates a system-assigned managed identity for each new workspace, by default. You can use it to access your Azure Data Explorer cluster.

1. In the Azure portal, go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database that has the *StormEvents* sample data.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/select-database.png" alt-text="Screenshot of the Azure Data Explorer overview page and the selection of a sample database.":::

1. Select **Permissions** > **Add** > **Viewer**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/database-permissions.png" alt-text="Screenshot of the permissions page with the Add button highlighted.":::

1. In the search box, enter your Managed Grafana workspace name.

1. In the search results, select the result that matches your workspace name, and then choose **Select**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/add-managed-identity.png" alt-text="Screenshot of the pane for new principals and a selected workspace name.":::

#### Set up Azure Data Explorer as a Grafana data source

Managed Grafana workspaces come with the Azure Data Explorer plug-in preinstalled.

1. In the Azure portal, go to your Managed Grafana workspace.

1. Under **Overview**, select the **Endpoint** link to open the Grafana UI.

1. In Grafana, on the left menu, select the gear icon. Then select **Data Sources**.

    :::image type="content" source="media/grafana/data-sources.png" alt-text="Screenshot of the Grafana settings menu and the option for data sources.":::

1. Select **Azure Data Explorer Datasource**.

    :::image type="content" source="media/grafana/managed-grafana-data-sources.png" alt-text="Screenshot of the data sources page with the Azure Data Explorer source highlighted." lightbox="media/grafana/managed-grafana-data-sources.png":::

1. In **Connection Details**, enter your Azure Data Explorer cluster URL.

    :::image type="content" source="media/grafana/input-cluster-uri.png" alt-text="Screenshot of the pane for connection details with the box for cluster URL highlighted.":::

1. Select **Save & Test**.

### [Self-hosted Grafana](#tab/self-hosted-grafana)

#### Create a service principal

You can create the service principal in the [Azure portal](#azure-portal) or by using the [Azure CLI](#azure-cli) command-line experience. After you create the service principal, you get values for four connection properties that you'll use in later steps.

##### Azure portal

1. Follow the instructions in the [Azure portal documentation](/azure/active-directory/develop/howto-create-service-principal-portal). Use this specific information:

    1. In the [Assign the application to a role](/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) section, assign a role type of **Reader** to your Azure Data Explorer cluster.

    1. In the [Get values for signing in](/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section, copy the values for the three properties covered in the steps: **Directory ID** (tenant ID), **Application ID**, and **Password**.

1. In the Azure portal, select **Subscriptions**. Then copy the ID for the subscription in which you created the service principal.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/subscription-id-portal.png" alt-text="Screenshot of the subscriptions page and with the subscription ID highlighted.":::

##### Azure CLI

1. Use the following command to create a service principal. Set an appropriate scope and a role type of `reader`.

    ```azurecli
    az ad sp create-for-rbac --name "https://{UrlToYourDashboard}:{PortNumber}" --role "reader" \
                             --scopes /subscriptions/{SubID}/resourceGroups/{ResourceGroupName}
    ```

    For more information, see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

1. The command returns a result set like the following example. Copy the values for the `appId`, `password`, and `tenant` properties.

    ```json
    {
      "appId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      "displayName": "{UrlToYourDashboard}:{PortNumber}",
      "name": "https://{UrlToYourDashboard}:{PortNumber}",
      "password": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
      "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    }
    ```

1. Get a list of your subscriptions:

    ```azurecli
    az account list --output table
    ```

    Copy the appropriate subscription ID.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/subscription-id-cli.png" alt-text="Screenshot of the Azure CLI command output with the subscription ID highlighted.":::

#### Add the service principal to the Viewer role

Now that you have a service principal, you add it to the *Viewer* role in the Azure Data Explorer database. You can perform this task under **Permissions** in the Azure portal, or under **Query** by using a management command.

##### Azure portal: Permissions

1. In the Azure portal, go to your Azure Data Explorer cluster.

1. In the **Overview** section, select the database that has the StormEvents sample data.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/select-database.png" alt-text="Screenshot of the Azure Data Explorer overview page and the selection of a sample database.":::

1. Select **Permissions** > **Add**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/database-permissions.png" alt-text="Screenshot of the permissions pane with the Add button highlighted.":::

1. Under **Add Database Permissions**, select the **Viewer** role, and then choose **Select principals**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/add-permission.png" alt-text="Screenshot of the pane for adding database permissions for the Viewer role.":::

1. Search for the service principal that you created. Select the principal, and then choose **Select**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/new-principals.png" alt-text="Screenshot of the New Principals pane with a selected service principal." border="false":::

1. Select **Save**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/save-permission.png" alt-text="Screenshot of the Add Database Permissions pane with the Save button highlighted." border="false":::

##### Management command: Query

1. In the Azure portal, go to your Azure Data Explorer cluster, and then select **Query**.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/query.png" alt-text="Screenshot of a cluster in the Azure portal, with the Query item highlighted." border="false":::

1. Run the following command in the query window. Use the application ID and tenant ID from the Azure portal or the Azure CLI.

    ```kusto
    .add database {TestDatabase} viewers ('aadapp={ApplicationID};{TenantID}')
    ```

    The command returns a result set. In the following example, the first row is for an existing user in the database. The second row is for the service principal that you just added.

    :::image type="content" source="includes/media/data-explorer-configure-data-source/result-set.png" alt-text="Screenshot of a result set of the command to add a service principal to the Viewer role.":::

#### Specify properties and test the connection

With the service principal assigned to the *Viewer* role, you now specify properties in your instance of Grafana and test the connection to Azure Data Explorer.

1. In Grafana, on the left menu, select the gear icon. Then select **Data Sources**.

    :::image type="content" source="media/grafana/data-sources.png" alt-text="Screenshot of the Grafana settings menu with the data sources option highlighted.":::

1. Select **Add data source**.

1. On the **Data Sources / New** page, enter a name for the data source, and then select the type **Azure Data Explorer Datasource**.

    :::image type="content" source="media/grafana/connection-name-type.png" alt-text="Screenshot that shows entering a name and a type for a data source.":::

1. In **Settings** > **Connection details**, enter the name of your cluster in the form `https://{ClusterName}.{Region}.kusto.windows.net`. Enter the other values from the Azure portal or the Azure CLI. Use the following mapping information as a guide.

    | Grafana UI | Azure portal | Azure CLI |
    | --- | --- | --- |
    | **Subscription Id** | **SUBSCRIPTION ID** | `SubscriptionId` |
    | **Tenant Id** | **Directory ID** | `tenant` |
    | **Client Id** | **Application ID** | `appId` |
    | **Client secret** | **Password** | `password` |
    | | | |

    :::image type="content" source="media/grafana/connection-properties.png" alt-text="Screenshot of the boxes for data source connection properties.":::

1. Select **Save & Test**.

    If the test is successful, go to the next section. If you have any problems, check the values that you specified in Grafana and review the previous steps.

#### Optimize queries

You can use two features for query optimization:

* [Optimize dashboard query rendering performance](#optimize-dashboard-query-rendering-performance)
* [Enable weak consistency](#enable-weak-consistency)

To perform the optimization, in **Data Sources** > **Settings** > **Query Optimizations**, make the needed changes.

:::image type="content" source="media/grafana/query-optimization.PNG" alt-text="Screenshot that shows properties that can be configured on the query optimization pane.":::

##### Optimize dashboard query rendering performance

When a dashboard or visual is rendered more than once by one or more users, Grafana sends at least one query to Azure Data Explorer by default. Enable [Query results caching](kusto/query/query-results-cache.md) to improve dashboard rendering performance and to reduce load on the Azure Data Explorer cluster.

During the specified time range, Azure Data Explorer will use the results cache to retrieve the previous results and won't run an unnecessary query. This capability is especially effective in reducing load on resources and improving performance when multiple users are using the same dashboard.

To enable results cache rendering, do the following on the **Query Optimizations** pane:

1. Turn off **Use dynamic caching**.
1. In **Cache Max Age**, enter the number of minutes during which you want to use cached results.

##### Enable weak consistency

Clusters are configured with strong consistency. This default configuration guarantees that query results are up to date with all changes in the cluster.

When you enable weak consistency, query results can have a lag of 1 to 2 minutes after cluster alterations. However, weak consistency might boost visual rendering time. If immediate consistency isn't critical and performance is marginal, enable weak consistency to improve performance. For more information, see [Query consistency](kusto/concepts/queryconsistency.md).

To enable weak consistency, on the **Query Optimizations** pane, select **Data consistency** > **Weak**.

---

## Visualize data

You finished configuring Azure Data Explorer as a data source for Grafana. Now it's time to visualize data.

The following basic example uses both the query builder mode and the raw mode of the query editor. We recommend that you view [write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) for examples of other queries to run against the dataset.

1. In Grafana, on the left menu, select the plus icon. Then select **Dashboard**.

    :::image type="content" source="media/grafana/create-dashboard.png" alt-text="Screenshot of the Grafana settings menu with the dashboard option highlighted.":::

1. Under the **Add** tab, select **Graph**.

    :::image type="content" source="media/grafana/add-graph.png" alt-text="Screenshot of the page for adding a panel, with the graph option highlighted.":::

1. On the graph pane, select **Panel Title** > **Edit**.

    :::image type="content" source="media/grafana/edit-panel.png" alt-text="Screenshot of the Grafana panel menu, with the edit option highlighted.":::

1. At the bottom of the pane, select **Data Source**, and then select the data source that you configured.

    :::image type="content" source="media/grafana/select-data-source.png" alt-text="Screenshot of the menu for selecting a data source.":::

### Query builder mode

Use query builder mode to define your query.

1. Below the data source, select **Database** and choose your database from the dropdown list.
1. Select **From** and choose your table from the dropdown list.

    :::image type="content" source="media/grafana/query-builder-from-table.png" alt-text="Screenshot of the query builder that shows choosing a table from a list of samples.":::

1. Now that the table is defined, filter the data:

    1. Select **+** to the right of **Where (filter)** to select one or more columns in your table.
    1. For each filter, define the values by using the applicable operator. This selection is similar to using the [where operator](kusto/query/whereoperator.md) in Kusto Query Language.

1. Select the values to present in the table:

    1. Select **+** to the right of **Value columns** to select the value columns that will appear on the pane.
    1. For each value column, set the aggregation type.

       You can set one or more value columns. This selection is equivalent to using the [summarize operator](kusto/query/summarize-operator.md).

1. Select **+** to the right of **Group by (summarize)** to select one or more columns that will be used to arrange the values into groups. This selection is equivalent to the group expression in the `summarize` operator.

1. Select **Run Query**.

    :::image type="content" source="media/grafana/query-builder-all-values.png" alt-text="Screenshot of the query builder with all values completed.":::

    > [!TIP]
    > While you're finalizing the settings in the query builder, a Kusto Query Language query is created. This query shows the logic that you constructed by using the graphical query editor.

1. Select **Edit KQL** to move to raw mode. Edit your query by using the flexibility and power of the Kusto Query Language.

:::image type="content" source="media/grafana/query-builder-with-raw-query.png" alt-text="Screenshot of a raw query in the query builder.":::

### Raw mode

Use raw mode to edit your query.

1. On the query pane, paste the following query, and then select **Run**. The query buckets the count of events by day for the sample dataset.

    ```kusto
    StormEvents
    | summarize event_count=count() by bin(StartTime, 1d)
    ```

    :::image type="content" source="media/grafana/run-query.png" alt-text="Screenshot of the query window, with the button for running a query highlighted.":::

1. The graph doesn't show any results because it's scoped (by default) to data from the last six hours. On the top menu, select **Last 6 hours**.

    :::image type="content" source="media/grafana/last-six-hours.png" alt-text="Screenshot of the default time filter of last six hours.":::

1. Specify a custom range that covers 2007, the year included in the StormEvents sample dataset. Then select **Apply**.

    :::image type="content" source="media/grafana/custom-date-range.png" alt-text="Screenshot of the custom range control, with a custom date range selected.":::

    Now the graph shows the data from 2007, bucketed by day.

    :::image type="content" source="media/grafana/finished-graph.png" alt-text="Screenshot of a finished graph on the graph panel.":::

1. On the top menu, select the save icon: :::image type="icon" source="media/grafana/save-icon.png":::.

To switch to the query builder mode, select **Switch to builder**. Grafana will convert the query to the available logic in the query builder. The query builder logic is limited, so you might lose manual changes that you made to the query.

:::image type="content" source="media/grafana/raw-mode.png" alt-text="Screenshot of the query window, with the button for switching to the builder highlighted.":::

## Create alerts

1. In **Home Dashboard**, select **Alerting** > **Notification channels** to create a new notification channel.

    :::image type="content" source="media/grafana/create-notification-channel.png" alt-text="Screenshot of the dashboard, with the option for creating a notification channel highlighted.":::

1. Enter a name and type under **New Notification Channel**, and then select **Save**.

    :::image type="content" source="media/grafana/new-notification-channel-adx.png" alt-text="Screenshot of the window for creating a new notification channel.":::

1. On the dashboard, select **Edit** from the dropdown list.

    :::image type="content" source="media/grafana/edit-panel-4-alert.png" alt-text="Screenshot of the dashboard panel, with the Edit menu command highlighted.":::

1. Select the alert bell icon to open the **Alert** pane. Select **Create Alert**, and then complete the properties for the alert.

    :::image type="content" source="media/grafana/alert-properties.png" alt-text="Screenshot of the pane for selecting alert properties.":::

1. Select the **Save dashboard** icon to save your changes.

## Related content

* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
