---
title: Azure Data Explorer connector to Power Apps
description: Learn how to create an application in Power Apps based on data in Azure Data Explorer
author: orspod
ms.author: orspodek
ms.reviewer: olgolden
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/20/2020
---
# Azure Data Explorer connector to Power Apps (preview)

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more.

Power Apps is a suite of apps, services, connectors, and data platform that provides a rapid application development environment to build custom apps for your business needs. Use Power Apps to quickly build custom business apps that connect to your business data. The Power Apps connector is particularly useful if you have a large and growing collection of streaming data in Azure Data Explorer and want to build a low code, highly functional app to make use of this data. In this article, you will create a Power Apps application based on Azure Data Explorer data, and see the steps of data parameterization, retrieval, and presentation.

## Prerequisites

* Power platform license. Get started at [https://powerapps.microsoft.com](https://powerapps.microsoft.com).
* Familiarity with the [Power Apps suite](https://docs.microsoft.com/powerapps/powerapps-overview).

:::image type="content" source="media/power-apps-connector/power-apps.png" alt-text="Power Apps portal":::

## Connect to Azure Data Explorer Connector

1. Navigate to [https://make.preview.powerapps.com/](https://make.preview.powerapps.com/) and sign-in.

1. Select **Connections** in the left-hand menu.
1. Select **“+ New connection”**.ֵ

    :::image type="content" source="media/power-apps-connector/new-connection.png" alt-text="Create a new connection in Power Apps":::

1. Search for **Azure Data Explorer** in the search bar. Select **Azure Data Explorer** from the resulting options.

    :::image type="content" source="media/power-apps-connector/search-adx.png" alt-text="Search and select Azure Data Explorer connection in Power Apps":::

1. Select **Create** on the “Azure Data Explorer” popup. Provide credentials as required.

    :::image type="content" source="media/power-apps-connector/create-connector.png" alt-text="Create connector to Azure Data Explorer - popup window":::

## Create App

1. Navigate to Power Apps and select **Apps** in the left-hand menu.
1. Select **“+ New app”** in the menu bar.
1. Select **Canvas** from the resulting dropdown.

    :::image type="content" source="media/power-apps-connector/create-new-app.png" alt-text="Create a new app and canvas - Power Apps connector to Azure Data Explorer":::

1. Select **“Tablet layout”** in the **“Blank app”** section.

    :::image type="content" source="media/power-apps-connector/blank-canvas.png" alt-text="Start with a blank canvas in tablet layout - Power Apps connector to Azure Data Explorer":::

### Add Connector

1. Click on the **Data** icon on the left-hand navigation. 
1. Expand **Connectors**.
1. Select **“Azure Data Explorer”** in the resulting options.

    :::image type="content" source="media/power-apps-connector/data-connectors-adx.png" alt-text="Add a connector to Azure Data Explorer in Power Apps":::

You will see a new area called **“In your app”** with **“Azure Data Explorer”** now included.

   :::image type="content" source="media/power-apps-connector/adx-appears.png" alt-text="Azure Data Explorer now appears in In your app area in Power Apps":::

### Save Your App

1. Select **File** in the menu bar. 
1. Select **Save** in the left-hand navigation.

    :::image type="content" source="media/power-apps-connector/save-app.png" alt-text="Save your app to Power Apps":::

1. Enter a meaningful name for your app. Click the **Save** button in the lower right.

    :::image type="content" source="media/power-apps-connector/app-is-saved.png" alt-text="Your new Power App connected to Azure Data Explorer has been saved":::

### Advanced Settings

1. Select **Settings** in the left-hand menu.
1. Select **“Advanced settings”**.
1. Scroll through the resulting options and find **“Dynamic schema”**. Enable this feature.

    :::image type="content" source="media/power-apps-connector/dynamic-schema.png" alt-text="Turn on dynamic schema setting in Power Apps - connection to Azure Data Explorer":::

1. Search for the **Data row limit for non-delegable queries** setting. Set your returned records limit.

    :::image type="content" source="media/power-apps-connector/set-limit.png" alt-text="Set return results limit in Power Apps - Azure Data Explorer":::

    > [!NOTE]
    > The default limit is 500, with a maximum of 2,000 returned records.

> [!IMPORTANT]
> Save your app again and restart as required.

### Add Dropdown

1. Select **Insert** in the menu bar. 
1. Select **Input** in the resulting sub menu bar. 
1. Select **“Drop down”** in the resulting dropdown.
1. Click on the **Advanced** tab in the right-hand popout.
1. Populate the **Items** input box with: ["CALIFORNIA","MICHIGAN"]

    :::image type="content" source="media/power-apps-connector/populate-dropdown.png" alt-text="Populate items in dropdown menu":::

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
    
1. Click the **“Capture schema”** button. Allow time for processing.

    :::image type="content" source="media/power-apps-connector/capture-schema.png" alt-text="Select capture schema button in dropdown menu":::

### Add Data Table

1. Select **Insert** in the menu bar. 
1. Select **“Data table”** in the resulting sub menu bar.
1. Reposition the data table and consider adding a border for visibility.
1. Select the **Properties** tab in the right-hand popout. Select Results from the **“Data Source”** dropdown.
1. Select **“Edit fields”** link. 
1. Select **“+ Add field”** in the resulting popout. 
    
    :::image type="content" source="media/power-apps-connector/insert-data-table-small.png" alt-text="Reposition table and add border" lightbox="media/power-apps-connector/insert-data-table.png":::

1. Select desired fields and click **Add** button. A preview of the selected data table appears.

    :::image type="content" source="media/power-apps-connector/preview-table.png" alt-text="Preview of the table populated with data":::

### Validate

1. Click the **“Preview the app”** button in the upper right of the screen.
1. Try the dropdown, scroll through the data table, and confirm successful data retrieval and presentation.

    :::image type="content" source="media/power-apps-connector/preview-app.png" alt-text="Preview the new app in Power Apps with data from Azure Data Explorer ":::

### Limitations

* Power Apps has a limit of up to 2,000 results records returned to the client. The overall memory for those records can't exceed 64 MB and a time of seven minutes to run.
* The connector doesn't support the [fork](https://docs.microsoft.com/azure/data-explorer/kusto/query/forkoperator) and [facet](https://docs.microsoft.com/azure/data-explorer/kusto/query/facetoperator) operators.
* **Timeout exceptions**: The connector has a timeout limitation of 7 minutes. To avoid potential timeout issue, make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query. For more information, see [Query best practices](https://docs.microsoft.com/azure/data-explorer/kusto/query/best-practices).

## Next steps

