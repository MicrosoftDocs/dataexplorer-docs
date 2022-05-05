---
title: Azure Data Explorer connector for Power Automate
description: Learn about using Azure Data Explorer connector for Power Automate to create flows of automatically scheduled or triggered tasks.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 05/04/2022
---

# Azure Data Explorer connector for Microsoft :::no-loc text="Power Automate":::

The Azure Data Explorer connector for :::no-loc text="Power Automate"::: (previously Microsoft Flow) enables you to orchestrate and schedule flows, send notifications, and alerts, as part of a scheduled or triggered task.

You can:

- Send notifications and alerts based on query results, such as when thresholds exceed certain limits.
- Send regular, such as daily or weekly, reports containing tables and charts.
- Schedule regular jobs using control commands on clusters. For example, copy data from one table to another using the `.set-or-append` command.
- Export and import data between Azure Data Explorer and other databases.

For more information, see [Azure Data Explorer :::no-loc text="Power Automate"::: connector usage examples](flow-usage.md).

## Create a new flow using the Azure Data Explorer connector

To use the connector, you must first add a trigger. You can define a trigger based on a recurring time period, or as a response to a previous flow action.

1. Sign in to [:::no-loc text="Power Automate":::](/power-automate/sign-up-sign-in).

1. [Create a new flow](https://flow.microsoft.com/manage/flows/new), or, from the :::no-loc text="Power Automate"::: home page, select the **My flows** > **+ New flow**.

    :::image type="content" source="media/flow/flow-newflow.png" alt-text="Screenshot of the Power Automate home page, showing My flows and New highlighted.":::

1. Select **Scheduled cloud flow**.

    :::image type="content" source="media/flow/flow-scheduled-from-blank.png" alt-text="Screenshot of New dialog box, showing Scheduled from blank highlighted.":::

1. In **Build a scheduled cloud flow**, enter the required information.

    :::image type="content" source="media/flow/flow-build-scheduled-flow.png" alt-text="Screenshot of Build a scheduled flow page, showing Flow name options highlighted.":::

1. Select **Create** > **+ New step**.
1. In the search box, enter *Kusto* or *Azure Data Explorer*, and select **Azure Data Explorer**.

    :::image type="content" source="media/flow/flow-actions.png" alt-text="Screenshot of Choose an operation window, showing the search box and Azure Data Explorer highlighted.":::

1. Select an action from the list. For an explanation of each action and how to configure them, see [Flow actions](#flow-actions).

    > [!IMPORTANT]
    > You must have a valid Azure Data Explorer [connection for your flow](/power-automate/add-manage-connections) to run. For information about creating a connection, see [Create an Azure Data Explorer connection in :::no-loc text="Power Automate":::](#create-an-azure-data-explorer-connection).

    :::image type="content" source="media/flow/flow-action-list.png" alt-text="Screenshot of the Choose an action list, showing the list of actions highlighted.":::

## Flow actions

When you select the Azure Data Explorer connector, you can choose one of the following actions to add to your flow:

- [Run KQL query](#run-kql-query)
- [Run KQL query and render a chart](#run-kql-query-and-render-a-chart)
- [Run async control command](#run-async-control-command)
- [Run control command and render a chart](#run-control-command-and-render-a-chart)
- [Run show control command](#run-show-control-command)

This section describes the capabilities and parameters for each action and provides an example showing how to add an [email](#email-kusto-query-results) action to any flow.

:::image type="content" source="media/flow/flow-action-list.png" alt-text="Screenshot of Azure Data Explorer connector actions.":::

### Run KQL query

> [!Note]
> If your query starts with a dot (meaning that it's a [control command](kusto/management/index.md)), use [Run control command and render a chart](#run-kql-query-and-render-a-chart).

This action sends a query to the specified cluster. The actions that are added afterwards iterate over each line of the results of the query.

The following example triggers a query every minute, and sends an email based on the query results. The query checks the number of records in the table, and then sends an email only if the number of records is greater than 0.

:::image type="content" source="media/flow/flow-runquerylistresults-2-inline.png" alt-text="Screenshot of Azure Data Explorer connector, showing the Run KQL query action." lightbox="media/flow/flow-runquerylistresults-2.png":::

> [!Note]
> If the column has several records, the connector will run for each record in the column.

### Run KQL query and render a chart

> [!Note]
> If your query starts with a dot (meaning that it's a [control command](kusto/management/index.md)), use [Run control command and render a chart](#run-kql-query-and-render-a-chart).

Use this action to visualize a KQL query result as a table or chart. For example, use this flow to receive daily reports by email.

In this example, the results of the query are returned as a timechart.

:::image type="content" source="media/flow/flow-runquery.png" alt-text="Screenshot of Azure Data Explorer connector, showing the Run KQL query and render a chart action.":::

> [!IMPORTANT]
> In the **Cluster Name** field, enter the cluster URL.

### Run async control command

This action runs control command in async mode and returns its ID, state and status on completion. 'async' keyword is mandatory. It's always recommended to execute control commands in async mode so they keep running in the background. KQL commands can run for maximum of 1 hour. Also, you get an operation ID of the async command after execution that can be used with [.show operations OPERATION_ID_RETURNED_BY_CMD](kusto/management/operations.md) command to get the status and details of that async command.

The following example triggers an async command to copy the sample 10 records from 'TransformedSysLogs' table to 'TargetTable'.

:::image type="content" source="media/flow/flow-run-asynccontrolcommand.png" alt-text="Screenshot of Azure Data Explorer connector, showing the Run async control command action.":::

### Run control command and render a chart

Use this action to run a [control command](kusto/management/index.md) and get the result as a chart of your choice.

1. Specify the cluster URL. For example, `https://clusterName.eastus.kusto.windows.net`.
1. Enter the name of the database.
1. Specify the control command:
    - Select dynamic content from the apps and connectors used in the flow.
    - Add an expression to access, convert, and compare values.
1. To send the results of this action by email as a table or a chart, specify the chart type. This can be:
    - An HTML table.
    - A pie chart.
    - A time chart.
    - A bar chart.

:::image type="content" source="media/flow/flow-runcontrolcommand.png" alt-text="Screenshot of Run control command and render a chart in recurrence pane.":::

> [!IMPORTANT]
> In the **Cluster Name** field, enter the cluster URL

### Run show control command

This action runs the show control command and returns the result that can be used in the following connectors.

> [!Note]
> This action is specifically for running any of the **.show** commands, there are different actions given above to run other type of commands in sync or async mode.

The following example executes **.show operation** command to find the status of an async command using an operation ID returned by an async command execution.

:::image type="content" source="media/flow/flow-run-showcontrolcommand.png" alt-text="Screenshot of Azure Data Explorer connector, showing the Run show control command action.":::

### Email Kusto query results

You can include a step in any flow to send reports by email, to any email address.

1. Select **+ New Step** to add a new step to your flow.
1. In the search box, enter *Office 365* and select **Office 365 Outlook**.
1. Select **Send an email (V2)**.
1. Enter the email address to which you want the email report sent.
1. Enter the subject of the email.
1. Select **Code view**.
1. Place your cursor in the **Body** field, and select **Add dynamic content**.
1. Select **BodyHtml**.
    :::image type="content" source="media/flow/flow-send-email.png" alt-text="Screenshot of Send an email dialog box, with Body field and BodyHtml highlighted.":::
1. Select **Show advanced options**.
1. Under **Attachments Name -1**, select **Attachment Name**.
1. Under **Attachments Content**, select **Attachment Content**.
1. If necessary, add more attachments.
1. If necessary, set the importance level.
1. Select **Save**.

:::image type="content" source="media/flow/flow-add-attachments.png" alt-text="Screenshot of Send an email dialog box, with Attachments Name, Attachments Content, and Save highlighted.":::

## Create an Azure Data Explorer connection

To run a flow that contains an Azure Data Explorer connector, you must use a valid Azure Data Explorer [connection](/power-automate/add-manage-connections). You can create new connection on the :::no-loc text="Power Automate"::: left pane, select **Data** > [Connections](/power-automate/add-manage-connections) or from within the flow, select the Azure Data Explorer connector's menu > **Add new connection**.


### Authentication

You can authenticate with user credentials, or with an Azure Active Directory (Azure AD) application.

> [!Note]
> Make sure your application is an [Azure AD application](./provision-azure-ad-app.md), and is authorized to run queries on your cluster.

1. In **Run KQL query**, select the three dots at the top right of the power automate connector.

    :::image type="content" source="media/flow/flow-addconnection.png" alt-text="Screenshot of Azure Data Explorer connection, showing the authentication option.":::

1. Select **Add new connection** > You get two options

### Sign in

1. When you connect for the first time, you're prompted to sign in.

1. Select **Sign in**, and enter your credentials.

:::image type="content" source="media/flow/flow-signin.png" alt-text="Screenshot of Azure Data Explorer connection, showing the sign-in option.":::

### Connect with Service Principal

:::image type="content" source="media/flow/flow-signin.png" alt-text="Screenshot of Azure Data Explorer connection, showing the connect with Service Principal option.":::

1. Enter the required information:
    - Connection Name: A descriptive and meaningful name for the new connection.
    - Client ID: Your application ID.
    - Client Secret: Your application key.
    - Tenant: The ID of the Azure AD directory in which you created the application.

:::image type="content" source="media/flow/flow-appauth.png" alt-text="Screenshot of Azure Data Explorer connection, showing the application authentication dialog box.":::

When authentication is complete, you'll see that your flow uses the newly added connection.

:::image type="content" source="media/flow/flow-appauthcomplete.png" alt-text="Screenshot of the completed application authentication.":::

From now on, this flow will run by using these application credentials.

## Check if your flow succeeded

To check if your flow succeeded, see the flow's run history:

1. Go to the [:::no-loc text="Power Automate"::: home page](https://flow.microsoft.com/).
1. From the main menu, select [My flows](https://flow.microsoft.com/manage/flows).

    :::image type="content" source="media/flow/flow-myflows.png" alt-text="Screenshot of Power Automate main menu, showing My flows highlighted":::

1. On the row of the flow you want to investigate, select the more commands icon, and then select **Run history**.

    :::image type="content" source="media/flow//flow-runhistory.png" alt-text="Screenshot of My flows tab, showing Run history highlighted.":::

    All flow runs are listed, with information about start time, duration, and status.
    :::image type="content" source="media/flow/flow-runhistoryresults.png" alt-text="Screenshot of Run history results page.":::

    For full details about the flow, on **[My flows](https://flow.microsoft.com/manage/flows)**, select the flow you want to investigate.

    :::image type="content" source="media/flow/flow-fulldetails.png" alt-text="Screenshot of Run history full results page.":::

To see why a run failed, select the run start time. The flow appears, and the step of the flow that failed is indicated by a red exclamation point. Expand the failed step to view its details. The **Details** pane on the right contains information about the failure so that you can troubleshoot it.

:::image type="content" source="media/flow/flow-error.png" alt-text="Screenshot of flow error page.":::

## Timeout exceptions

Your flow can fail and return a "RequestTimeout" exception if it runs for more than 90 seconds.

:::image type="content" source="media/flow/flow-requesttimeout.png" alt-text="Screenshot of the flow request timeout exception error.":::

To fix a timeout issue, make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query. For more information, see [Query best practices](kusto/query/best-practices.md).

The same query might run successfully in Azure Data Explorer, where the time isn't limited and can be changed.

## Limitations

- Results returned to the client are limited to 500,000 records. The overall memory for those records can't exceed 64 MB and a time of 90 seconds to run.
- The connector doesn't support operators that aren't supported by the [`getschema` operator](kusto/query/getschemaoperator.md). For example, the [fork](kusto/query/forkoperator.md), [facet](kusto/query/facetoperator.md), and [evaluate](kusto/query/evaluateoperator.md) operators aren't supported.
- Flow works best on Microsoft Edge and Google Chrome.

## Next steps

Learn about the [Azure Kusto Logic App connector](kusto/tools/logicapps.md), which is another way to run Kusto queries and commands automatically, as part of a scheduled or triggered task.
