
# Azure Data Explorer connector to Power Apps (Preview)

Power Apps is a suite of apps, services, connectors, and data platform that provides a rapid application development environment to build custom apps for your business needs. Using Power Apps, you can quickly build custom business apps that connect to your business data.<br/>
Azure Data Explorer (ADX) is a fast, fully managed data analytics service for real-time analysis of large volumes of data streaming from applications, websites, IoT devices, and more.

For this exercise, imagine a customer with the following characteristics:
- Large and growing collection of streaming data in Azure Data Explorer
- A desire to build a **low code**, **highly functional app** to make use of this data

## Objective

The following example provides Step-by-Step Instructions for creating a Power Apps application that is based on Azure Data Explorer data, demonstrating data parameterization, retrieval, and presentation.

## Prerequisites

This article assumes you have a Power Platform license and prerequisite knowledge about the [Power Apps suite](https://docs.microsoft.com/en-us/powerapps/powerapps-overview).<br/>
If you don’t already have a working instance of the Power Platform with necessary licensing, you can get started at [https://powerapps.microsoft.com](https://powerapps.microsoft.com).
:::image type="content" source="media/power-apps-connector/Capture (1).png" alt-text="power-appֵֵs-portal":::

## Connect to Azure Data Explorer Connector

Navigate to [https://make.preview.powerapps.com/](https://make.preview.powerapps.com/) and sign-in.
:::image type="content" source="media/power-apps-connector/Capture (2).png" alt-text="power-apps-login":::
Expand **Connections** in the left-hand navigation and select **“+ New connection”**.ֵ
:::image type="content" source="media/power-apps-connector/Capture (3).png" alt-text="new-connection":::
Search and select **“Azure Data Explorer…”** in the resulting options.
:::image type="content" source="media/power-apps-connector/Capture (4).png" alt-text="adx-connector":::
Select **Create** on the “Azure Data Explorer” popup. Provide credentials as required.
:::image type="content" source="media/power-apps-connector/Capture (5).png" alt-text="connect-adx":::

## Create App
Navigate to Power Apps and then **Apps** in the left-hand navigation.<br/>
Select **“+ New app”** in the menu bar and then **Canvas** from the resulting dropdown.
:::image type="content" source="media/power-apps-connector/Capture (6).png" alt-text="new-app":::
Select **“Tablet layout”** in the **“Blank app”** section.
:::image type="content" source="media/power-apps-connector/Capture (2).png" alt-text="tablet":::

### Add Connector
Click on the **Data** icon on the left-hand navigation. Expand **Connectors** and click on **“Azure Data Explorer”** in the resulting options.
:::image type="content" source="media/power-apps-connector/Capture (7).png" alt-text="connect-data":::
You should see a new area called **“In your app”** with **“Azure Data Explorer”** now included.
:::image type="content" source="media/power-apps-connector/Capture (8).png" alt-text="connected":::

### Save Your App
Click **File** in the menu bar. Click **Save** in the left-hand navigation.
:::image type="content" source="media/power-apps-connector/Capture (9).png" alt-text="save":::
Enter a meaningful name for your app. Click the **Save** button in the lower right.
:::image type="content" source="media/power-apps-connector/Capture (10).png" alt-text="saved":::

### Advanced Settings
Click **Settings** in the resulting left-hand navigation.<br/>
Click **“Advanced settings”**, scroll through the resulting options and find **“Dynamic schema”**. Turn on this feature.
:::image type="content" source="media/power-apps-connector/Capture (11).png" alt-text="dynamic-schema":::
**Important:** Save your app again and restart as required.

### Add Dropdown
Click **Insert** in the menu bar. Click **Input** in the resulting sub menu bar. Click **“Drop down”** in the resulting dropdown.<br/>
Click on the **Advanced** tab in the right-hand popout.<br/>
Populate the **Items** input box with: ["CALIFORNIA","MICHIGAN"]
:::image type="content" source="media/power-apps-connector/Capture (12).png" alt-text="dropdown":::
With the **dropdown** still selected, select **OnChange** from the **Property** dropdown in the formula bar.
Enter the following formula:

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

Click the **“Capture schema”** button. Allow time for processing.
:::image type="content" source="media/power-apps-connector/Capture (13).png" alt-text="filter":::

### Add Data Table
Select **Insert** in the menu bar. Select **“Data table”** in the resulting sub menu bar. <br/>
Reposition the data table and consider adding a border for visibility.
:::image type="content" source="media/power-apps-connector/Capture (14).png" alt-text="table":::
Select the **Properties** tab in the right-hand popout. Select Results from the **“Data Source”** dropdown.
Select **“Edit fields”** link. Select **“+ Add field”** in the resulting popout. Select desired fields and click **Add** button.
![](media/cf479ae1aeb8815f658275efcdd9b35b.png)

### Validate
Click the **“Preview the app”** button in the upper right of the screen.
:::image type="content" source="media/power-apps-connector/Capture (15).png" alt-text="preview":::
Try the dropdown, scroll through the data table, and confirm successful data retrieval and presentation.

### Limitations
- Results returned to the client are limited to 500,000 records. The overall memory for those records can't exceed 64 MB and a time of seven minutes to run.
- The connector doesn't support the [fork](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/forkoperator) and [facet](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/facetoperator) operators.
- Timeout exceptions - the connector has a timeout limitation of 7 minutes. To avoid potential timeout issue, make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query. For more information, see [Query best practices](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/best-practices).<br/>
