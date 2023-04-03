---
title: Create Power Apps application to query data in Azure Data Explorer
description: Learn how to create an application in Power Apps based on data in Azure Data Explorer
ms.reviewer: olgolden
ms.topic: how-to
ms.date: 04/02/2023
---
# Create :::no-loc text="Power Apps"::: application to query data in Azure Data Explorer

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more.

:::no-loc text="Power Apps"::: is a suite of apps, services, connectors, and data platform that provides a rapid application development environment to build custom apps that connect to your business data. The :::no-loc text="Power Apps"::: connector is useful if you have a large and growing collection of streaming data in Azure Data Explorer and want to build a low code, highly functional app to make use of this data. In this article, you'll create an :::no-loc text="Power Apps"::: application to query Azure Data Explorer data. During this process, you'll see the steps of data parameterization, retrieval, and presentation.

## Prerequisites

* Power platform license. Get started at [https://powerapps.microsoft.com](https://powerapps.microsoft.com).
* Familiarity with the [:::no-loc text="Power Apps"::: suite](/powerapps/powerapps-overview).

## Connect to Azure Data Explorer Connector

1. Navigate to [https://make.powerapps.com/](https://make.powerapps.com/) and sign-in.

1. On the left menu, select **more** > **Connections**.
1. Select **+ New connection**.

    :::image type="content" source="media/power-apps-connector/new-connection.png" alt-text="Screenshot of the connections page, highlighting the create a new connection button.":::

1. Search for **Azure Data Explorer** in the search bar. Select **Azure Data Explorer** from the resulting options.

    :::image type="content" source="media/power-apps-connector/search-adx.png" alt-text="Screenshot of the new connection page, showing the search and select Azure Data Explorer connection.":::

1. Select **Create** on the **Azure Data Explorer** popup. Provide credentials as required.

    :::image type="content" source="media/power-apps-connector/create-connector.png" alt-text="Screenshot of the Azure Data Explorer connection dialog box, highlighting the create button.":::

## Create App

1. On the left menu, select **Apps**.
1. Select **+ New app** > **Canvas** in the menu bar.

    :::image type="content" source="media/power-apps-connector/create-new-app.png" alt-text="Screenshot of the apps page, showing the create a new canvas app button.":::

1. Provide an app name, and under **Format**, select **Tablet**.

    :::image type="content" source="media/power-apps-connector/blank-canvas.png" alt-text="Screenshot of the new app page, showing highlighting the tablet layout option.":::

### Add Connector

1. On the left menu, select **Data**\.
1. Select **Add data**, expand **Connectors**, and then elect **Azure Data Explorer**.

    :::image type="content" source="media/power-apps-connector/data-connectors-adx.png" alt-text="Screenshot of the app page, showing the add connector to Azure Data Explorer option.":::

Under **Data**, you'll now see the **Azure Data Explorer** app in the list of connectors.

   :::image type="content" source="media/power-apps-connector/adx-appears.png" alt-text="Screenshot of the app page, showing the Azure Data Explorer in the list of data connectors.":::

### Save Your App

1. Select **File** in the menu bar.
1. Select **Save** in the left-hand navigation.

    :::image type="content" source="media/power-apps-connector/save-app.png" alt-text="Screenshot of the app page, showing the save button.":::

1. Enter a meaningful name for your app. Select the **Save** button in the lower right.

### Advanced Settings

1. On the left menu, select **Settings**.
1. Select **Advanced settings**.
1. Select **Dynamic schema** from resulting options. Enable this feature.

    :::image type="content" source="media/power-apps-connector/dynamic-schema.png" alt-text="Screenshot of the settings page, showing the turn on dynamic schema setting.":::

1. Search for the **Data row limit for non-delegable queries** setting. Set your returned records limit.

    :::image type="content" source="media/power-apps-connector/set-limit.png" alt-text="Screenshot of the settings page, showing the return results limit setting.":::

    > [!NOTE]
    > The default limit is 500, with a maximum of 2,000 returned records.

> [!IMPORTANT]
> Save your app again and restart as required.

### Add Dropdown

1. Select **Insert** in the menu bar.
1. Select **Input** in the resulting sub menu bar.
1. Select **Drop down** in the resulting dropdown.
1. Select on the **Advanced** tab in the right-hand popout.
1. Populate the **Items** input box with: ["CALIFORNIA","MICHIGAN"]

    :::image type="content" source="media/power-apps-connector/populate-dropdown.png" alt-text="Screenshot of the app page, showing the populate items in dropdown menu." lightbox="media/power-apps-connector/populate-dropdown.png":::

1. With the **dropdown** still selected, select **OnChange** from the **Property** dropdown in the formula bar.

1. Enter the following formula:

    ```kusto
    ClearCollect(
    Results,
    AzureDataExplorer.listKustoResultsPost(
    "https://help.kusto.windows.net",
    "Samples",
    "StormEvents | where State == '" & Dropdown1.SelectedText.Value & "' | take 15"
    ).value
    )
    ```

1. Select the **Capture schema** button. Allow time for processing.

    :::image type="content" source="media/power-apps-connector/capture-schema.png" alt-text="Screenshot of the app page, showing the select capture schema button in the dropdown menu.":::

### Add Data Table

1. Select **Insert** in the menu bar.
1. Select **Data table** in the resulting sub menu bar.
1. Reposition the data table and consider adding a border for visibility.
1. Select the **Properties** tab in the right-hand popout. Select Results from the **Data Source** dropdown.
1. Select **Edit fields** link.
1. Select **+ Add field** in the resulting popout.

    :::image type="content" source="media/power-apps-connector/insert-data-table-small.png" alt-text="Screenshot of the app page, showing the repositioning of a table and adding border." lightbox="media/power-apps-connector/insert-data-table.png":::

1. Select desired fields and select **Add** button. A preview of the selected data table appears.

    :::image type="content" source="media/power-apps-connector/preview-table.png" alt-text="Screenshot of the app page, showing a preview of the table populated with data.":::

### Validate

1. Select the **Preview the app** button in the upper right of the screen.
1. Try the dropdown, scroll through the data table, and confirm successful data retrieval and presentation.

    :::image type="content" source="media/power-apps-connector/preview-app.png" alt-text="Screenshot of the app page, showing a preview the new app with data from Azure Data Explorer.":::

### Limitations

* :::no-loc text="Power Apps"::: has a limit of up to 2,000 results records returned to the client. The overall memory for those records can't exceed 64 MB and a time of seven minutes to run.
* The connector doesn't support the [fork](./kusto/query/forkoperator.md) and [facet](./kusto/query/facetoperator.md) operators.
* **Timeout exceptions**: The connector has a timeout limitation of 7 minutes. To avoid potential timeout issue, make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query. For more information, see [Query best practices](./kusto/query/best-practices.md).

## Next steps

Learn about the [Azure Kusto Logic App connector](kusto/tools/logicapps.md), which is another way to run Kusto queries and commands automatically, as part of a scheduled or triggered task.
