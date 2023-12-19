---
title: Usage examples for Azure Data Explorer connector to Power Automate
description: Learn some common usage examples for Azure Data Explorer connector to Power Automate.
ms.reviewer: miwalia
ms.topic: how-to
ms.date: 05/04/2022
no-loc: [Power Automate]
---

# Usage examples for Azure Data Explorer connector to Power Automate

The Azure Data Explorer Power Automate (previously Microsoft flow) connector allows Azure Data Explorer to use the flow capabilities of [Microsoft Power Automate](https://flow.microsoft.com/). You can run Kusto queries and commands automatically, as part of a scheduled or triggered task. This article includes several common Power Automate connector usage examples.

For more information, see [Azure Data Explorer Power Automate connector](flow.md).

## Power Automate connector and your SQL database

Use the Power Automate connector to query your data and aggregate it in an SQL database.

> [!Note]
> Only use the Power Automate connector for small amounts of output data. The SQL insert operation is done separately for each row.

:::image type="content" source="media/flow-usage/flow-sql-example.png" alt-text="Screenshot of SQL connector, showing querying data by using the Power Automate connector.":::

## Push data to a Microsoft Power BI dataset

You can use the Power Automate connector with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

1. Create a new **Run query and list results** action.
1. Select **New step**.
1. Select **Add an action**, and search for Power BI.
1. Select **Power BI** > **Add rows to a dataset**.

    :::image type="content" source="media/flow-usage/flow-power-bi-connector.png" alt-text="Screenshot of Power BI connector, showing add row to a dataset action.":::

1. Enter the **Workspace**, **Dataset**, and **Table** to which data will be pushed.
1. From the dynamic content dialog box, add a **Payload** that contains your dataset schema and the relevant Kusto query results.

    :::image type="content" source="media/flow-usage/flow-power-bi-fields.png" alt-text="Screenshot of Power BI action, showing action fields.":::

The flow automatically applies the Power BI action for each row of the Kusto query result table.

:::image type="content" source="media/flow-usage/flow-power-bi-foreach.png" alt-text="Screenshot of the Power BI action for each row.":::

## Conditional queries

You can use the results of Kusto queries as input or conditions for the next Power Automate actions.

In the following example, we query Kusto for incidents that occurred during the last day. For each resolved incident, a Slack message is posted and a push notification is created.
For each incident that is still active, we query Kusto for more information about similar incidents. It sends that information as an email, and opens a related task in Azure DevOps Server.

Follow these instructions to create a similar flow:

1. Create a new **Run query and list results** action.
1. Select **New step** > **Condition control**.
1. From the dynamic content window, select the parameter you want to use as a condition for the next actions.
1. Select the type of *Relationship* and *Value* to set a specific condition on the particular parameter.

    :::image type="content" source="media/flow-usage/flow-condition-inline.png" alt-text="Screenshot showing the use of flow conditions based on the results of a Kusto query to determine the next flow action." lightbox="media/flow-usage/flow-condition.png":::

    The flow applies this condition on each row of the query result table.
1. Add actions for when the condition is true and false.

    :::image type="content" source="media/flow-usage/flow-condition-actions-inline.png" alt-text="Screenshot showing adding actions for when a condition is true or false, flow conditions based on Kusto query results." lightbox="media/flow-usage/flow-condition-actions.png":::

You can use the result values from the Kusto query as input for the next actions. Select the result values from the dynamic content window.
In the following example, we add a **Slack - Post Message** action and a **Visual Studio - Create a new work item** action, containing data from the Kusto query.

:::image type="content" source="media/flow-usage/flow-slack.png" alt-text="Screenshot of Slack - Post Message action.":::

:::image type="content" source="media/flow-usage/flow-visual-studio.png" alt-text="Screenshot of Visual Studio action.":::

In this example, if an incident is still active, query Kusto again to get information about how incidents from the same source were solved in the past.

:::image type="content" source="media/flow-usage/flow-condition-query.png" alt-text="Screenshot of flow condition query.":::

Visualize this information as a pie chart, and email it to the team.

:::image type="content" source="media/flow-usage/flow-condition-email.png" alt-text="Screenshot of flow condition email.":::

## Email multiple Azure Data Explorer flow charts

1. Create a new flow with the recurrence trigger, and define the interval and frequency of the flow.
1. Add a new step, with one or more **Kusto - Run query and visualize results** actions.

    :::image type="content" source="media/flow-usage/flow-several-queries.png" alt-text="Screenshot of running several queries in a flow.":::

1. For each **Kusto - Run query and visualize result** action, define the following fields:
    * Cluster URL.
    * Database Name.
    * Query and Chart Type (for example, HTML table, pie chart, time chart, bar chart, or a custom value).

    :::image type="content" source="media/flow-usage/flow-visualize-results-multiple-attachments.png" alt-text="Screenshot of visualizing results with multiple attachments.":::

1. Add a **Send an email (v2)** action:
    1. In the body section, select the code view icon.
    1. In the **Body** field, insert the required **BodyHtml** so that the visualized result of the query is included in the body of the email.
    1. To add an attachment to the email, add **Attachment Name** and **Attachment Content**.

    :::image type="content" source="media/flow-usage/flow-email-multiple-attachments.png" alt-text="Screenshot of emailing multiple attachments.":::

    For more information about creating an email action, see [Email Kusto query results](flow.md#email-kusto-query-results).

Results:

:::image type="content" source="media/flow-usage/flow-results-multiple-attachments.png" alt-text="Screenshot showing results of multiple email attachments, visualized as a pie chart and bar chart." lightbox="media/flow-usage/flow-results-multiple-attachments.png":::

:::image type="content" source="media/flow-usage/flow-results-multiple-attachments-2.png" alt-text="Screenshot showing results of multiple email attachments, visualized as a time chart." lightbox="media/flow-usage/flow-results-multiple-attachments-2.png":::

## Related content

* Use the [Azure Kusto Logic App connector](kusto/tools/logicapps.md) to run Kusto queries and commands as part of a scheduled or triggered task.
