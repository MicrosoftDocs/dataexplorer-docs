---
title: Use Power Apps to query data in Azure Data Explorer
description: Learn how to create an application in Power Apps to query data in Azure Data Explorer.
ms.reviewer: olgolden
ms.topic: how-to
ms.date: 05/22/2023
---
# Use :::no-loc text="Power Apps"::: to query data in Azure Data Explorer

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more.

:::no-loc text="Power Apps"::: is a suite of apps, services, connectors, and data platform that provides a rapid application development environment to build custom apps that connect to your business data. The :::no-loc text="Power Apps"::: connector is useful if you have a large and growing collection of streaming data in Azure Data Explorer and want to build a low code, highly functional app to make use of this data. In this article, you create a :::no-loc text="Power Apps"::: application to query Azure Data Explorer data.

## Prerequisites

* Power platform license. Get started at [https://powerapps.microsoft.com](https://powerapps.microsoft.com).
* Familiarity with the [:::no-loc text="Power Apps"::: suite](/powerapps/powerapps-overview).

## 1- Connect to Azure Data Explorer Connector

1. Go to [https://make.powerapps.com/](https://make.powerapps.com/) and sign in.
1. On the left menu, select **more** > **Connections**.
1. Select **+ New connection**.

    :::image type="content" source="media/power-apps-connector/new-connection.png" alt-text="Screenshot of the connections page, highlighting the create a new connection button.":::

1. Search for *Azure Data Explorer*, and then select **Azure Data Explorer**.

    :::image type="content" source="media/power-apps-connector/search-adx.png" alt-text="Screenshot of the new connection page, showing the search and select Azure Data Explorer connection.":::

1. Select **Create** on the **Azure Data Explorer** window that appears.

    :::image type="content" source="media/power-apps-connector/create-connector.png" alt-text="Screenshot of the Azure Data Explorer connection dialog box, highlighting the create button.":::
1. In the authentication window, sign in to your account.

For more information on the Azure Data Explorer connector in :::no-loc text="Power Apps":::, see [Azure Data Explorer connector](/connectors/kusto)

## 2- Create app

1. On the left menu, select **Apps**.
1. Select **+ New app** > **Start with a page design**.

    :::image type="content" source="media/power-apps-connector/create-new-app.png" alt-text="Screenshot of the apps page, showing the create a new canvas app button.":::
1. Select **Blank canvas**. By default, **Tablet** format is selected.

### Add Connector

1. On the left menu, select **Data**.

    :::image type="content" source="media/power-apps-connector/select-data.png" alt-text="Screenshot of the navigation menu in the new app page. The menu option titled Data is highlighted.":::

1. Select **Add data**.
1. Expand **Connectors**, select **Azure Data Explorer**, and then select your **Azure Data Explorer** user.

    :::image type="content" source="media/power-apps-connector/data-connectors-adx.png" alt-text="Screenshot of the app page showing a list of data connectors. The connector titled Azure Data Explorer is highlighted.":::

**Azure Data Explorer** is now added as a data source.

### Configure data row limit

Optionally, you can set how many records are retrieved from server-based connections where delegation isn't supported.

1. On the menu bar, select **Settings**.
1. In **General** settings, scroll to **Data row limit**, and then set your returned records limit. The default limit is 500.

    :::image type="content" source="media/power-apps-connector/set-limit.png" alt-text="Screenshot of the settings page, showing the return results limit setting.":::

    > [!NOTE]
    > The limit value for returned records is between 1 and 2,000.

### Add Dropdown

1. On the menu bar, select **+Insert**.
1. Select **Input**, and then select **Drop down**. The Drop Down properties pane appears on the rightmost of the canvas.
1. In the properties pane, select the **Advanced** tab.
1. Under **Data**, replace the placeholder text for **Items** with:

    ```kusto
    ["NEW YORK","TEXAS"]
    ```

    A dropdown menu appears on the canvas. Once you have data, you can select California or Michigan by expanding the menu.

    :::image type="content" source="media/power-apps-connector/populate-dropdown.png" alt-text="Screenshot of the app page, showing the populated items in dropdown menu." lightbox="media/power-apps-connector/populate-dropdown.png":::

1. With the dropdown still selected, replace the placeholder text for **OnChange** with the following formula.

    ```kusto
    ClearCollect(
    KustoQueryResults,
    AzureDataExplorer.listKustoResultsPost(
    "https://help.kusto.windows.net",
    "Samples",
    "StormEvents | where State == '" & Dropdown1.SelectedText.Value & "' | take 15"
    ).value
    )
    ```

### Add Data Table

1. Select **+Insert** in the menu bar.
1. Select **Layout** > **Data table**. Reposition the data table as needed.
1. In the properties pane, select the **Advanced** tab.
1. Under **Data**, replace the placeholder text for **Items** with the following function. The following function specifies the desired column type to be mapped out to the formula in [Add Dropdown](#add-dropdown).

    ```kusto
    ForAll( 
    KustoQueryResults, 
    { 
    EventId: Value(Value.EventId), 
    EventType: Text(Value.EventType),
    DamageProperty: Value(Value.DamageProperty) 
    } 
    )
    ```

1. In the properties pane, select the **Properties** tab. The **Data source** is autopopulated with the source specified in the **Items** section of the data table. In this example, the source is `KustoQueryResults`.
1. Select **Edit fields**, and then select **+ Add field**.

    :::image type="content" source="media/power-apps-connector/data-table.png" alt-text="Screenshot of the app canvas showing the selected columns to be added to the data table." lightbox="media/power-apps-connector/data-table.png":::

1. Select desired fields and then select **Add**. A preview of the selected data table appears.

    :::image type="content" source="media/power-apps-connector/preview-table.png" alt-text="Screenshot of the app page, showing a preview of the table populated with data.":::

1. On the top right corner, select **Save**, and then enter a name for your app.

## 3- Validate app

1. Select the **Play** button on the rightmost of the menu bar, or select **F5** to preview the app.
1. Try the dropdown, scroll through the data table, and confirm successful data retrieval and presentation.

## Limitations

* :::no-loc text="Power Apps"::: has a limit of up to 2,000 results records returned to the client. The overall memory for those records can't exceed 64 MB and a time of seven minutes to run.
* The connector doesn't support the [fork](./kusto/query/forkoperator.md) and [facet](./kusto/query/facetoperator.md) operators.
* **Timeout exceptions**: The connector has a timeout limitation of 7 minutes. To avoid potential timeout issue, make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query. For more information, see [Query best practices](./kusto/query/best-practices.md).

For more information on known issues and limitations for querying data using the Azure Data Explorer connector, see [Known issues and limitations](/connectors/kusto/)

## Related content

* [Azure Kusto Logic App connector](kusto/tools/logicapps.md)
